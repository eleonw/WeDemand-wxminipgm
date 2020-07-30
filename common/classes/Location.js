import {QQ_MAP_KEY} from '@/common/sensitiveData.js';
import {promisify} from '@/common/helper.js';

const QQMapWX = require('@/libs/qqmap-wx-jssdk.js');

const qqmapsdk = new QQMapWX({
        key: QQ_MAP_KEY,
    });

class Location {
    constructor(arg={
        longitude: undefined,
        latitude: undefined,
        address: '',
        name: '',
        detail: '',
        parse: false,
    }) {
        this.longitude = arg.longitude;
        this.latitude = arg.latitude;
        this.address = arg.address?arg.address:'';
        this.name = arg.name?arg.name:'';
        this.detail = arg.detail?arg.detail:'';

        if (arg.parse) {
            this.reverseGeocoder();
        }
    }
}

Location.prototype.reverseGeocoder = async function(delay=false) {
    let res;
    
    try {
        if (delay) {
            this.name = '获取定位中...';
            await new Promise((resolve, reject) => {
                setTimeout(resolve, 800);
            });
        }
        res = await promisify(qqmapsdk.reverseGeocoder, {location: {longitude: this.longitude, latitude: this.latitude}}, qqmapsdk);
    } catch(e) {
        this.name = '地址解析失败，请重试';
        this.address = '';
        this.detail = '';
        console.log('reverseGeocoder fail:');
        console.log(e);
        return;
    }
      
    const component = res.result.address_component;
    
    this.address = component.city + component.district + component.street_number;
    this.name = res.result.formatted_addresses.recommend;
    this.detail = '';
}

Location.prototype.isValid = function() {
    return this.longitude && this.latitude;
}

Location.prototype.hasDetail = function() {
    return this.detail && (this.detail != '');
}

Location.defaultLocation = new Location(116.347468, 39.981617, '北京市海淀区学院路37号', '北京航空航天大学');

export default Location;