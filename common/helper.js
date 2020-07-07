class Helper {
    
    static wx(name, opt={}) {
        return new Promise((resolve, reject) => {
            wx[name]({
                ...opt,
                success: res => resolve(res),
                fail: err => reject(err),
            });
        })
    };
    static promisify(func, opt) {
        return new Promise((resolve, reject) => {
            func({
                ...opt,
                success: res => resolve(res),
                fail: err => reject(err),
            })
        })
    }
}

module.exports = {Helper};