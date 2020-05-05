import { inBrowser, isIE } from "../util/env";
import { nextTick } from "../util/next-tick";

export const MAX_UPDATE_COUNT = 100;

const queue = [];
const activatedChildren = [];
const has = {};
let circular = {};
let waiting = false;
let flushing = false;
let index = 0;

function resetSchedulerState(){
    index = queue.length = activatedChildren.length = 0;
    has = {};
    waiting = flushing = false;
}

export let currentFlushTimestamp = 0;
let getNow = Date.now;

function flushSchedulerQueue(){
    currentFlushTimestamp = getNow();
    flushing = true;
    let watcher, id;

    queue.sort((a,b)=> a.id - b.id);

    for(index = 0; index < queue.length; index++){
        watcher = queue[index];
        if(watcher.before){
            watcher.before();
        }
        id = watcher.id;
        has[id] = null;
        watcher.run();
    }
    const activateQueue = activatedChildren.slice();
    const updatedQueue = queue.slice();

    resetSchedulerState();

    callActivatedHooks(activateQueue);
    callUpdatedHooks(updatedQueue);
}

function callUpdatedHooks(queue){
    //TODO
}

function callActivatedHooks(queue){
    //TODO
}

export function queueWatcher(watcher){
    const id = watcher.id;
    if(has[id] == null){
        has[id] = true;
        if(!flushing){
            queue.push(watcher);
        } else {
            let i = queue.length - 1;
            while(i > index && queue[i].id > watcher.id){
                i--;
            }
            queue.splice(i+1,watcher);
        }

        if(!waiting){
            waiting = true;
            nextTick(flushSchedulerQueue);
        }   
    }
}