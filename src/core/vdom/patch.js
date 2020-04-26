import VNode from './vnode.js'
import { isPrimitive, isDef, isUndef } from '../../shared/util.js';

export function createPatchFunction() {

    function parentNode(elm) {
        return elm.parentNode;
    }

    function tagName(elm) {
        return elm.tagName;
    }

    function emptyNodeAt(elm) {
        return new VNode(tagName(elm).toLowerCase(), {}, [], undefined, elm);
    }

    function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
        let i = vnode.data;
        if (isDef(i)) {
            if (isDef(i = i.hook) && isDef(i = i.init)) {
                i(vnode, false);
            }

            if (isDef(vnode.componentInstance)) {
                initComponent(vnode, insertedVnodeQueue);
                insert(parentElm, vnode.elm);
            }
            return true;
        }
    }

    function initComponent(vnode, insertedVnodeQueue) {
        vnode.elm = vnode.componentInstance.$el;
    }

    function createElm(vnode, insertedVnodeQueue, parentElm, refElm) {

        if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
            return
        }

        const data = vnode.data;
        const children = vnode.children;
        const tag = vnode.tag;

        vnode.elm = document.createElement(tag);

        if (tag) {
            createChildren(vnode, children, []);
            if (parentElm) {
                insert(parentElm, vnode.elm);
            }
        } else {
            vnode.elm = document.createTextNode(vnode.text);
            insert(parentElm, vnode.elm, refElm)
        }



    }

    function createChildren(vnode, children, insertedVnodeQueue) {
        if (Array.isArray(children)) {
            for (let i = 0; i < children.length; ++i) {
                createElm(children[i], insertedVnodeQueue, vnode.elm);
            }
        } else if (isPrimitive(vnode.text)) {
            vnode.elm.appendChild(document.createTextNode(vnode.text));
        }

    }

    function insert(parent, elm, ref) {
        parent.appendChild(elm);
    }

    return function patch(oldVnode, vnode, hydrating, removeonly) {
        console.log(vnode);
        if (isUndef(oldVnode)) {
            createElm(vnode, {});
        } else {
            const isRealElement = oldVnode.nodeType != null;

            if (isRealElement) {
                oldVnode = emptyNodeAt(oldVnode);
            }

            const oldElm = oldVnode.elm;
            const parentElm = parentNode(oldElm);

            createElm(vnode, [], parentElm, null);
        }

        return vnode.elm;
    }
}