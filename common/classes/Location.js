import {QQ_MAP_KEY} from '@/common/sensitiveData.js';
import {promisify} from '@/common/helper.js';

const QQMapWX = require('@/libs/qqmap-wx-jssdk.js');

const qqmapsdk = new QQMapWX({
        key: QQ_MAP_KEY,
    });

class Location {
    constructor(longitude=undefined, latitude=undefined, address='', name='', extra='', parse=false) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.address = address;
        this.name = name;
        this.extra = extra;
        
        if (parse) {
            this.reverseGeocoder();
        }
    }
}

Location.prototype.reverseGeocoder = async function() {
    let res;
    
    this.name = '地址解析中...';
    try {
        res = await promisify(qqmapsdk.reverseGeocoder, {location: {longitude: this.longitude, latitude: this.latitude}}, qqmapsdk);
        
        console.log('reverseGeocoder success');
    } catch(e) {
        this.name = '地址解析失败，请重试';
        this.address = '';
        this.extra = '';
        console.log('reverseGeocoder fail:');
        console.log(e);
        return;
    }
      
    const component = res.result.address_component;
    
    this.address = component.city + component.district + component.street_number;
    this.name = res.result.formatted_addresses.recommend;
    this.extra = '';
}

Location.defaultLocation = new Location(116.347468, 39.981617, '北京市海淀区学院路37号', '北京航空航天大学');

export default Location;