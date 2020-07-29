<template>
	<view class="root">
        <view class="page">
            <status-bar class="statusBar"></status-bar>
            
            <map id="map" class="map" longitude="113" latitude="39" scale="15" :subkey="QQ_MAP_KEY" :markers="mapMarkers"></map>
            
            
<!--            <view class="blankForMap"></view> -->
            <view class="detailForm">
                <addressCard></addressCard>
                <view class="form card">
                    <view class="formItem">
                        <view class="formItemTitle">取件时间</view>
                        <view class="formItemRight">
                            <navigatorWithPlaceholder :content="retriveTime" placeholder="选择取件时间" @click="chooseRetriveTime"></navigatorWithPlaceholder>
                        </view>
                    </view>
                    <view class="formItem">
                        <view class="formItemTitle">物品信息</view>
                        <view class="formItemRight">
                            <navigatorWithPlaceholder :content="itemInfo" placeholder="物品类型、价值、重量" @click="chooseItemInfo"></navigatorWithPlaceholder>
                        </view>
                    </view>
                    <view class="formItem">
                        <view class="formItemTitle">备注</view>
                        <view class="formItemRight">
                            <navigatorWithPlaceholder :content="note" placeholder="送件要求、物品描述等" @click="addNote"></navigatorWithPlaceholder>
                        </view>
                    </view>
                    <view class="formItem">
                        <view class="formItemTitle">敏感信息</view>
                        <view class="formItemRight">
                            <navigatorWithPlaceholder :content="sensitiveInfo" placeholder="如快递取件码等" @click="addSensitiveInfo"></navigatorWithPlaceholder>
                        </view>
                    </view>
                </view>
                
                <view class="form card">
                    <view class="formItem">
                        <view class="formItemTitle">优惠券</view>
                        <view class="formItemRight">
                            <navigatorWithPlaceholder :value="coupon" placeholder="选择优惠券" @click="chooseCoupon"></navigatorWithPlaceholder>
                        </view>
                    </view>
                    <view class="formItem">
                        <view class="formItemTitle">小费</view>
                        <view class="formItemRight">
                            <navigatorWithPlaceholder :value="tip" appendix="￥" placeholder="加tip加快接单速度" @click="addTip"></navigatorWithPlaceholder>
                        </view>
                    </view>
                </view>
            </view>
            
        </view>
        
	</view>
</template>

<script>
    import addressCard from './../components/addressCard.vue';
    import statusBar from '@/components/uni-status-bar/uni-status-bar.vue';
    import navigatorWithPlaceholder from '@/components/navigatorWithPlaceholder/navigatorWithPlaceholder.vue';
    
    import shareData from './../shareData.js';
    import { QQ_MAP_KEY} from '@/common/sensitiveData.js';
    let page;
    let mapContext;
    
	export default {
        components: {
            addressCard, navigatorWithPlaceholder, statusBar
        },
		data() {
			return {
				mapMarkers: null,
                QQ_MAP_KEY: null,
                shareData: null,
                
                retriveTime: null,
                itemInfo: '',
                note: '',
                sensitiveInfo: '',
                
                coupon: null,
                tip: null,
			}
		},
		methods: {
			chooseRetriveTime: function() {
                console.log('aaa')
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
                padding: [80, 30, 100, 30],
                success: res => {
                    console.log(res);
                },
                fail: e => {
                    console.log(e);
                }
            });
        }
	}
</script>

<style>
    
   @import url("./detailForms.css");
   
</style>
