<template>
	<view class="root page">

        <statusBar class="statusBar"></statusBar>
        
		<map id="map" class="map" longitude="113" latitude="39" scale="15" :subkey="QQ_MAP_KEY" :markers="mapMarkers"></map>
        <backgroundIcon type="back" size="25" shadow="true" class="backNavigator" @click="back"></backgroundIcon>
        <view class="detailForm">
            
            <view class="form card">
                <addressCard></addressCard>
                <view class="formItem lastFormItem">
                    <view class="formItemTitle">送货时间</view>
                    <view class="formItemRight">
                        <navigatorWithPlaceholder :content="deliverTimeString" placeholder="选择送达时间" @click.native="chooseDeliverTime"></navigatorWithPlaceholder>
                    </view>
                </view>
            </view>
            
            
            <view class="form card">
                <view class="formItem textareaSet">
                    <view class="textareaTitle">填写想购买的商品</view>
                    <textarea class="textareaBody" placeholder="填写代买商品的要求描述,如品牌、种类、数量等" maxlength="250" ></textarea>
                    <view class="textareaKeyWords">
                        <view class="textareaKeyWord" v-for="(keyWord,index) in textareaKeyWords" @click="addKeyWord(keyWord)">{{ keyWord }}</view>
                    </view>
                </view>
                
            </view>
            
           
            
            <view class="form card">
                <view class="formItem">
                    <view class="formItemTitle">购买地址</view>
                    <view class="formItemRight formItemBlock" id="buyingLocationBlock">
                        <radio-group @change="buyingLocationTypeChange">
                            <label>
                                <radio :value="0" :color="colorMain" :checked="buyingLocationType==0"/><text>就近购买</text>
                                <radio :value="1" :color="colorMain" :checked="buyingLocationType==1"/><text>指定地址</text>
                            </label>
                        </radio-group>
                        <view v-if="buyingLocationType == 1">
                            <navigatorWithPlaceholder placeholder="请选择购买地址" @click.native="chooseBuyingLocation"></navigatorWithPlaceholder>
                        </view>
                    </view>
                </view>
                <view class="formItem lastFormItem">
                    <view class="formItemTitle">预估价格</view>
                    <view class="formItemRight">
                        <navigatorWithPlaceholder></navigatorWithPlaceholder>
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
                <view class="formItem lastFormItem">
                    <view class="formItemTitle">小费</view>
                    <view class="formItemRight">
                        <navigatorWithPlaceholder :content="tip?tip + '￥':''" placeholder="加tip加快接单速度" @click.native="addTip"></navigatorWithPlaceholder>
                    </view>
                </view>
            </view>
            
            
            
        </view>
        
        <timePicker v-if="showTimePicker" class="selectorComponent" @exit="completeDeliverTime"></timePicker>
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
    import tipSelector from '@/components/tipSelector/tipSelector.vue';
    
    import { color }from '@/common/globalData.js';
    import shareData from './../shareData.js';
    import { QQ_MAP_KEY} from '@/common/sensitiveData.js';
    
    let page;
    
	export default {
        components: {
             addressCard, navigatorWithPlaceholder, statusBar, backgroundIcon, orderNav,
             timePicker, tipSelector
        },
        
		data() {
			return {
				colorMain: null,
                buyingLocationType: 0,
                
                deliverTime: null,
                deliverTimeString: '',
                tip: null,
                
                showTimePicker: false,
                showTipSelector: false,
                
			}
		},
        
        onLoad: function() {
            page = this;
            page.colorMain = color.MAIN;
        },
        
		methods: {
			buyingLocationTypeChange: function(e) {
                page.buyingLocationType = e.detail.value;
            },
            
            chooseBuyingLocation: function() {
                uni.chooseLocation({
                    complete: e => console.log(e)
                })
            },
            
            chooseDeliverTime: function() {
                page.showTimePicker = true;
            },
            
            addTip: function() {
                page.showTipSelector = true;
            },
            
            completeDeliverTime: function(e) {
                page.showTimePicker = false;
                if (e.valid) {
                    page.deliverTime = e.value;
                    const date = new Date(e.value);
                }
            },
            
            completeTip: function(e) {
                page.showTipSelector = false;
                if (e.valid) {
                    page.tip = e.value;
                }
            },
            
            getBasicCost: function() {
                return 2;
            }
		}
	}
</script>

<style>
    @import url("./detailForms.css");
    
    #buyingLocationBlock {
        align-items: flex-end;
    }
    
    #buyingLocationBlock view {
        margin: 5rpx 0;
    }
    
</style>
