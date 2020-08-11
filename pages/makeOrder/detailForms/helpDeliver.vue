<template>
	<view class="root">
        <view class="page">
            
            <statusBar class="statusBar"></statusBar>
            
            <map id="map" class="map" longitude="113" latitude="39" scale="15" :subkey="QQ_MAP_KEY" :markers="mapMarkers"></map>
            <backgroundIcon type="back" size="25" shadow="true" class="backNavigator" @click="back"></backgroundIcon>
            
            <view class="detailForm">
                <addressCard></addressCard>
                <view class="form card">
                    <view class="formItem">
                        <view class="formItemTitle">取件时间</view>
                        <view class="formItemRight">
                            <navigatorWithPlaceholder :content="retriveTimeString" placeholder="选择取件时间" @click.native="chooseRetriveTime"></navigatorWithPlaceholder>
                        </view>
                    </view>
                    <view class="formItem">
                        <view class="formItemTitle">物品信息</view>
                        <view class="formItemRight">
                            <navigatorWithPlaceholder :content="itemInfo" placeholder="物品类型、价值、重量" @click.native="chooseItemInfo"></navigatorWithPlaceholder>
                        </view>
                    </view>
                    <view class="formItem">
                        <view class="formItemTitle">备注</view>
                        <view class="formItemRight">
                            <navigatorWithPlaceholder :content="note" placeholder="送件要求、物品描述等" @click.native="addNote"></navigatorWithPlaceholder>
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
                            <navigatorWithPlaceholder :content="tip?tip + '￥':''" placeholder="加tip加快接单速度" @click.native="addTip"></navigatorWithPlaceholder>
                        </view>
                    </view>
                </view>
                
                
            </view>
            
        </view>
        
        <timePicker v-if="showTimePicker" class="selectorComponent" @exit="completeRetriveTime"></timePicker>
        <itemInfoSelector v-else-if="showItemInfoSelector" class="selectorComponent" :value="itemInfo" @exit="completeItemInfo"></itemInfoSelector>
        <seperateTextarea v-else-if="showNoteInput" class="selectorComponent" @exit="completeNote"></seperateTextarea>
        <tipSelector v-else-if="showTipSelector" class="selectorComponent" @exit="completeTip"></tipSelector>

        <orderNav class="orderNav" :costItems="[{
            title: '基础费用',
            cost: getBasicCost(),
        },
        {
            title: '小费',
            cost: tip?tip:0,
        }]"></orderNav>
        
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
    import tipSelector from '@/components/tipSelector/tipSelector.vue';
    
    import { color }from '@/common/globalData.js';
    import shareData from './../shareData.js';
    import { QQ_MAP_KEY} from '@/common/sensitiveData.js';
    let page;
    let mapContext;
    
	export default {
        components: {
            addressCard, navigatorWithPlaceholder, statusBar, backgroundIcon, orderNav,
            timePicker, itemInfoSelector, seperateTextarea, tipSelector
        },
		data() {
			return {
				mapMarkers: null,
                QQ_MAP_KEY: null,
                shareData: null,
                
                retriveTime: null,
                retriveTimeString: '',
                itemInfo: '',
                note: '',
                
                coupon: null,
                tip: null,
                
                showTimePicker: false,
                showItemInfoSelector: false,
                showNoteInput: false,
                showTipSelector: false,
                
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
            
			chooseRetriveTime: function() {
                page.showTimePicker = true;
            },
            
            chooseItemInfo: function() {
                page.showItemInfoSelector = true;
            },
            
            addNote: function() {
                console.log('3')
                page.showNoteInput = true;
            },
            
            addTip: function() {
                console.log('4')
                page.showTipSelector = true;
            },
            
            completeRetriveTime: function(e) {
                page.showTimePicker = false;
                if (e.valid) {
                    page.retriveTime = e.value;
                    const date = new Date(e.value);
             
 
                    if (date - (new Date()) > 0) {
                        const hour = date.getHours()<10?'0'+date.getHours():date.getHours();
                        const minute = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
                        page.retriveTimeString = date.getMonth() + '月' + date.getDate() + '日' + ' ' + hour + ':' + minute;
                    } else {
                        page.retriveTimeString = '马上取件';
                    }
                    console.log(page.retriveTimeString)
                }
            },
            
            completeItemInfo: function(e) {
                page.showItemInfoSelector = false;
                if (e.valid) {
                    page.itemInfo = e.value;
                    page.itemInfo = e.value.type + '、' + e.value.value + '、' + e.value.weight;
                }
            },
            
            completeNote: function(e) {
                page.showNoteInput = false;
                if (e.valid) {
                    page.note = e.value;
                }
            },
            
            completeTip: function(e) {
                page.showTipSelector = false;
                if (e.valid) {
                    page.tip = e.value;
                    console.log(e);
                    console.log(page.tip)
                }
            },
            
            getBasicCost: function() {
                return 2;
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
                    longitude: shareData.address[1].location.longitude,
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
