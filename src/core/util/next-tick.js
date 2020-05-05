import {noop} from '../../shared/util.js';
import {isIE,isIOS,isNative} from './env.js';

export let isUsingMicroTask = false;

const callbacks = [];
let pending = false;

function flushCallbacks(){
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for(let i = 0; i < copies.length; i++){
        copies[i]();
    }
}

let timerFunc;
if(typeof Promise !== 'undefined' && isNative(Promise)){
    const p = Promise.resolve();
    timerFunc = () => {
        p.then(flushCallbacks);
        if(isIOS){
            setTimeout(noop);
        }
    }
    isUsingMicroTask = true;
}else if(!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    MutationObserver.toString() === "[object MutationObserverConstructor]"
)){
    let counter = 1;
    const observer = new MutationObeserver(flushCallbacks);
    const textNode = document.createTextNode(String(counter));
    observer.observe(textNode,{
        characterData: true
    });
    timerFunc = () => {
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
    }
    isUsingMicroTask = true;
}else if(typeof setImmediate !== 'undefined' && isNative(setImmediate)){
    timerFunc = () => {
        setImmediate(flushCallbacks);
    }
}else {
    timerFunc = () => {
        setTimeout(flushCallbacks, 0);
    }
}

export function nextTick(cb,ctx){
    let _resolve;
    callbacks.push(() => {
        if(cb) {
            try{
                cb.call(ctx);
            } catch (e) {
                console.log('nextTick')
            }
        } else if(_resolve){
            _resolve(ctx)
        }
    })
    if(!pending) {
        pending = true;
        timerFunc();
    }
    if(!cb && typeof Promise !== 'undefined'){
        return new Promise(resolve => {
            _resolve = resolve;
        })
    }
}