import iVue from '../../../core/index.js';

import {query} from '../util/index.js';

import {mountComponent} from '../../../core/instance/lifecycle.js';

import {patch} from './patch.js';

iVue.prototype.__patch__ = patch;

iVue.prototype.$mount = function(el,hydrating){
    el = el ? query(el) : undefined;
    return mountComponent(this, el, hydrating);
}

export default iVue

