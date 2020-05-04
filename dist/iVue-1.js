var iVue = (function () {
    'use strict';

    let warn = function(){};
    {
        warn = (msg,vm)=>{
            console.error(`[iVue warn]: ${mag}`);
        };
    }

    class VNode{
        tag;
        data;
        children;
        text;
        elm;
        context;
        componentOptions;

        isComment;
        
        constructor(tag, data, children,text, elm, context, componentOptions){
            this.tag = tag;
            this.data = data;
            this.children = children;
            this.text = text;
            this.elm = elm;
            this.context = context;
            this.componentOptions = componentOptions;

            this.isComment = false;
        }
    }

    function createTextVNode(val){
        return new VNode(undefined, undefined, undefined,String(val));
    }

    function extend(to, _from){
        for(const key in _from){
            to[key] = _from[key];
        }

        return to;
    }

    function toObject (arr){
        const res = {};
        for(let i = 0; i < arr.length; i++){
            if(arr[i]){
                extend(res,arr[i]);
            }
        }
        return res;
    }

    function isPrimitive(value){
        return (
            typeof value === 'string' || 
            typeof value === 'number' ||
            typeof value === 'boolean' 
        )
    }

    function isDef(v){
        return v !== undefined && v !== null;
    }

    function isUndef(v){
        return v === undefined || v === null;
    }

    function isObject(obj){
        return obj !== null && typeof obj === 'object';
    }

    function cached(fn){
        const cache = Object.create(null);
        return function cachedFn(str){
            const hit = cache[str];
            return hit || (cache[str] = fn(str));
        }
    }

    const camelizeRE = /-(\w)/g;

    const camelize = cached((str)=>{
        return str.replace(camelizeRE,(_, c) => c ? c.toUpperCase() : '');
    });

    const hyphenateRE = /\B([A-Z]])/g;

    const hyphenate = cached((str)=>{
        return str.replace(hyphenateRE, '-$1').toLowerCase()
    });

    function normalizeChildren(children){
        return isPrimitive(children)
          ? [createTextVNode(children)]
          : children
    }

    function createComponent(
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
    };

    const hooksToMerge = Object.keys(componentVNodeHooks);

    function createComponentInstanceForVnode(vnode, parent){
        const options = {
            _isComponent:true,
            _parentVnode:vnode,
            parent
        };

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
        };

        merged._merged = true;
        return merged;
    }

    function createElement(context, tag, data, children,normalizationType,alwaysNormalize){
        if(Array.isArray(data) || isPrimitive(data)){
            children = data;
            data = undefined;
        }
        return _createElement(context, tag, data, children);
    }

    function _createElement(context, tag, data, children,normalizationType){
        children = normalizeChildren(children);
        if(typeof(tag) === 'object'){
            return createComponent(tag, data, context,children)
        }
        return new VNode(tag,data,children,undefined,undefined);
    }

    function initRender(vm){
        vm._c = (a, b, c, d) => createElement(vm, a, b, c);
        vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c);
    }

    function renderMixin(iVue){
        iVue.prototype._render = function(){
            const vm = this;
            const {render,_parentVnode} = vm.$options;

            vm.$vnode = _parentVnode;

            let vnode = render.call(vm, vm.$createElement);
            return vnode;
        };
    }

    let uid = 0;
    function initMixin(iVue){
        iVue.prototype._init = function(options){
            const vm = this;
            vm._uid = uid++;
            vm._isVue = true;
            //TODO expand
            vm.$options = mergeOptions(vm.constructor.options,options);
            vm.$options._base = iVue;

            initRender(vm);

            if(vm.$options.el){
                vm.$mount(vm.$options.el);
            }
        };
    }

    function mergeOptions(ctorOptions,options){
        if(!ctorOptions){
            ctorOptions = {};
        }
        for(let prop in options){
            ctorOptions[prop] = options[prop];
        }
        return ctorOptions;
    }

    function lifecycleMixin(iVue){
        iVue.prototype._update = function(vnode,hydrating){
            const vm = this;
            const prevEl = vm.$el;
            const prevVnode = vm._vnode;
            //TODO
            // const restoreActiveInstance = setActiveInstance(vm);
            vm._vnode = vnode;
            if(!prevVnode){
                vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false);
            }else {
                vm.$el = vm.__patch__(prevVnode,vnode);
            }
        };
    }

    function mountComponent(vm, el, hydrating){
        vm.$el = el;
        console.log(el);
        let updateComponent = ()=>{
            vm._update(vm._render(),hydrating);
        };
        updateComponent();
    }

    function iVue(options){
        if(!this instanceof iVue){
            warn("iVue is a constructor and should be called by `new` keyword");
        } 
        this._init(options);
    }

    initMixin(iVue);
    lifecycleMixin(iVue);
    renderMixin(iVue);

    function initExtend(Vue){
        Vue.cid = 0;
        let cid = 1;

        Vue.extend = function(extendOptions){
            extendOptions = extendOptions || {};
            const Super = this;
            const SuperId = Super.cid;
            const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
            if(cachedCtors[SuperId]){
                return cachedCtors[SuperId];
            }

            const Sub = function VueComponent(options){
                this._init(options);
            };

            Sub.prototype = Object.create(Super.prototype);
            Sub.prototype.constructor = Sub;
            Sub.cid = cid++;
            Sub.options = extendOptions;
            Sub['super'] = Super;
            return Sub;
        };
    }

    function initGlobalAPI(iVue){
        initExtend(iVue);
    }

    initGlobalAPI(iVue);

    iVue.version = '_VERSION_';

    function query(el){
        if(typeof el === 'string'){
            const selected = document.querySelector(el);
            if(!selected){
                warn('Cannot find element : ' + el);
                return document.createElement('div');
            }
            return selected;
        }else {
            return el;
        }
    }

    const emptyNode = new VNode('', {}, []);

    const hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

    function createPatchFunction(backend) {

        let i, j;

        const cbs = {};

        const { modules, nodeOps} = backend;

        for(i = 0; i < hooks.length; i++){
            cbs[hooks[i]] = [];
            for(j = 0; j < modules.length; j++){
                if(isDef(modules[j][hooks[i]])){
                    cbs[hooks[i]].push(modules[j][hooks[i]]);
                }
            }
        }

        function emptyNodeAt(elm) {
            return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm);
        }

        function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
            let i = vnode.data;
            if (isDef(i)) {
                if (isDef(i = i.hook) && isDef(i = i.init)) {
                    i(vnode, false);
                }

                if (isDef(vnode.componentInstance)) {
                    initComponent(vnode);
                    insert(parentElm, vnode.elm);
                    return true
                }
            }
            return false
        }

        function initComponent(vnode, insertedVnodeQueue) {
            vnode.elm = vnode.componentInstance.$el;
        }

        function createElm(vnode, insertedVnodeQueue, parentElm, refElm) {

            if (createComponent(vnode, insertedVnodeQueue, parentElm)) {
                return
            }

            const data = vnode.data;
            const children = vnode.children;
            const tag = vnode.tag;

            vnode.elm = document.createElement(tag);

            if (tag) {
                createChildren(vnode, children, []);
                if(isDef(data)){
                    invokeCreateHooks(vnode);
                }
                if (parentElm) {
                    insert(parentElm, vnode.elm);
                }
            } else {
                vnode.elm = document.createTextNode(vnode.text);
                insert(parentElm, vnode.elm);
            }



        }

        function createChildren(vnode, children, insertedVnodeQueue) {
            if (Array.isArray(children)) {
                for (let i = 0; i < children.length; ++i) {
                    createElm(children[i], insertedVnodeQueue, vnode.elm);
                }
            } else if (isPrimitive(vnode.text)) {
                vnode.elm.appendChild(document.createTextNode(vnode.text));
            }

        }

        function invokeCreateHooks(vnode, insertedVnodeQueue){
            for(let i = 0; i < cbs.create.length; i++){
                cbs.create[i](emptyNode, vnode);
            }
        }

        function insert(parent, elm, ref) {
            parent.appendChild(elm);
        }

        return function patch(oldVnode, vnode, hydrating, removeonly) {
            console.log(vnode);
            if (isUndef(oldVnode)) {
                createElm(vnode, {});
            } else {
                const isRealElement = oldVnode.nodeType != null;

                if (isRealElement) {
                    oldVnode = emptyNodeAt(oldVnode);
                }

                const oldElm = oldVnode.elm;
                const parentElm = nodeOps.parentNode(oldElm);

                createElm(vnode, [], parentElm);
            }

            return vnode.elm;
        }
    }

    const parseStyleText = cached(function(cssText) {
        const res = {};
        const listDelimiter = /;(?![^(]*\))/g;
        const propertyDelimiter = /:(.+)/;
        cssText.split(listDelimiter).forEach(function(item) {
            if(item){
                const tmp = item.split(propertyDelimiter);
                tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
            }
        });
        return res;
    });

    function normalizeStyleData(data){
        const style = normalizeStyleBinding(data.style);

        return data.staticStyle
          ? extend(data.staticStyle, style)
          : style;
    }

    function normalizeStyleBinding(bindingStyle){
        if(Array.isArray(bindingStyle)){
            return toObject(bindingStyle);
        }
        if(typeof bindingStyle === 'string'){
            return parseStyleText(bindingStyle);
        }
        return bindingStyle;
    }

    function getStyle(vnode, checkChild){
        const res = {};
        let styleData;
        
        if(checkChild){
            let childNode = vnode;
            while(childNode.componentInstance){
                childNode = childNode.componentInstance._vnode;
                if(childNode && childNode.data && (styleData = normalizeStyleData(childNode.data))){
                    extend(res, styleData);
                }
            }
        }

        if(styleData =  normalizeStyleData(vnode.data)){
            extend(res, styleData);
        }

        let parentNode = vnode;
        while((parentNode = parentNode.parent)){
            if(parentNode.data && (styleData = normalizeStyleData(parentNode.data))){
                extend(res, styleData);
            }
        }

        return res;
    }

    const cssVarRE = /^--/;
    const importantRE = /\s*!important$/;

    const setProp = (el, name, val) => {
        if(cssVarRE.test(name)){
            el.style.setProperty(name,val);
        }else if(importantRE.test(val)){
            el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
        }else {
            const normalizedName = normalize(name);
            if(Array.isArray(val)){
                for(let i = 0, len = val.length; i < len; i++){
                    el.style[normalizedName] = val[i];
                }
            }else {
                el.style[normalizedName] = val;
            } 
        }
    };

    const vendorNames = ['webkit', 'Moz', 'ms'];

    let emptyStyle;

    const normalize = cached(function(prop) {
        emptyStyle = emptyStyle || document.createElement('div').style;
        prop = camelize(prop);
        if(prop !== 'filter' && (prop in emptyStyle)){
            return prop;
        }
        const capName = prop.chartAt(0).toUpperCase() + prop.slice(1);

        for(let i = 0; i < vendorNames.length; i++){
            const name = vendorNames[i] + capName;
            if(name in emptyStyle){
                return name;
            }
        }
    });

    function updateStyle(oldVnode, vnode){
        const data = vnode.data;
        const oldData = oldVnode.data;

        if(isUndef(data.staticStyle) && isUndef(data.style) && isUndef(oldData.staticStyle) && isUndef(oldData.style)){
            return
        }

        let cur, name;
        const el = vnode.elm;
        const oldStaticStyle = oldData.staticStyle;
        const oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

        const oldStyle = oldStaticStyle || oldStyleBinding;

        const style = normalizeStyleBinding(vnode.data.style) || {};

        vnode.data.normalizedStyle = isDef(style.__ob__)
          ? extend({}, style)
          : style;
        
        const newStyle = getStyle(vnode, true);

        for(name in oldStyle){
            if(isUndef(newStyle[name])){
                setProp(el, name, '');
            }
        }

        for(name in newStyle){
            cur = newStyle[name];
            if(cur !== oldStyle[name]){
                setProp(el, name, cur == null ? '' : cur);
            }
        }
    }

    var style = {
        create: updateStyle,
        update: updateStyle
    };

    var modules = [
        style
    ];

    function createElement$1(tagName, vnode){
        const elm = document.createElement(tagName);
        if(tagName != 'select'){
            return elm;
        }    
        if(vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined){
            elm.setAttribute('multiple', 'multiple');
        }
        return elm;
    }


    function createTextNode(text){
        return document.createTextNode(text);
    }

    function createComment(text){
        return document.createComment(text);
    }

    function insertBefore(parentNode, newNode, referenceNode){
        parentNode.insertBefore(newNode,referenceNode);
    }

    function removeChild(node, child){
        node.removeChild(child);
    }

    function appendChild(node, child){
        node.appendChild(child);
    }

    function parentNode(node){
        return node.parentNode;
    }

    function nextSibling(node){
        return node.nextSibling;
    }

    function tagName(node) {
        return node.tagName;
    }

    function setTextContent(node, text){
        node.textContent = text;
    }

    function setStyleScope(node, scopeId){
        node.setAttribute(scopeId,'');
    }

    var nodeOps = /*#__PURE__*/Object.freeze({
        __proto__: null,
        createElement: createElement$1,
        createTextNode: createTextNode,
        createComment: createComment,
        insertBefore: insertBefore,
        removeChild: removeChild,
        appendChild: appendChild,
        parentNode: parentNode,
        nextSibling: nextSibling,
        tagName: tagName,
        setTextContent: setTextContent,
        setStyleScope: setStyleScope
    });

    const patch = createPatchFunction({ nodeOps, modules });

    iVue.prototype.__patch__ = patch;

    iVue.prototype.$mount = function(el,hydrating){
        el = el ? query(el) : undefined;
        return mountComponent(this, el, hydrating);
    };

    return iVue;

}());
