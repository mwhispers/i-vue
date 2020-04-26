import { isUndef, isObject } from "../../shared/util";
import VNode from "./vnode";

export function createComponent(
    Ctor,
    data,
    context,
    children,
    tag
){
    if(isUndef(Ctor)){
        return
    }

    const baseCtor = context.$options._base;

    if(isObject(Ctor)){
        Ctor = baseCtor.extend(Ctor);
    }

    data = data || {};

    installComponentHooks(data);

    const name = Ctor.options.name || tag;

    const vnode = new VNode(
        `vue-component-${Ctor.id}${name ? `-${name}` : ''}`,
        data,
        undefined,
        undefined,
        undefined,
        context,
        { Ctor, undefined, undefined, tag, children }
    );
    return vnode;
}

const componentVNodeHooks = {
    init(vnode, hydrating){
        const child = vnode.componentInstance = createComponentInstanceForVnode(
            vnode
        );
        child.$mount(undefined, hydrating);
    }
}

const hooksToMerge = Object.keys(componentVNodeHooks);

export function createComponentInstanceForVnode(vnode, parent){
    const options = {
        _isComponent:true,
        _parentVnode:vnode,
        parent
    }

    return new vnode.componentOptions.Ctor(options);
}

function installComponentHooks(data){
    const hooks = data.hook || (data.hook = {});
    for(let i = 0; i < hooksToMerge.length; i++){
        const key = hooksToMerge[i];
        const existing = hooks[key];
        const toMerge = componentVNodeHooks[key];
        if(existing !== toMerge && !(existing && existing._merged)){
            hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge;
        }
    }
}

function mergeHook(f1, f2){
    const merged = (a, b) => {
        f1(a, b);
        f2(a, b);
    }

    merged._merged = true;
    return merged;
}