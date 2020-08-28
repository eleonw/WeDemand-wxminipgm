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
                            <navigatorWithPlaceholder :content="getTimeString(0)" placeholder="选择时间" @click.native="showSelector('timeStart')"></navigatorWithPlaceholder>
                        </view>
                        <view class="timeRangeItem">
                            <view>至</view>
                            <navigatorWithPlaceholder :content="getTimeString(1)" placeholder="选择时间" @click.native="showSelector('timeEnd')"></navigatorWithPlaceholder>
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
                        <navigatorWithPlaceholder :content="tip?tip + '￥':''" placeholder="加tip加快接单速度" @click.native="showSelector('tip')"></navigatorWithPlaceholder>
                    </view>
                </view>
            </view>
            
            
        </view>
            

        
        <timePicker v-if="show_timeStart" class="selectorComponent" @exit="hideSelector('timeStart')" v-model="timeStart"></timePicker>
        <timePicker v-else-if="show_timeEnd" class="selectorComponent"  @exit="hideSelector('timeEnd')" v-model="timeEnd"></timePicker>
        <itemInfoSelector v-else-if="show_itemInfo" class="selectorComponent" v-model="itemInfo" @exit="hideSelector('itemInfo')"></itemInfoSelector>
        <seperateTextarea v-else-if="show_note" v-model="note" class="selectorComponent"  @exit="hideSelector('note')"></seperateTextarea>
        <priceInput v-else-if="show_tip" class="selectorComponent"  @exit="hideSelector('tip')" v-model="tip"></priceInput>

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
                
                timeStart: null,
                timeEnd: null,
                itemInfo: {},
                note: '',
                
                coupon: null,
                tip: null,
                
                show_timeStart: false,
                show_timeEnd: false,
                show_itemInfo: false,
                show_note: false,
                show_tip: false,
                
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
                
                const target = index==0 ? 'timeStart' : 'timeEnd'; 
                
                const substitude = '现在'
                
                if (page[target]) {
                    return getTimeString({timestamp: page[target], substitude});
                } else {
                    return '';
                }
            },
            
            
            getItemInfoString: function() {
                const itemInfo = page.itemInfo;
                if (Object.keys(itemInfo).length != 0) {
                    
                    return itemInfo.type + '、' + itemInfo.itemValue + '、' + weightAssistant.getWeightString(itemInfo.weight)
                }
            },
            
     
            
            getBasicCost: function() {
                return 2;
            },
            
            confirm: async function(e) {
                
                console.log('confirm')
                let notice;
                
                if (!dev) {
                    if (!shareData.completed[0]) {
                        notice = '请填写取件地址';
                    } else if (!shareData.completed[1]) {
                        notice = '请填写送件地址';
                    } else if (!page.timeStart || !page.timeEnd) {
                        notice = '请完善取件时间';
                    } else if (page.timeStart >= page.timeEnd) {
                        notice = '请确保取件起始时间早于取件结束时间'
                    } else if (Object.keys(page.itemInfo).length == 0) {
                        notice = '请完善物品信息';
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
                const timeStart = page.timeStart;
                const timeEnd = page.timeEnd;
                const itemInfo = page.itemInfo;
                const note = page.note;
                const couponId = page.coupon ? page.coupon.id : null;
                const tip = page.tip?page.tip:0;
                
                const res = await orderAssistant.createOrder({
                    fromAddress,
                    toAddress,
                    serviceType,
                    timeStart,
                    timeEnd,
                    itemInfo,
                    note,
                    couponId,
                    tip,
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
                
            }
            
		},
        onLoad: function() {  
            page = this;
            page.QQ_MAP_KEY = QQ_MAP_KEY;
            page.shareData = shareData;
            
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
