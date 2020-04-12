export function initLifecycle(vm){
    const options = vm.$options;

    let parent = options.parent;
    if(parent && !options.abstract){
        while(parent.$options.abstract && parent.$parent){
            parent = parent.$parent;
        }
        parent.$children.push(vm);
    }
    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
}

export function lifecycleMixin(iVue){
    iVue.prototype._update = function(vnode,hydrating){
        const vm = this;
        const prevEl = vm.$el;
        const prevVnode = vm._vnode;
        //TODO
        // const restoreActiveInstance = setActiveInstance(vm);
        vm._vnode = vnode;
        if(!prevVnode){
            vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false);
        }else{
            vm.$el = vm.__patch__(prevVnode,vnode);
        }
    }
}

export function mountComponent(vm, el, hydrating){
    vm.$el = el;
    console.log(el);
    let updateComponent = ()=>{
        vm._update(vm._render(),hydrating);
    };
    updateComponent();
}