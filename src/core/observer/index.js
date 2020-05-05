import Dep from './dep.js';
import { def } from '../util/lang.js';
import { isObject, hasOwn } from '../util/index.js';
import VNode from '../vdom/vnode.js'

export let shouldObeserve = true;

export class Observer {
    constructor (value){
        this.value = value;
        this.dep = new Dep();
        this.vmCount = 0;

        def(value, '__ob__', this);
        this.walk(value)
    }

    walk(obj){
        const keys = Object.keys(obj);
        for(let i = 0; i < keys.length; i++){
            defineReactive(obj,keys[i]);
        }
    }
} 

export function observe(value, asRootData){
    if(!isObject(value) || value instanceof VNode){
        return;
    }
    let ob;
    if(hasOwn(value,'__ob__') && value.__ob__ instanceof Observer){
        ob = value.__ob__;
    } else if(shouldObeserve){
        ob = new Observer(value);
    }

    return ob;
}

export function defineReactive(obj, key, val, customeSetter, shallow){
    const dep = new Dep();
    
    const property = Object.getOwnPropertyDescriptor(obj,key);

    if(property && property.configurable === false){
        return
    }

    const getter = property && property.get;
    const setter = property && property.set;

    if((!getter || setter) && arguments.length === 2){
        val = obj[key];
    }

    let childOb = !shallow && observe(val);

    Object.defineProperty(obj,key,{
        enumerable:true,
        configurable:true,
        get: function reactiveGetter(){
            const value = getter ? getter.call(obj):val;
            if(Dep.target){
                dep.depend();
                if(childOb){
                    childOb.dep.depend();
                }
            }
            return value;
        },
        set: function reactiveSetter(newVal){
            const value = getter ? getter.call(obj):val;
            if(newVal === value){
                return
            }
            if(setter){
                setter.call(obj, newVal);
            } else {
                val = newVal;
            }
            childOb = !shallow && observe(newVal);
            dep.notify();
        }
    })
}