<template>
	<view class="root page">
        
        <statusBar class="statusBar"></statusBar>
        
        <map id="map" class="map" longitude="113" latitude="39" scale="15" :subkey="QQ_MAP_KEY" :markers="mapMarkers"></map>
        <backgroundIcon type="back" size="25" shadow="true" class="backNavigator" @click="back"></backgroundIcon>
        
        <view class="detailForm">
            <addressCard></addressCard>
            <view class="form card">
                <view class="formItem">
                    <view class="formItemTitle">取件时间</view>
                    <view class="formItemRight fromItemBlock">
                        <view class="timeRangeItem">
                            <view>从</view>
                            <navigatorWithPlaceholder :content="getTimeString(0)" placeholder="选择时间" @click.native="showSelector('startTime')"></navigatorWithPlaceholder>
                        </view>
                        <view class="timeRangeItem">
                            <view>至</view>
                            <navigatorWithPlaceholder :content="getTimeString(1)" placeholder="选择时间" @click.native="showSelector('endTime')"></navigatorWithPlaceholder>
                        </view>
                        
                    </view>
                </view>
                <view class="formItem">
                    <view class="formItemTitle">物品信息</view>
                    <view class="formItemRight">
                        <navigatorWithPlaceholder :content="getItemInfoString()" placeholder="物品类型、价值、重量" @click.native="showSelector('itemInfo')"></navigatorWithPlaceholder>
                    </view>
                </view>
                <view class="formItem">
                    <view class="formItemTitle">备注</view>
                    <view class="formItemRight">
                        <navigatorWithPlaceholder :content="note" placeholder="送件要求、物品描述等" @click.native="showSelector('note')"></navigatorWithPlaceholder>
                    </view>
                </view>
                <view class="formItem">
                    <view class="formitemTitle">敏感信息</view>
                    <view class="formItemRight">
                        <navigatorWithPlaceholder :content="sensitiveInfo.main" placeholder="只有接单的用户可以查看" @click.native="showSelector('sensitiveInfo')"></navigatorWithPlaceholder>
                    </view>
                </view>

            </view>
            
            <view class="form card">
                <view class="formItem">
                    <view class="formItemTitle">优惠券</view>
                    <view class="formItemRight">
                        <navigatorWithPlaceholder :value="coupon" placeholder="选择优惠券" @click.native="chooseCoupon"></navigatorWithPlaceholder>
                    </view>
                </view>
                <view class="formItem">
                    <view class="formItemTitle">小费</view>
                    <view class="formItemRight">
                        <navigatorWithPlaceholder :content="getTipString()" placeholder="加tip加快接单速度" @click.native="showSelector('tip')"></navigatorWithPlaceholder>
                    </view>
                </view>
            </view>
            
            <view class="form card">
                <view class="formItem">
                    <view class="formItemTitle">取消时间</view>
                    <view class="formItemRight formItemBlock">
                        <radio-group @change="expireTimeTypeChange" class="radioGroup">
                            <label>
                                <radio :value="0" :color="colorMain" :checked="!assignExpireTime"/><text>默认时间</text>
                                <radio :value="1" :color="colorMain" :checked="assignExpireTime"/><text>指定时间</text>
                            </label>
                        </radio-group>
                        <view v-if="assignExpireTime">
                            <navigatorWithPlaceholder :content="getTimeString(3)" placeholder="请选择取消时间"  @click.native="showSelector('expireTime')"></navigatorWithPlaceholder>
                        </view>
                        <view else>
                            {{ getTimeString(1) }}
                        </view>
                    </view>
                </view>
            </view>
            
        </view>
        
        <timePicker v-if="show_startTime" class="selectorComponent" @exit="hideSelector('startTime')" v-model="startTime"></timePicker>
        <timePicker v-else-if="show_endTime" class="selectorComponent"  @exit="hideSelector('endTime')" v-model="endTime"></timePicker>
        <itemInfoSelector v-else-if="show_itemInfo" class="selectorComponent" :itemInfo="itemInfo" :sensitiveInfo="sensitiveInfo" @exit="exitItemInfoSelector"></itemInfoSelector>
        <seperateTextarea v-else-if="show_note" v-model="note" class="selectorComponent"  @exit="hideSelector('note')"></seperateTextarea>
        <seperateTextarea v-else-if="show_sensitiveInfo" v-model="sensitiveInfo.main" class="selectorComponent"  @exit="hideSelector('sensitiveInfo')"></seperateTextarea>
        <priceInput v-else-if="show_tip" class="selectorComponent"  @exit="hideSelector('tip')" v-model="tip"></priceInput>
        <timePicker v-else-if="show_expireTime" class="selectorComponent"  @exit="hideSelector('expireTime')" v-model="expireTime"></timePicker>

        <orderNav class="orderNav" :costItems="[{
            title: '基础费用',
            cost: getBasicCost(),
        },
        {
            title: '小费',
            cost: tip?tip:0,
        }]" @clickConfirm="confirm"></orderNav>
        
	</view>
</template>

<script>
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
    
    import { orderAssistant_creater } from '@/common/server.js';
    import { weightAssistant, getTimeString, addAll, getMoneyString } from '@/common/helper.js';
    
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
                sensitiveInfo: {
                    main: ''
                },
                sensitiveInfo: null,
                note: '',
                
                coupon: null,
                tip: null,
                
                expireTime: null,
                assignExpireTime: false,
                
                show_startTime: false,
                show_endTime: false,
                show_itemInfo: false,
                show_note: false,
                show_sensitiveInfo: false,
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
                
                const res = await orderAssistant_creater.initial({
                    fromAddress,
                    toAddress,
                    serviceType,
                    startTime,
                    endTime,
                    itemInfo,
                    note,
                    sensitiveInfo,
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
            
            exitItemInfoSelector: function(e) {
                page.hideSelector('itemInfo');
                if (e.valid) {
                    page.itemInfo = e.itemInfo;
                    page.sensitiveInfo = e.sensitiveInfo;
                    console.log(page.itemInfo);
                    console.log(page.sensitiveInfo);
                }
            },
            
            getTipString: function(){
                const moneyString = getMoneyString(page.tip);
                return moneyString == '' ? '' : moneyString + '￥';
            }
            
        },
        
        created: function() {
            page = this;
            page.QQ_MAP_KEY = QQ_MAP_KEY;
            page.shareData = shareData;
            page.colorMain = color.MAIN;
            page.sensitiveInfo = {others: ''};
            
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

</script>

<style>
    
   @import url("./detailForms.css");
   
</style>
