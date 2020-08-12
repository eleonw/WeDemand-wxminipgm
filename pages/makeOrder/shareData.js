import Address from "@/common/classes/Address.js";
import { serviceType, userInfo } from "@/common/globalData.js";
import Vue from 'vue';
import { addressBookHelper } from "@/common/server.js";
import { beanify } from "@/common/helper.js";

let mapContext;

const detailFormUrls = {
    [serviceType.HELP_DELIVER]: '/pages/makeOrder/detailForms/helpDeliver',
    [serviceType.HELP_BUY]: '/pages/makeOrder/detailForms/helpBuy',
    [serviceType.OTHERS]: '/pages/makeOrder/detailForms/others'
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
            case serviceType.OTHERS:
                this.serviceType = serviceType.OTHERS;
                this.address = [originAddress];
                this.completed = [false];
                break;
            default:
                throw new Error('invalid service type');
        }
        this.status = 0;
        this.currentAddressIdx = 0;
    },

    setMapContext: function(context) {
        mapContext = context;
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
            case serviceType.OTHERS:
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
        console.log('get address book')
        try {
            this.addressBook = await addressBookHelper.getAddressBook({
                userId: userInfo.id
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
            const res = await addressBookHelper.addToAddressBook({address: address});
            this.addressBook.push({_id: res.id, address: address});
        }
    },
    
    updateAddressBook: async function(arg) {
        const address = beanify(arg.address)
        await addressBookHelper.updateAddressBook({recId: this.addressBook[arg.index]['_id'], address: address});
        this.addressBook[arg.index].address = address;
    },
    
    removeAddress: async function(arg) {
        await addressBookHelper.removeAddress({recId: this.addressBook[arg.index]['_id']});
        this.addressBook.splice(arg.index, 1);
    }
}

export default shareData;