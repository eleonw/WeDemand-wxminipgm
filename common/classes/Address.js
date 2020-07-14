import Location from '@/common/classes/Location.js';

export default class Address {
    constructor(location=new Location(), name='', sex=undefined, tel='') {
        this.location = location;
        this.name = name;
        this.sex = sex;
        this.tel = tel;
    }
    
    hasLocation() {
        return this.location != null;
    }
    
    hasName() {
        return this.name != '';
    }
    
    hasTel() {
        return this.tel != '';
    }
}