import {createElement} from '../vdom/createElement.js'

export function initRender(vm){
    vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
    vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);
}

export function renderMixin(iVue){
    iVue.prototype._render = function(){
        const vm = this;
        const {render,_parentVnode} = vm.$options;

        vm.$vnode = _parentVnode;

        let vnode = render.call(vm, vm.$createElement);
        return vnode;
    }
}