import Location from "@/common/classes/Location.js";

export const color = {
    MAIN: '#457b9d',
    LIGHT: '#a8dadc',
    DARK: '#1d3557',
    BACKGROUND: '#f1faee',
    CONTRAST: '#e63946',
    PLACEHOLDER: '#8f8f8f'
}

export const serviceType = {
    NONE: -1,
    HELP_DELIVER: 0,
    HELP_BUY: 1,
    OTHER_SERVICE: 2,
    
    getServiceTypeString: function(type) {
        switch(type) {
            case this.HELP_DELIVER:
                return '校园帮送';
            case this.HELP_BUY:
                return '校园帮买';
            case this.OTHER_SERVICE:
                return '其他跑腿';
            default:
                throw new Error('invalid service type');
        }
    }
}

export const orderStatus = {
    INITIALING: 0,
    CREATED: 1,
    ACCEPTED: 2,
    SERVING: 3,
    EVALUATING: 4,
    COMPLETED: 5,
    CANCELED: -2,
    EXCEPTION: -1,
}

export const defaultLocation = new Location({
    longitude: 116.347236349,
    latitude: 39.981800698,
    name: "北京航空航天大学",
    address: "北京市海淀区学院路37号"
})

export const dev = true;

export const userInfo = {
    wxOpenid: "ogjlP5YAbGPGuaTpblXIwWe8o07E",
};

