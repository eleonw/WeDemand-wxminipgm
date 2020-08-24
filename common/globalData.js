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
}

export const defaultLocation = new Location({
    longitude: 116.347236349,
    latitude: 39.981800698,
    name: "北京航空航天大学",
    address: "北京市海淀区学院路37号"
})

export const dev = true;

export const userInfo = {
    id: "0d06a2fd5f23808900212dec5e0f10f0",
    nickname: "Gvs01892",
    wxOpenid: "ogjlP5YAbGPGuaTpblXIwWe8o07E",
    balance: 10,
    mobile: '13728084958'
};