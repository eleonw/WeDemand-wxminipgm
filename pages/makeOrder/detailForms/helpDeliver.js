import addressCard from './../components/addressCard.vue';
import statusBar from '@/components/statusBar/statusBar.vue';
import backgroundIcon from '@/components/backgroundIcon/backgroundIcon.vue'
import navigatorWithPlaceholder from '@/components/navigatorWithPlaceholder/navigatorWithPlaceholder.vue';
import orderNav from '@/components/orderNav/orderNav.vue';

import timePicker from '@/components/timePicker/timePicker.vue';
import itemInfoSelector from '@/components/itemInfoSelector/itemInfoSelector.vue';
import seperateTextarea from '@/components/seperateTextarea/seperateTextarea.vue';
import priceInput from '@/components/priceInput/priceInput.vue';

import { Order_HelpDeliver } from '@/common/classes/Order.js';

import { color, dev, serviceType as _serviceType }from '@/common/globalData.js';
import shareData from './../shareData.js';
import { QQ_MAP_KEY} from '@/common/sensitiveData.js';

import { orderAssistant } from '@/common/server.js';
import { weightAssistant, getTimeString } from '@/common/helper.js';

let page;
let mapContext;

export default {
    components: {
        addressCard, navigatorWithPlaceholder, statusBar, backgroundIcon, orderNav,
        timePicker, itemInfoSelector, seperateTextarea, priceInput
    },
    data() {
        return {
            
            mapMarkers: null,
            QQ_MAP_KEY: null,
            shareData: null,
            colorMain: null,
            
            startTime: null,
            endTime: null,
            itemInfo: {},
            sensitiveInfo: {},
            note: '',
            
            coupon: null,
            tip: null,
            
            expireTime: null,
            assignExpireTime: false,
            
            show_startTime: false,
            show_endTime: false,
            show_itemInfo: false,
            show_note: false,
            show_tip: false,
            show_expireTime: false,
            
            costItems: null,
            
        }
    },
    methods: {
        back: function() {

            uni.showModal({
                content: '放弃订单？',
                cancelColor: color.MAIN,
                confirmColor: "#8f8f8f",
                
                success: res => {
                    if (res.confirm) {
                        shareData.clear();
                        uni.navigateBack();
                    }
                },
            })
        },
        
        showSelector: function(type) {
            page['show_' + type] = true;
        },
        
        hideSelector: function(type) {
            page['show_' + type] = false;
        },
        
        getTimeString: function(index) {
            
            let timestamp;
            switch(index) {
                case 0:
                    timestamp = page.startTime;
                    break;
                case 1:
                    timestamp = page.endTime;
                    break;
                case 2:
                    timestamp = page.expireTime;
                    break;
            }
            
            return timestamp? getTimeString({timestamp, substitude: '现在'}): '';
           
        },
        
        
        getItemInfoString: function() {
            return Order_HelpDeliver.prototype.getItemInfoString.call(page)
        },
        
 
        
        getBasicCost: function() {
            return 2;
        },
        
        
        expireTimeTypeChange: function(e) {
            if (e.detail.value == 0) {
                page.assignExpireTime = false;
                page.expireTime = null;
            } else {
                page.assignExpireTime = true;
            }
        },
        
        
        confirm: async function(e) {
            
            console.log('confirm')
            let notice;
            
            if (!dev) {
                if (!shareData.completed[0]) {
                    notice = '请填写取件地址';
                } else if (!shareData.completed[1]) {
                    notice = '请填写送件地址';
                } else if (!page.startTime || !page.endTime) {
                    notice = '请完善取件时间';
                } else if (page.startTime >= page.endTime) {
                    notice = '请确保取件起始时间早于取件结束时间'
                } else if (Object.keys(page.itemInfo).length == 0) {
                    notice = '请完善物品信息';
                } else if (page.assignExpireTime && !page.expireTime) {
                    notice = '请选择订单取消时间'
                }
            }
            
            if (notice) {
                uni.showToast({
                    title: notice,
                    icon: 'none',
                });
                return;
            }
            
            uni.showLoading();
            const fromAddress = shareData.address[0];
            const toAddress = shareData.address[1];
            const serviceType = _serviceType.HELP_DELIVER;
            const startTime = page.startTime;
            const endTime = page.endTime;
            const itemInfo = page.itemInfo;
            const sensitiveInfo = page.sensitiveInfo;
            const note = page.note;
            const couponId = page.coupon ? page.coupon.id : null;
            const expireTime = page.expireTime;
            const cost = {
                tip: page.tip?page.tip:0,
                basic: page.getBasicCost(),
            }
            
            const res = await orderAssistant.createOrder({
                fromAddress,
                toAddress,
                serviceType,
                startTime,
                endTime,
                itemInfo,
                note,
                couponId,
                expireTime,
                cost,
            });
            
            
            const url = './result/result?success=' + res.success;
            uni.hideLoading();
            if (res.success) {
                shareData.clear();
                uni.redirectTo({
                    url
                })
            } else {
                uni.navigateTo({
                    url
                })
            }
            
            
            
        },
        
        pay: function() {
            
        },
        
        
        
    },
    
    created: function() {
        page = this;
        page.QQ_MAP_KEY = QQ_MAP_KEY;
        page.shareData = shareData;
        page.colorMain = color.MAIN;
        
        mapContext = uni.createMapContext('map', page);
    },
    
    
    onShow: function() {
        
        page.mapMarkers = [
            {
                id: 0,
                latitude: shareData.address[0].location.latitude,
                longitude: shareData.address[0].location.longitude,
                iconPath: '/static/image/icon/retrive.png',
                width: 40,
                height: 40, 
            }, 
            {
                id: 1,
                latitude: shareData.address[1].location.latitude,
                longitude: shareData.address[1].location.longitude,
                iconPath: '/static/image/icon/deliver.png',
                width: 40,
                height: 40,
            }
        ];
        
        mapContext.includePoints({
            points: page.mapMarkers,
            padding: [80, 30, 120, 30],
        });
    }
}