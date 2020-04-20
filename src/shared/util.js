export function noop(){}

export function extend(to, _from){
    for(const key in _from){
        to[key] = _from[key];
    }

    return to;
}

export function isPrimitive(value){
    return (
        typeof value === 'string' || 
        typeof value === 'number' ||
        typeof value === 'boolean' 
    )
}

export function isTrue(v){
    return v === true
}

export function isFalse(v){
    return v === false
}

export function isDef(v){
    return v !== undefined && v !== null;
}

export function isUndef(v){
    return v === undefined || v === null;
}