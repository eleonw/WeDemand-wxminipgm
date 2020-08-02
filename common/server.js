import { userInfo } from '@/common/globalData.js';

export async function login(loginData) {
    
    console.log('login called')
    
    let res = await uniCloud.callFunction({
        name: 'login',
        data: loginData
    });
    const userInfo =  res.result.userInfo;
    userInfo.wxOpenid = userInfo.wx_openid;
    userInfo.id = userInfo._id;
    delete userInfo._id;
    delete userInfo.wx_openid;
    
    console.log(userInfo);
    
    return res.result;
}

export const addressBookHelper = {
    getAddressBook: async function(arg) {
        const res = await uniCloud.callFunction({
            name: 'getAddressBook',
            data: {
                user_id: arg.userId
            }
        });
        const addressBook = [];
 
        for (let addressRec of res.result) {
            addressBook.push(addressRec);
        }
        console.log(addressBook)
        return addressBook;
    },
    
    addToAddressBook: async function(arg) {
        
        
        const res = await uniCloud.callFunction({
            name: 'modifyAddressBook',
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
            name: 'modifyAddressBook',
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
            name: 'modifyAddressBook',
            data: {
                type: 2,
                recId: arg.recId
            }
        });
    },
    
  
}

