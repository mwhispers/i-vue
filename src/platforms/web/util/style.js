import { cached, extend, toObject }  from 'src/shared/util.js' 

export const parseStyleText = cached(function(cssText) {
    const res = {};
    const listDelimiter = /;(?![^(]*\))/g;
    const propertyDelimiter = /:(.+)/;
    cssText.split(listDelimiter).forEach(function(item) {
        if(item){
            const tmp = item.split(propertyDelimiter);
            tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim())
        }
    })
    return res;
})

export function normalizeStyleData(data){
    const style = normalizeStyleBinding(data.style);

    return data.staticStyle
      ? extend(data.staticStyle, style)
      : style;
}

export function normalizeStyleBinding(bindingStyle){
    if(Array.isArray(bindingStyle)){
        return toObject(bindingStyle);
    }
    if(typeof bindingStyle === 'string'){
        return parseStyleText(bindingStyle);
    }
    return bindingStyle;
}

export function getStyle(vnode, checkChild){
    const res = {}
}