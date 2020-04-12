import VNode from './vnode.js';
export function createElement(context, tag, data, children,text,elm){
    return _createElement(context, tag, data, children,text,elm);
}

export function _createElement(context, tag, data, children,text,elm){
    return new VNode(tag,data,children,text,elm);
}