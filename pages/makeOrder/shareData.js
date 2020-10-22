import Address from "@/common/classes/Address.js";
import { serviceType, userInfo } from "@/common/globalData.js";
import Vue from 'vue';
import { addressBookAssistant } from "@/common/server.js";
import { beanify } from "@/common/helper.js";

let mapContext;

const detailFormUrls = {
    [serviceType.HELP_DELIVER]: '/pages/makeOrder/detailForms/helpDeliver',
    [serviceType.HELP_BUY]: '/pages/makeOrder/detailForms/helpBuy',
    [serviceType.OTHER_SERVICE]: '/pages/makeOrder/detailForms/otherService'
}

const shareData = {
    /**
     * serviceType用于标识当前地址信息对应的服务，与newOrderPage的tabIndex相对应，为globalData.js中定义的枚举类型
     */
    serviceType: serviceType.HELP_DELIVER,
    address: [new Address(), new Address()],
    addressBook: [],
    addressBookFailure: false,
    completed: [false, false],
    
    /**
     * @param {Number} status
     * status = 0: 还在填写地址的阶段
     * status = 1: 在填写细节的阶段，进入addressForm后一定用navigateBack
     */
    status: 0,
    /**
     * @param currentAddressIdx 是目前待确定的地址的编号，对应了填写地址的序号，也对应了当前地图改变时对应改变的地址项
     */
    currentAddressIdx: 0,
    addressCardLock: false,
    
    setMapContext: function(context) {
        mapContext = context;
    },
    
    setServiceType: function(type, newAddress=false) {
        let originAddress;
        if (newAddress) {
            originAddress = new Address();
        } else {
            originAddress = this.address[0];
        }
        switch(type) {
            case serviceType.HELP_DELIVER:
                this.serviceType = serviceType.HELP_DELIVER;
                this.address = [originAddress, new Address()];
                this.completed = [false, false];
                
                break;
            case serviceType.HELP_BUY:
                this.serviceType = serviceType.HELP_BUY;
                this.address = [originAddress];
                this.completed = [false];
                break;
            case serviceType.OTHER_SERVICE:
                this.serviceType = serviceType.OTHER_SERVICE;
                this.address = [originAddress];
                this.completed = [false];
                break;
            default:
                throw new Error('invalid service type');
        }
        this.status = 0;
        this.currentAddressIdx = 0;
    },

    
    setCurrentLocation: async function(longitude, latitude, move=true) {
        if (move) {
            mapContext.moveToLocation({
                longitude: longitude,
                latitude: latitude
            });
        }
        
        let currentLocation = this.address[this.currentAddressIdx].location;
        currentLocation.longitude = longitude;
        currentLocation.latitude = latitude;
        
        await currentLocation.reverseGeocoder(true);
        
    },
    
    clear: function() {
        this.setServiceType(serviceType.HELP_DELIVER, true);
    },
    
    allAddressCompleted: function() {
        
        switch (this.serviceType) {
            case serviceType.HELP_DELIVER:
                return this.completed[0] && this.completed[1];
            case serviceType.HELP_BUY:
                return this.completed[0];
            case serviceType.OTHER_SERVICE:
                return this.completed[0];
            default:
                console.log();
                throw new Error('undefined serviceType!')
        }
    },
    
    setCurrentAddress: function(address) {
        Vue.set(this.address, this.currentAddressIdx, address);
        Vue.set(this.completed, this.currentAddressIdx, true);
        this.currentAddressIdx++;
    },
    
    navigateAfterCompleteAddress: function() {
        if (this.allAddressCompleted() && this.status == 0) {
            this.status = 1;
            uni.redirectTo({
                url: detailFormUrls[this.serviceType],
            });
        } else {
            uni.navigateBack();
        }
    },
    
    getAddressBook: async function() {
        try {
            this.addressBook = await addressBookAssistant.getAddressBook({
                userId: userInfo._id
            });
            this.addressBookFailure = false;
        } catch(e) {
            console.log('fail to get addressbook: ');
            console.log(e)
            this.addressBook = [];
            this.addressBookFailure = true;
        }
        
    },
    
    addToAddressBook: async function(address) {
        if (this.addressBook.length >= 10) {
            return {
                exceed: true,
            }
        } else {
            
            address = beanify(address);
            const res = await addressBookAssistant.addToAddressBook({address: address});
            this.addressBook.push({_id: res.id, address: address});
        }
    },
    
    updateAddressBook: async function(arg) {
        const address = beanify(arg.address)
        await addressBookAssistant.updateAddressBook({recId: this.addressBook[arg.index]['_id'], address: address});
        this.addressBook[arg.index].address = address;
    },
    
    removeAddress: async function(arg) {
        await addressBookAssistant.removeAddress({recId: this.addressBook[arg.index]['_id']});
        this.addressBook.splice(arg.index, 1);
    },
    
    orderList: [],
    _getListRec: null,
    
    test: async function() {
        console.log('hhh')
    },
    
    getList: async function(arg) {
        const {
            status, renew
        } = arg;
        console.log('status')
        console.log(arg.renew)
        if (renew) {
            this.orderList.splice(0, this.orderList.length);
            this._getListRec = null;
        }
        
        try {
            const res = await orderAssistant_creater.getOrderList({
                _getListRec: this._getListRec,
                limit: 5,
            });
            if (res.success) {
                _getListRec = res._getListRec;
                if (res.orderList.length > 0) {
                    this.orderList.push(...res.orderList);
                    this.orderList.sort((a, b) => {return a.createTime - b.createtime;})
                    return {success: true, nomore: false};
                } else {
                    return {success: true, nomore: true};
                }
            } else {
                console.log(res);
                throw new Error();
            }
        } catch(e) {
            return {success: false};
        }
    }
}

export default shareData;