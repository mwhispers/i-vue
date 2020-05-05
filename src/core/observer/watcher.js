import { pushTarget, popTarget } from "./dep";
import { isObject, remove } from "../util/index.js";
import { queueWatcher } from "./scheduler";

let uid = 0;
export default class Watcher {
    constructor(vm, expOrFn, cb, options, isRenderWatcher){
        this.vm = vm;
        if(isRenderWatcher){
            vm._watcher = this;
        }
        vm._watchers.push(this);
        if(options){
            this.deep = !!options.deep;
            this.user = !!options.user;
            this.lazy = !!options.lazy;
            this.sync = !!options.sync;
            this.before = options.before;
        }else {
            this.deep = this.user = this.lazy = this.sync = false;
        }

        this.cb = cb;
        this.id = ++uid;
        this.active = true;
        this.dirty = this.lazy;
        this.deps = [];
        this.newDeps = [];
        this.depIds = new Set();
        this.newDepIds = new Set();
        this.expression = '';

        if(typeof expOrFn === 'function'){
            this.getter = expOrFn
        }

        this.value = this.lazy 
          ? undefined
          : this.get();
    }

    get(){
        pushTarget(this);
        let value;
        const vm = this.vm;
        try{
            value = this.getter.call(vm,vm);
        }catch(e){
            console.log(e)
        }finally{
            popTarget();
            this.cleanupDeps();
        }
        return value;
    }

    addDep(dep){
        const id = dep.id;
        if(!this.newDepIds.has(id)){
            this.newDepIds.add(id);
            this.newDeps.push(dep);
            if(!this.depIds.has(id)){
                dep.addSub(this);
            }
        }
    }

    cleanupDeps() {
        let i = this.deps.length;
        while(i--){
            const dep = this.deps[i];
            if(!this.newDepIds.has(dep.id)){
                dep.removeSub(this);
            }
        }
        let tmp = this.depIds;
        this.depIds = this.newDepIds;
        this.newDepIds = tmp;
        this.newDepIds.clear();
        tmp = this.deps;
        this.deps = this.newDeps;
        this.newDeps = tmp;
        this.newDeps.length = 0;
    }

    update(){
        if(this.lazy){
            this.dirty = true;
        }else if(this.sync) {
            this.run();
        }else{
            queueWatcher(this); 
        }
    }

    run(){
        if(this.active){
            const value = this.get();
            if(value !== this.value || isObject(value) || this.deep){
                const oldValue = this.value;
                this.value = value;
                if(this.user){
                    try{
                        this.cb.call(this.vm, value, oldValue);
                    }catch(err){
                        Console.log(err);
                    }
                }else{
                    this.cb.call(this.vm, value, oldValue);
                }
            }
        }
    }

    evaluate(){
        this.value = this.get();
        this.dirty = false;
    }

    depend(){
        let i = this.deps.length;
        while(i--){
            this.deps[i].depend();
        }
    }

    tearDown(){
        if(this.active){
            if(!this.vm._isBeingDestroyed){
                remove(this.vm._watchers,this)
            }
            let i = this.deps.length;
            while(i--){
                this.deps[i].removeSub(this);
            }
            this.active = false;
        }
    }
} 