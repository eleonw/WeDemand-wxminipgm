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
                            <navigatorWithPlaceholder :content="getTimeString(2)" placeholder="请选择取消时间"  @click.native="showSelector('expireTime')"></navigatorWithPlaceholder>
                        </view>
                        <view v-else>
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
            cost: tip,
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
    
    import { color, serviceType as _serviceType }from '@/common/globalData.js';
    import shareData from './../shareData.js';
    import { QQ_MAP_KEY} from '@/common/sensitiveData.js';
    
    import { orderAssistant_creater as orderAssistant } from '@/common/server.js';
    import { weightAssistant, getTimeString, addAll, getMoneyString } from '@/common/helper.js';
    import eventBus from '@/common/eventBus.js';
    
    let page;
    let mapContext;
    let orderId;
    const payEventName = 'payHelpDeliv'
    
    const dev = false;
    
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
                tip: 0,
                
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
                return 190;
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
                uni.showLoading({mask:true})
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
                    uni.hideLoading();
                    uni.showToast({
                        title: notice,
                        icon: 'none',
                    });
                    return;
                }
                
                const expireWindow = 1000 * 60 * 5;
                
                const fromAddress = shareData.address[0];
                const toAddress = shareData.address[1];
                const serviceType = _serviceType.HELP_DELIVER;
                const startTime = page.startTime;
                const endTime = page.endTime;
                const itemInfo = page.itemInfo;
                const sensitiveInfo = page.sensitiveInfo;
                const note = page.note;
                const couponId = page.coupon ? page.coupon.id : null;
                const expireTime = page.assignExpireTime ? page.expireTime : page.endTime;
                const cost = {
                    tip: page.tip,
                    basic: page.getBasicCost(),
                }
                const totalCost = e.totalCost;
                
                const order = { serviceType, fromAddress, toAddress, startTime, endTime,
                  itemInfo, note, sensitiveInfo, couponId, expireTime, cost, totalCost }
                  
                let res = await orderAssistant.initial(order);
                if (!res.success) {
                    await page.promisify(uni.showModal, {
                        content: '操作失败，请重试',
                        showCancel: false,
                    })
                    return;
                } else {
                    orderId = res.orderId;
                    const paras = 'amount=' + totalCost + "&eventName=" + payEventName;
                    eventBus.$on(payEventName, postPay)
                    uni.navigateTo({url: '/pages/pay/pay?' + paras});
                    shareData.clear();
                }
            },
            
            exitItemInfoSelector: function(e) {
                page.hideSelector('itemInfo');
                console.log(e)
                if (e.valid) {
                    page.itemInfo = e.itemInfo;
                    page.sensitiveInfo = e.sensitiveInfo;
                }
                console.log(page.sensitiveInfo)
            },
            
            getTipString: function(){
                const moneyString = getMoneyString(page.tip);
                return moneyString == '' ? '' : '￥' + moneyString;
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
        },
        
        onUnload: function() {
          shareData.clear();
        }
    }
    
    async function postPay(e) {
      eventBus.$off(payEventName);
      let res;
      let url;
      if (e.success) { res = await orderAssistant.create({orderId: orderId});
        url = './result?success=true&orderId=' + orderId;
      } else {
        url = './result?success=false&orderId=' + orderId;
      }
      uni.redirectTo()({url})
      uni.hideLoading();
    }

</script>

<style>
    
   @import url("./detailForms.css");
   
</style>
