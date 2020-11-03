import { userInfo, serviceType as _serviceType } from '@/common/globalData.js';
import { loginErr } from '@/common/error.js';

export async function resetSmsCode(arg) {
    
    const {
        recId
    } = arg;
    
    await uniCloud.callFunction({
        name: 'resetSmsCode',
        data: {
            recId
        }
    })
}

export async function sendSmsCode(opt) {
    const {
        type
    } = opt;
    const res = await uniCloud.callFunction({
        name: 'sendSmsCode',
        data: {
            type,
            mobile: opt.mobile,
        }
    })
    console.log(res);
    return res;
}

export async function login(loginData) {
    
    console.log('login called')
    
    let res;
    try {
        res = (await uniCloud.callFunction({
            name: 'login',
            data: loginData
        })).result;
        return res;
    } catch(e) {
        console.log(e);
        return {
            code: loginErr.SYSTEM_FAILURE,
        }
    }
    
     
}

export const paymentAssistant = {
    
    payWithBlance: async function(opt) {
        const {
            amount
        } = opt;
        const res = await uniCloud.callFunction({
            name: changeBalance,
            data: {
                userId: userInfo.id,
                amount
            }
        })
        console.log(res)
    }
    
}

export const orderAssistant_creater = {
    
    serviceType: {
        INITIAL: 1,
        CREATE: 2,
        EVALUATE: 3,
        CANCEL: 4,
        GET: 5,
    },
    
    initial: async function(order) {
        
        switch(order.serviceType) {
            case _serviceType.HELP_DELIVER:
                order.serviceType = 1;
                break;
            case _serviceType.HELP_BUY:
                order.serviceType = 2;
                break;
            case _serviceType.OTHER_SERVICE:
                order.serviceType = 3;
                break;
            default:
                throw new Error('invalid service type');
        }
        const side = 0;
        const serviceType = this.serviceType.INITIAL;
        const userId = userInfo._id;
        
        try {
            const res = await uniCloud.callFunction({
                name: 'orderService',
                data: {
                    side,
                    serviceType,
                    userId,
                    order,
                }
            })
            console.log(res)
            if (!res.result || !res.result.success) {
                throw new Error(res);
            }
        } catch(e) {
            console.log(e);
            return {
                success: false,
                error: e,
            }
        }
        return {
            success: true,
        }
        
    },
    
    create: async function(opt) {
        const {
            orderId
        } = opt;
        const side = 0;
        const serviceType = this.serviceType.CREATE;
        const userId = userInfo._id;
        try {
            const res = await uniCloud.callFunction({
                name: 'orderService',
                data: {
                    serviceType,
                    userId,
                    orderId
                }
            });
            return res.result;
        } catch(e) {
            console.log(e);
            return {
                success: false,
                error: e,
            }
        }
    },
    
    evaluate: async function(opt) {
        const {
            orderId, score, comment
        } = opt;
        const serviceType = this.serviceType.EVALUATE;
        const side = 0;
        let res;
        try {
            res = await uniCloud.callFunction({
                name: 'orderService',
                data: {
                    serviceType,
                    orderId,
                    score,
                    comment,
                    side,
                }
            })
            return res.result;
        } catch(e) {
            return {
                success: false,
                code: -1,
                error: e,
            }
        }
        
    },
    
    cancel: async function(opt) {
        const {
            orderId, status
        } = opt;
        const userId = userInfo._id;
        const serviceType = this.serviceType.CANCEL;
        let res;
        try {
            res = await uniCloud.callFunction({
                name: 'orderService',
                data: {
                    serviceType,
                    orderId,
                    status,
                    userId
                }
            })
            return res.result;
        } catch(e) {
            return {
                success: false,
                code: -1,
                error: e
            }
        }
    },
    
    getOrderList: async function(opt) {
        const {
            limit, _getListRec, status
        } = opt;
        const userId = userInfo._id;
        const serviceType = this.serviceType.GET;

        try {
            const res = await uniCLoud.callFunction({
                name: 'orderService',
                data: {
                    status, limit, _getListRec, userId, serviceType
                }
            })
            console.log(res)
            return res.result;
        } catch(e) {
            console.log(e)
            return {
                success: false,
                code: -1,
                error: e,
            }
        }

    }
    
}

export const orderAssistant_server = {
    serviceType: {
        TAKE: 1,
        START: 2,
    },
    
    take: async function(arg) {
        const {
            orderId
        } = arg;
        const mobile = userInfo.mobile;
        const userId = userInfo.userId;
        const side = 1;
        const serviceType = this.serviceType.TAKE;
        
        try {
            const res = await uniCloud.callFunction({
                name: 'orderService',
                data: {
                    userId,
                    orderId,
                    mobile,
                    side,
                    serviceType,
                }
            })
            return res.result;
        } catch(e) {
            return {
                success: false,
                code: -1,
                error: e
            }
        }
    },
    
    start: async function(arg) {
        const {
            orderId
        } = arg;
        const userId = userInfo.userId;
        const side = 1;
        const serviceType = this.serviceType.START;
        try {
            const res = await uniCloud.callFunction({
                name: 'orderService',
                data: {
                    userId,
                    orderId,
                    side,
                    serviceType
                }
            })
            return res.result;
        } catch(e) {
            return {
                success: false,
                code: -1,
                error: e,
            }
        }
    }
}

export const addressBookAssistant = {
    getAddressBook: async function(arg) {
        const res = await uniCloud.callFunction({
            name: 'addressBookService',
            data: {
                type: 3,
                userId: arg.userId
            }
        });
        const addressBook = [];
 
        for (let addressRec of res.result) {
            addressBook.push(addressRec);
        }
        return addressBook;
    },
    
    addToAddressBook: async function(arg) {
        
        
        const res = await uniCloud.callFunction({
            name: 'addressBookService',
            data: {
                type: 0,
                userId: userInfo._id,
                address: arg.address,
            }
        });

        return res.result;
    },
    
    updateAddressBook: async function(arg) {
        const res = await uniCloud.callFunction({
            name: 'addressBookService',
            data: {
                type: 1,
                recId: arg.recId,
                address: arg.address,
            }
        })
        console.log(res);
    },
    
    removeAddress: async function(arg) {
        await uniCloud.callFunction({
            name: 'addressBookService',
            data: {
                type: 2,
                recId: arg.recId
            }
        });
    },
    
  
}

