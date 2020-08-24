import { userInfo } from '@/common/globalData.js';

export async function sendSMSCode(opt) {
    const {
        type
    } = opt;
    const res = await uniCloud.callFunction({
        name: 'sendSMSCode',
        data: {
            type,
            mobile: userInfo.mobile
        }
    })
    console.log(res);
    return res;
}

export async function login(loginData) {
    
    console.log('login called')
    
    let res = await uniCloud.callFunction({
        name: 'login',
        data: loginData
    });

    
    console.log(res)
}

export const paymentAssistant = {
    
    payWithBlance: async function(opt) {
        const res = await uniCloud.callFunction({
            name: changeBalance,
            data: {
                userId: userInfo.id,
                amount: -opt.amount,
            }
        })
        console.log(res)
    }
    
    
}

export const addressBookHelper = {
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
                userId: userInfo.id,
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

