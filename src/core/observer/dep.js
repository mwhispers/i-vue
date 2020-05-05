import {remove} from '../util/index.js'

let uid = 0;

export default class Dep{
    static target;
    id;
    subs;

    constructor (){
        this.id = uid++;
        this.subs = [];
    }

    addSub (sub){
        this.subs.push(sub);
    }

    remvoeSub (sub){
        remove(this.subs, sub);
    }

    depend(){
        if(Dep.target){
            Dep.target.addDep(this);
        }
    }

    notify(){
        const subs = this.subs.slice();
        for(let i = 0, l = subs.length; i < l; i++){
            subs[i].update();
        }
    }
}

Dep.target = null;
const targetStack = [];

export function pushTarget(target){
    targetStack.push(target);
    Dep.target = target;
}

export function popTarget(target){
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
}