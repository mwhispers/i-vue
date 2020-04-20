import { isPrimitive } from "../../../shared/util";
import {createTextVNode} from '../../vdom/vnode.js';

export function normalizeChildren(children){
    return isPrimitive(children)
      ? [createTextVNode(children)]
      : children
}