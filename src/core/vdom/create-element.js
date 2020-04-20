import VNode from './vnode.js';
import {isPrimitive, isTrue} from '../../shared/util.js';
import {normalizeChildren} from './helpers/normalize-children.js';

const ALWAYS_NORMALIZE = 2;

export function createElement(context, tag, data, children,normalizationType,alwaysNormalize){
    if(Array.isArray(data) || isPrimitive(data)){
        normalizationType = children;
        children = data;
        data = undefined;
    }
    if(isTrue(alwaysNormalize)){
        normalizationType = ALWAYS_NORMALIZE;
    }
    return _createElement(context, tag, data, children,normalizationType);
}

export function _createElement(context, tag, data, children,normalizationType){
    children = normalizeChildren(children);
    return new VNode(tag,data,children,undefined,undefined);
}