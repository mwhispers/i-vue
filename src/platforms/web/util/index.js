import {warn} from '../../../core/util/index.js';

export function query(el){
    if(typeof el === 'string'){
        const selected = document.querySelector(el);
        if(!selected){
            warn('Cannot find element : ' + el);
            return document.createElement('div');
        }
        return selected;
    }else{
        return el;
    }
}