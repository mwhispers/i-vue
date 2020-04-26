import {initRender} from './render.js'

let uid = 0;
export function initMixin(iVue){
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
    }
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