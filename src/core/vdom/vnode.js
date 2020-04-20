export default class VNode{
    tag;
    data;
    children;
    text;
    elm;
    context;
    componentOptions;

    isComment;
    
    constructor(tag, data, children,text, elm, context, componentOptions){
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.text = text;
        this.elm = elm;
        this.context = context;
        this.componentOptions = componentOptions;

        this.isComment = false;
    }
}

export const createEmptyVNode = (text)=>{
    const node = new VNode();
    node.text = text;
    node.isComment = true;
    return node
}

export function createTextVNode(val){
    return new VNode(undefined, undefined, undefined,String(val));
}

