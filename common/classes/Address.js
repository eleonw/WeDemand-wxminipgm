import Location from '@/common/classes/Location.js';

export default class Address {
    constructor(arg={
        location: new Location(),
        name: '',
        sex: undefined,
        mobile: '',
    }) {
        if (arg.location instanceof Location) {
            this.location = arg.location;
        } else {
            this.location = new Location({...arg.location, parse: false});
        }
        this.name = arg.name?arg.name:'';
        this.sex = arg.sex?arg.sex:undefined;
        this.mobile = arg.mobile?arg.mobile:'';
    }
};

Address.prototype.hasName = function() {
    return this.name && (this.name != '');
};

Address.prototype.hasSex = function() {
    return this.sex == 0 || this.sex == 1;
};

Address.prototype.hasValidMobile =  function() {
    return this.mobile && (this.mobile != '') && (this.mobile.length) == 11 && !isNaN(Number(this.mobile));
};


Address.defaultAddress = new Address( {
    location: Location.defaultLocation,
    name: 'wyl',
    mobile: '138200000000',
    sex: 1,
})