import Address from "@/common/classes/Address.js";
import {serviceType} from "@/common/globalData.js";

let mapContext;

const shareData = {
    /**
     * serviceType用于标识当前地址信息对应的服务，与newOrderPage的tabIndex相对应，为globalData.js中定义的枚举类型
     */
    serviceType: serviceType.HELP_DELIVER,
    address: [new Address(), new Address()],
    completed: [false, false],
    /**
     * @param currentAddressIdx 是目前待确定的地址的编号，对应了填写地址的序号，也对应了当前地图改变时对应改变的地址项
     */
    currentAddressIdx: 0,

    setMapContext: function(context) {
        mapContext = context;
    },
    
    setCurrentLocation: async function(longitude, latitude) {
        mapContext.moveToLocation({
            longitude: longitude,
            latitude: latitude
        });
        let currentLocation = this.address[this.currentAddressIdx].location;
        currentLocation.longitude = longitude;
        currentLocation.latitude = latitude;
        await currentLocation.reverseGeocoder(true);
    },
    
    clear: function() {
        this.serviceType = serviceType.HELP_DELIVER;
        this.address = [new Address(), new Address()];
        this.complete = [false, false];
        this.currentAddress = 0;
    },
    
    addressCompleted: function() {
        
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
    }
}

export default shareData;