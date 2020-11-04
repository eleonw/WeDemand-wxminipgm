import { userInfo, serviceType as _serviceType } from '@/common/globalData.js';

const userId = userInfo._id;

export async function _resetSmsCode(arg) {
    
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
        type, mobile
    } = opt;
    
    try {
        const res = await uniCloud.callFunction({
            name: 'sendSmsCode',
            data: { type, mobile }
        })
        console.log(res)
        if (res.result.success) {
            return { success: true }
        } else {
            let message;
            switch(res.result.code) {
                case -2:
                    message = '验证码发送失败，请稍后重试'
                    break;
                case -3:
                    message = '本次发送验证码无效，请重新发送并使用新的验证码'
                default:
                    message = '操作失败，请重试'
            }
            return { success: false, message };
        }
    } catch(e) {
        console.log(e);
        return {
            success: false,
            message: '操作失败，请重试'
        }
    }
}

export const loginAssistant = {
    LoginMethod : {
        SMS_CODE: 1,
        TOKEN: 2,
        WXCODE: 3,
    },
    
    loginWithSmsCode: async function(opt) {
        console.log('loginWithSmsCode');
        const {
            mobile, code
        } = opt;
        const loginMethod = this.LoginMethod.SMS_CODE;
        try {
            const res = await uniCloud.callFunction({
                name: 'login',
                data: {
                    mobile, code, loginMethod
                }
            })
            console.log(res)
            if (!res.result.success) {
                console.log(res);
                throw new Error();
            }
            const { userInfo, token } = res.result;
            return {
                success: true,
                userInfo,
                token,
            }
        } catch(e) {
            console.log(e)
            return {
                success: false,
                message: '验证码错误，请重试'
            }
        }
        
    },
    
    loginWithToken: async function(opt) {
        console.log('loginWithToken');
        const loginMethod = this.LoginMethod.TOKEN;
        try {
            const res = await uniCloud.callFunction({
                name: 'login',
                data: {
                    loginMethod
                }
            })
            console.log(res)
            if (!res.result.success) {
                throw new Error();
            }
            const {
                userInfo, token
            } = res.result;
            return {
                success: true,
                token,
                userInfo
            }
        } catch(e) {
            console.log(e)
            return {
                success: false,
                message: '登陆失败，请重试'
            }
        }
    }
}

export const balanceAssistant = {
    serviceType: {
        GET_BALANCE: 1,
        PAY: 2
    },
    
    pay: async function(arg) {
        
    }
}

export const paymentAssistant = {
    
    payWithBlance: async function(opt) {
        const {
            amount
        } = opt;
        const res = await uniCloud.callFunction({
            name: 'balanceService',
            data: {
                userId: userInfo._id,
                amount
            }
        })
        console.log(res)
    },
    
    getBalance: async function() {
        const res = await uniCloud.callFunction({
            name: 'balanceService',
            
        })
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
    
    getUserOrderList: async function(opt) {
        const {
            limit, _getListRec, status
        } = opt;
        const userId = userInfo._id;
        const serviceType = this.serviceType.GET;
        const side = 0;

        try {
            const res = await uniCLoud.callFunction({
                name: 'orderService',
                data: {
                    status, limit, _getListRec, userId, serviceType, side
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
        FINISH: 3,
        EVALUATE: 4,
        CANCEL: 5,
        GET_CREATED_LIST: 6,
        GET_SERVER_LIST: 7
    },
    
    getCreatedOrderList: async function(arg) {
        const {
            limit, _createdListRec, fromStart
        } = arg;
        const serviceType = this.serviceType.GET_CREATED_LIST;
        const side = 1;
        
        try {
            const res = await uniCloud.callFunction({
                name: 'orderService',
                data: {
                    limit, _createdListRec, fromStart, serviceType, side
                },
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
    
    getServerOrderList: async function(arg) {
        const {
            limit, _serverListRec, fromStart, status,
        } = arg;
        const userId = userInfo._id;
        const serviceType = this.serviceType.GET_SERVER_LIST;
        const side = 1;
        
        try {
            const res = await uniCloud.callFunction({
                name: 'orderService',
                data: {
                    limit, _serverListRec, fromStart, serviceType, side, status, userId
                },
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
    
    take: async function(arg) {
        const {
            orderId
        } = arg;
        const mobile = userInfo.mobile;
        const userId = userInfo._id;
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
        const userId = userInfo._id;
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
    },
    
    finish: async function(arg) {
        const {
            orderId, confirmCode
        } = arg;
        const userId = userInfo._id;
        const side= 1;
        const serviceType = this.serviceType.FINISH;
        
        try {
            const res = await uniCloud.callFunction({
                name: 'orderService',
                data: {
                    side,
                    serviceType,
                    userId,
                    orderid,
                    confirmCode,
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
    
    evaluate: async function(arg) {
        const {
            orderId, score, comment
        } = arg;
        const userId = userInfo._id;
        const side = 1;
        const serviceType = this.serviceType.EVALUATE;
        
        try {
            const res = await uniCloud.callFunction({
                name: 'orderService',
                data: {
                    side,
                    serviceType,
                    userId,
                    orderid,
                    confirmCode,
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
    
    cancel: async function(arg) {
        const {
            orderId, status
        } = arg;
        const userId = userInfo._id;
        const side = 1;
        const serviceType = this.serviceType.CANCEL;
        try {
            const res = await uniCloud.callFunction({
                name: 'orderService',
                data: {
                    orderId,
                    status,
                    userId,
                    side,
                    serviceType
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

