import VNode from './vnode.js'
import { isPrimitive } from '../../shared/util.js';

export function createPatchFunction(){

    function parentNode(elm){
        return elm.parentNode;
    }

    function tagName(elm){
        return elm.tagName;
    }

    function emptyNodeAt(elm){
        return new VNode(tagName(elm).toLowerCase(),{},[],undefined,elm);
    }

    function createElm(vnode, insertedVnodeQueue, parentElm, refElm){
        const data = vnode.data;
        const children = vnode.children;
        const tag = vnode.tag;

        vnode.elm = document.createElement(tag);

        createChildren(vnode,children,[]);

        insert(parentElm,vnode.elm);
    }

    function createChildren(vnode,children, insertedVnodeQueue){
        if(Array.isArray(children)){
            for(let i = 0; i < children.length; ++i){
                createElm(children[i],insertedVnodeQueue,vnode.elm);
            }
        }else if(isPrimitive(vnode.text)){
            vnode.elm.appendChild(document.createTextNode(vnode.text));
        }
        
    }

    function insert(parent, elm, ref){
        parent.appendChild(elm);
    }

    return function patch(oldVnode, vnode, hydrating, removeonly){

        const isRealElement = oldVnode.nodeType != null;

        if(isRealElement){
            oldVnode = emptyNodeAt(oldVnode);
        }

        const oldElm = oldVnode.elm;
        const parentElm = parentNode(oldElm);

        createElm(vnode, [], parentElm, null);
        return vnode.elm;
    }
}