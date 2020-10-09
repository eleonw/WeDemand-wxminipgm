export const promisify = function(func, opt, context=null) {
    return new Promise(function(resolve, reject) {
        func.call(context, {
            ...opt,
            success: function(res) {resolve(res)},
            fail: function(err) {reject(err)},
        })
    })
}

// export const clone = function(obj) {
//     if (obj instanceof Object) {
//         const dup = Object.create(Object.getPrototypeOf(obj));
//         for (let item in obj) {
//             dup[item] = clone(obj[item]);
//         }
//         return dup;
//     } else {
//         return obj;
//     }
// }

export const weightAssistant = {
    
    MAX_WEIGHT: 20,
    MIN_WEIGHT: 5,
    
    getWeightString: function(weight) {
        if (weight < this.MIN_WEIGHT) {
            return '小于' + this.MIN_WEIGHT + 'kg';
        } else if (weight > this.MAX_WEIGHT) {
            return '大于' + this.MAX_WEIGHT + 'kg';
        } else {
            return weight + 'kg';
        }
    }
}



export const clone = function(obj) {
    const dup = Object.create(Object.getPrototypeOf(obj));
    for (let item in obj) {
        if (obj[item] instanceof Object) {
            if (!(obj[item] instanceof Function)) {
                dup[item] = clone(obj[item]);
            }
        } else {
            dup[item] = obj[item];
        }
    }
    
    return dup;
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

export const beanify = function(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export const formatNumber = function(value, strLength) {
    let numberString = value.toString();
    if (numberString.length > strLength) {
        console.log({
            value,
            strLength
        })
        throw new Error('value exceed')
    } else {
        let boundary = strLength - numberString.length;
        while (boundary) {
            numberString = '0' + numberString;
            boundary--;
        }
        return numberString;
    }
}

export const getTimeString = function(arg) {
    
    const {
        timestamp, substitude, suffix
    } = arg;
    
    let date = new Date(timestamp);
    
    if (date - (new Date()) > 0) {
        const hour = formatNumber(date.getHours(), 2);
        const minute = formatNumber(date.getMinutes(), 2);
        return (date.getMonth()+1) + '月' + date.getDate() + '日' + ' ' + hour + ':' + minute;
    } else {
        if (substitude) {
            return substitude;
        } else {
            date = new Date(Number(date) + 1000*60*60);
            const hour = formatNumber(date.getHours(), 2);
            const minute = '00'
            return (date.getMonth()+1) + '月' + date.getDate() + '日' + ' ' + hour + ':' + minute + (suffix?suffix:'');
        }
        
    }
    
}

