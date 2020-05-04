import {createPatchFunction} from '../../../core/vdom/patch.js';
import modules  from './modules/index.js';
import * as nodeOps from './node-ops.js';

export const patch = createPatchFunction({ nodeOps, modules });