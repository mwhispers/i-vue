import {getStyle, normalizeStyleBinding} from '../../util/style.js'
import {cached, camelize, extend, isDef, isUndef, hyphenate} from '../../../../shared/util.js'

const cssVarRE = /^--/;
const importantRE = /\s*!important$/

const setProp = (el, name, val) => {
    if(cssVarRE.test(name)){
        el.style.setProperty(name,val);
    }else if(importantRE.test(val)){
        el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
    }else {
        const normalizedName = normalize(name);
        if(Array.isArray(val)){
            for(let i = 0, len = val.length; i < len; i++){
                el.style[normalizedName] = val[i];
            }
        }else {
            el.style[normalizedName] = val;
        } 
    }
}

const vendorNames = ['webkit', 'Moz', 'ms'];

let emptyStyle;

const normalize = cached(function(prop) {
    emptyStyle = emptyStyle || document.createElement('div').style;
    prop = camelize(prop);
    if(prop !== 'filter' && (prop in emptyStyle)){
        return prop;
    }
    const capName = prop.chartAt(0).toUpperCase() + prop.slice(1);

    for(let i = 0; i < vendorNames.length; i++){
        const name = vendorNames[i] + capName;
        if(name in emptyStyle){
            return name;
        }
    }
});

function updateStyle(oldVnode, vnode){
    const data = vnode.data;
    const oldData = oldVnode.data;

    if(isUndef(data.staticStyle) && isUndef(data.style) && isUndef(oldData.staticStyle) && isUndef(oldData.style)){
        return
    }

    let cur, name;
    const el = vnode.elm;
    const oldStaticStyle = oldData.staticStyle;
    const oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

    const oldStyle = oldStaticStyle || oldStyleBinding;

    const style = normalizeStyleBinding(vnode.data.style) || {};

    vnode.data.normalizedStyle = isDef(style.__ob__)
      ? extend({}, style)
      : style;
    
    const newStyle = getStyle(vnode, true);

    for(name in oldStyle){
        if(isUndef(newStyle[name])){
            setProp(el, name, '');
        }
    }

    for(name in newStyle){
        cur = newStyle[name];
        if(cur !== oldStyle[name]){
            setProp(el, name, cur == null ? '' : cur);
        }
    }
}

export default {
    create: updateStyle,
    update: updateStyle
}

