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
        
        constructor(tag, data, children,text, elm){
            this.tag = tag;
            this.data = data;
            this.children = children;
            this.text = text;
            this.elm = elm;
        }
    }

    function createElement(context, tag, data, children,text,elm){
        return _createElement(context, tag, data, children,text,elm);
    }

    function _createElement(context, tag, data, children,text,elm){
        return new VNode(tag,data,children,text,elm);
    }

    function initRender(vm){
        vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
        vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);
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
            vm.$options = options;

            initRender(vm);

            if(vm.$options.el){
                vm.$mount(vm.$options.el);
            }
        };
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

    function createPatchFunction(){

        function parentNode(elm){
            return elm.parentNode;
        }

        function tagName(elm){
            return elm.tagName;
        }

        function emptyNodeAt(elm){
            return new VNode(tagName(elm).toLowerCase(),{},[],undefined,elm);
        }

        function createElm(vnode, insertedVnodeQueue, parentElm, refElm){
            const data = vnode.data;
            const children = vnode.children;
            const tag = vnode.tag;

            vnode.elm = document.createElement(tag);

            createChildren(vnode,children,[]);

            insert(parentElm,vnode.elm);
        }

        function createChildren(vnode,children, insertedVnodeQueue){
            if(children){
                for(let i = 0; i < children.length; ++i){
                    createElm(children[i],insertedVnodeQueue,vnode.elm);
                }
            }else {
                vnode.elm.appendChild(document.createTextNode(vnode.text));
            }
            
        }

        function insert(parent, elm, ref){
            parent.appendChild(elm);
        }

        return function patch(oldVnode, vnode, hydrating, removeonly){

            const isRealElement = oldVnode.nodeType != null;

            if(isRealElement){
                oldVnode = emptyNodeAt(oldVnode);
            }

            const oldElm = oldVnode.elm;
            const parentElm = parentNode(oldElm);

            createElm(vnode, [], parentElm);
            return vnode.elm;
        }
    }

    const patch = createPatchFunction();

    iVue.prototype.__patch__ = patch;

    iVue.prototype.$mount = function(el,hydrating){
        el = el ? query(el) : undefined;
        return mountComponent(this, el, hydrating);
    };

    return iVue;

}());
