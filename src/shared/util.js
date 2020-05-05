export function noop(){}

export function extend(to, _from){
    for(const key in _from){
        to[key] = _from[key];
    }

    return to;
}

export function toObject (arr){
    const res = {};
    for(let i = 0; i < arr.length; i++){
        if(arr[i]){
            extend(res,arr[i]);
        }
    }
    return res;
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

export function isObject(obj){
    return obj !== null && typeof obj === 'object';
}

export function cached(fn){
    const cache = Object.create(null);
    return function cachedFn(str){
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    }
}

const camelizeRE = /-(\w)/g

export const camelize = cached((str)=>{
    return str.replace(camelizeRE,(_, c) => c ? c.toUpperCase() : '');
})

export const capitalize = cached((str)=>{
    return str.chartAt(0).toUpperCase() + str.slice(1);
})

const hyphenateRE = /\B([A-Z]])/g

export const hyphenate = cached((str)=>{
    return str.replace(hyphenateRE, '-$1').toLowerCase()
})

export function remove(arr, item){
    if(arr.length){
        const index = arr.indexOf(item);
        if(index > -1){
            return arr.splice(index,1);
        }
    }
}