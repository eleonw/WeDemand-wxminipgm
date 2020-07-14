import Location from '@/common/classes/Location.js';

export default class Address {
    constructor(location=new Location(), name='', sex=undefined, tel='') {
        this.location = location;
        this.name = name;
        this.sex = sex;
        this.tel = tel;
    }
};

Address.prototype.hasName = function() {
    return this.name && (this.name != '');
};

Address.prototype.hasSex = function() {
    return this.sex == 0 || this.sex == 1;
};

Address.prototype.hasValidTel =  function() {
    return this.tel && (this.tel != '') && (this.tel.length) == 11 && !isNaN(Number(this.tel));
};