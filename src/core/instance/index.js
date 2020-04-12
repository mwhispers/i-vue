import {warn} from '../util/index';
import {initMixin} from './init.js';
import {lifecycleMixin} from './lifecycle.js';
import {renderMixin} from './render.js';

function iVue(options){
    if(!this instanceof iVue){
        warn("iVue is a constructor and should be called by `new` keyword")
    } 
    this._init(options);
}

initMixin(iVue);
lifecycleMixin(iVue);
renderMixin(iVue);

export default iVue;