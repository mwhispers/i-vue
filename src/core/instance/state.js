import { noop } from "../util/index.js";
import { observe } from "../observer/index.js";

const sharedPropertyDefinition = {
    enumerable:true,
    configurable:true,
    get:noop,
    set:noop
}

export function proxy(target, sourceKey, key){
    sharedPropertyDefinition.get = function proxyGetter(){
        return this[sourceKey][key];
    }

    sharedPropertyDefinition.set = function proxySetter(val){
        this[sourceKey][key] = val
    }

    Object.defineProperty(target, key, sharedPropertyDefinition)
} 

export function initState(vm){
    vm._watchers = [];
    const opts = vm.$options;
    if(opts.data){
        initData(vm);
    }
}

function initData(vm){
    let data = vm.$options.data;
    vm._data = data;
    const keys = Object.keys(data);
    let i = keys.length;
    while(i--){
        proxy(vm,'_data',keys[i]);
    }
    observe(data,true);
}