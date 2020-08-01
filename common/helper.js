export const promisify = function(func, opt, context=null) {
    return new Promise(function(resolve, reject) {
        func.call(context, {
            ...opt,
            success: function(res) {resolve(res)},
            fail: function(err) {reject(err)},
        })
    })
}

export const clone = function(obj) {
    if (obj instanceof Object) {
        const dup = Object.create(Object.getPrototypeOf(obj));
        for (let item in obj) {
            dup[item] = clone(obj[item]);
        }
        return dup;
    } else {
        return obj;
    }
}

export const addAll = function(src) {
    for (let item in src) {
        if (src[item] instanceof Object) {
            let obj = {};
            addAll.call(obj, src[item]);
            this[item] = obj;
        } else {
            this[item] = src[item];
        }
    }
}
