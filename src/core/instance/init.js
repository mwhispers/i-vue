import {initRender} from './render.js'

let uid = 0;
export function initMixin(iVue){
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
    }
}