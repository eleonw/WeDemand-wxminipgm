import { userInfo, serviceType as _serviceType } from '@/common/globalData.js';

const userId = userInfo._id;

export async function modifyUserInfo(opt) {
  console.log('modifyUserInfo')
  const { update }  = opt;
  try{
    const res = await uniCloud.callFunction({
        name: 'modifyUserInfo',
        data: { userId, update }
    })
    if (res.result.success) return {success: true}
  } catch(e) {
    return {success: false, message: '信息更新失败，请重试'};
  }
  return {success: false, message: '信息更新失败，请重试'};
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
        LOGOUT: -1,
        SMS_CODE: 1,
        TOKEN: 2,
        WXCODE: 3,
    },
    
    logout: async function() {
        console.log('logout');
        const loginMethod = this.LoginMethod.LOGOUT;
        try {
            const res = await uniCloud.callFunction({
                name: 'login',
                data: { loginMethod }
            })
            console.log(res);
            if (!res.result.success) {
                throw new Error();
            }
            return res.result;
        } catch(e) {
            console.log(e);
            return {
                success: false,
                message: '登出失败'
            }
        }
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
            return res.result;
        } catch(e) {
            console.log(e)
            return {
                success: false,
                message: '登陆失败，请重试',
                
            }
        }
    }
}

export const balanceAssistant = {
    serviceType: {
        CHECK: 1,
        PAY: 2,
        RECHARGE: 3,
    },
    
    rechargeBalance: async function(arg) {
      console.log('rechargeBalance')
      const { amount } = arg;
      if (amount <= 0) return {success: false, message: '充值金额需为正数'};
      const serviceType = this.serviceType.RECHARGE;
      const userId = userInfo._id;
      try {
        const res = await uniCloud.callFunction({
          name: 'balanceService',
          data: { serviceType, userId, amount }
        })
        console.log(res);
        const result = res.result;
        if (result.success) {
          return result;
        } else {
          let message;
          switch(result.code) {
            case -2: message = '认证过期，请重新登录'; break;
            case -4: message = '付款金额需为正数'; break;
            default: throw new Error(result);
          }
        }
      } catch(e) {
        console.log(e)
        return {
            success: false,
            message: '操作失败'
        }
      }
    },
    
    payWithBalance: async function(arg) {
        console.log('payWithBalance')
        const { amount } = arg;
        if (amount <= 0) {
          return {
            success: false,
            message: '付款金额需为正数',
          }
        }
        const serviceType = this.serviceType.PAY
        const userId = userInfo._id;
        try {
            const res = await uniCloud.callFunction({
                name: 'balanceService',
                data: { serviceType, userId, amount }
            })
            console.log(res);
            const result = res.result;
            if (result.success) {
                return result;
            } else {
                let message;
                switch(result.code) {
                    case -2: message = '认证过期，请重新登录'; break;
                    case -3: message = '账户余额不足'; break;
                    case -4: message = '付款金额需为正数'; break;
                    default: throw new Error(result);
                }
                return {
                    success: false,
                    balance: result.balance,
                    code: res.code,
                    message
                }
            }
        } catch(e) {
            console.log(e)
            return {
                success: false,
                message: '操作失败'
            }
        }
    },
    
    checkBalance: async function(arg) {
        console.log('checkBalance')
        const serviceType = this.serviceType.CHECK;
        const userId = userInfo._id;
        try {
            const data = {
                serviceType, userId
            }
            const res = await uniCloud.callFunction({
                name: 'balanceService',
                data: data
            })
            console.log(res)
            const result = res.result;
            if (!result.success) {
                let message;
                switch(result.code) {
                    case -2: message = '登录状态过期，请重新登录'; break;
                    default: throw new Error();
                }
                result.message = message;
            } 
            return result;
        } catch(e) {
            console.log(e)
            return {
                success: false,
                message: '查询失败，请重试',
                code: -1
            }
        }
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
        console.log('initialOrder')
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
            return res.result;
        } catch(e) {
            console.log(e);
            return {
                success: false,
                message: '操作失败，请重试'
            }
        }
        
        
    },
    
    create: async function(opt) {
      console.log('createOrder')
      const { orderId } = opt;
      const side = 0;
      const serviceType = this.serviceType.CREATE;
      const userId = userInfo._id;
      try {
          const res = await uniCloud.callFunction({
              name: 'orderService',
              data: { side, serviceType, userId, orderId }
          });
          console.log(res)
          return res.result;
      } catch(e) {
          console.log(e);
          return { success: false, code: -1, message:'操作失败，请重试'}
      }
  },
    
    evaluate: async function(opt) {
        console.log('evaluateOrder');
        const { orderId, score, comment } = opt;
        const userId = userInfo._id;
        const serviceType = this.serviceType.EVALUATE;
        const side = 0;
        
        try {
            let res = await uniCloud.callFunction({
                name: 'orderService',
                data: { serviceType, orderId, score, comment, side, userId }
            })
            console.log(res);
            const result = res.result;
            if (!result.success) {
              let message;
              switch(res.code) {
                case -2: message = '订单状态错误，请刷新重试'; break;
                default: message = '操作失败，请重试'; break;
              }
              result.message = message;
            }
            return result;
        } catch(e) {
            return {
                success: false,
                code: -1,
                message: '操作失败，请重试'
            }
        }
        
    },
    
    cancel: async function(opt) {
      console.log('cancelOrder');
        const { orderId, status } = opt;
        const userId = userInfo._id;
        const serviceType = this.serviceType.CANCEL;
        const side = 0;
        let res;
        try {
          res = await uniCloud.callFunction({
            name: 'orderService',
            data: {serviceType, orderId, status, userId, side}
          })
          console.log(res);
          const result = res.result;
          if (!res.success) {
            let message;
            switch(res.code) {
              case -2: message = '订单状态异常，请刷新重试'; break;
              default: message = '操作失败，请重试';
            }
            result.message = message;
          }
          return result;
        } catch(e) {
          return {
            success: false,
            code: -1,
            message: '操作失败，请重试'
          }
        }
    },
    
    getUserOrderList: async function(opt) {
        console.log('getUserOrderList');
        const { limit, _getListRec, status, fromStart } = opt;
        const userId = userInfo._id;
        const serviceType = this.serviceType.GET;
        const side = 0;
        try {
            const res = await uniCloud.callFunction({
                name: 'orderService',
                data: { status, limit, _getListRec, userId, serviceType, side, fromStart }
            })
            console.log(res)
            const result = res.result;
            if (!result.success) {result.message = '获取订单失败，请刷新重试'}
            return res.result;
        } catch(e) {
            console.log(e)
            return { success: false, code:-1, message: '获取订单失败，请刷新重试' }
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
      console.log('getCreatedOrderList')
        const {
            limit, _createdListRec, fromStart
        } = arg;
        const serviceType = this.serviceType.GET_CREATED_LIST;
        const side = 1;
        
        try {
            const res = await uniCloud.callFunction({
                name: 'orderService',
                data: { limit, _createdListRec, fromStart, serviceType, side },
            })
            console.log(res);
            return res.result;
        } catch(e) {
          console.log(e)
            return {
                success: false,
                message: '订单查询失败，请刷新重试',
                code: -1,
            }
        }
        
        
    },
    
    getServerOrderList: async function(arg) {
      console.log('getServerOrderList')
        const { limit, _serverListRec, fromStart, status } = arg;
        const userId = userInfo._id;
        const serviceType = this.serviceType.GET_SERVER_LIST;
        const side = 1;
        
        try {
            const res = await uniCloud.callFunction({
                name: 'orderService',
                data: { limit, _serverListRec, fromStart, serviceType, side, status, userId },
            })
            console.log(res);
            return res.result;
        } catch(e) {
          console.log(e)
            return {
                success: false,
                message: '订单获取失败，请刷新重试',
                code: -1,
            }
        }
    },
    
    take: async function(arg) {
      console.log('takeOrder')
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
        console.log(res);
        return res.result;
      } catch(e) {
         console.log(e);
          return {
            success: false,
            code: -1,
            error: e
          }
      }
    },
    
    start: async function(arg) {
      console.log('startOrder');
        const { orderId } = arg;
        const userId = userInfo._id;
        const side = 1;
        const serviceType = this.serviceType.START;
        try {
            const res = await uniCloud.callFunction({
                name: 'orderService',
                data: { userId, orderId, side, serviceType }
            })
            console.log(res)
            return res.result;
        } catch(e) {
          console.log(e)
           return { success: false, code: -1, error: e }
        }
    },
    
    finish: async function(arg) {
      console.log('finishOrder')
        const {
            orderId, confirmCode
        } = arg;
        const userId = userInfo._id;
        const side= 1;
        const serviceType = this.serviceType.FINISH;
        
        try {
            const res = await uniCloud.callFunction({
              name: 'orderService',
              data: { side, serviceType, userId, orderId, confirmCode }
            })
            console.log(res);
            const result = res.result;
            if (!result.success) {
              let message;
              switch(result.code) {
                case -3: message = '订单状态异常，请重试'; break;
                case -5: message = '超过最高验证次数，订单异常'; break;
                case -4: message = '验证码错误，还剩下' + result.errCodeCount + '次验证机会'; break;
                default: message = '操作失败，请重试'
              }
              result.message = message;
            }
            return result;
        } catch(e) {
          console.log(e);
          return { success: false, code: -1, error: e }
        }
        
    },
    
    evaluate: async function(arg) {
      console.log('evaluateOrder')
      const { orderId, score, comment } = arg;
      const userId = userInfo._id;
      const side = 1;
      const serviceType = this.serviceType.EVALUATE;
      try {
        const res = await uniCloud.callFunction({
          name: 'orderService',
          data: { side, serviceType, userId, orderId }
        })
        console.log(res);
        const result = res.result;
        if (!result.success) {
          let message;
          switch(res.code) {
            case -2: message = '订单状态错误，请刷新重试'; break;
            default: message = '操作失败，请重试'; break;
          }
          result.message = message;
        }
        return result;
      } catch(e) {
        console.log(e);
        return {success: false, code: -1, error: e }
      }
    },
    
    cancel: async function(arg) {
      console.log('cancelOrder')
        const { orderId, status } = arg;
        const userId = userInfo._id;
        const side = 1;
        const serviceType = this.serviceType.CANCEL;
        try {
          const res = await uniCloud.callFunction({
            name: 'orderService',
            data: { orderId, status, userId, side, serviceType }
          })
          console.log(res)
          const result = res.result;
          if (!result.success) {
            let message;
            switch(result.code) {
              case -2: message = '订单状态异常，请刷新重试'; break;
              default: message = '操作失败，请重试'
            }
            result.message = message;
          }
          return result;
        } catch(e) {
          console.log(e);
            return {
              success: false,
              code: -1,
              message: '操作失败，请重试'
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

