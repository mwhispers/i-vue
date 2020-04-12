export default class VNode{
    tag;
    data;
    children;
    text;
    elm;
    
    constructor(tag, data, children,text, elm){
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.text = text;
        this.elm = elm;
    }
}