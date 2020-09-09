import Location from '@/common/classes/Location.js';

export default class Address {
    constructor(arg={
        location: new Location(),
        name: '',
        sex: undefined,
        tel: '',
    }) {
        if (arg.location instanceof Location) {
            this.location = arg.location;
        } else {
            this.location = new Location(arg.location);
        }
        
        this.name = arg.name?arg.name:'';
        this.sex = arg.sex?arg.sex:undefined;
        this.tel = arg.tel?arg.tel:'';
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


Address.defaultAddress = new Address( {
    location: Location.defaultLocation,
    name: 'wyl',
    tel: '138200000000',
    sex: 1,
})