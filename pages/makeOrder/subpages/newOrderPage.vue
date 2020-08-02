<template>
	<view class="root">
    <view class="page">
        <uni-nav-bar class="navigationBar" @clickLeft="uni.navigateBack()"></uni-nav-bar>
        <topTabBar class="topTabBar" :tabs="tabs" size="35rpx" @switchTab="switchTab"></topTabBar>
		<map id="map" class="map" :longitude="defaultLocation.longitude" :latitude="defaultLocation.latitude" scale="15" :subkey="QQ_MAP_KEY" @touchstart="mapTouchStart" @touchend="mapTouchEnd">
            <image src="../../../static/image/icon/location.png" class="mapIcon" :class="{'hoverMapIcon': mapIconHover}"></image>
            <view class="mapIconShadow" :class="{'hoverIconShadow': mapIconHover}"></view>
        </map>
        
        <view class="aboveMap">
            <view class="locateIconContainer shadow" @click="locate">
                <image class="locateIcon" src="@/static/image/icon/locate.png"></image>
            </view>
            <addressCard></addressCard>
        </view>
	</view>
    </view>
</template>

<script>
    import topTabBar from "@/components/topTabBar/topTabBar.vue";
    import addressCard from './../components/addressCard.vue';
    import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
    
    import { QQ_MAP_KEY } from "@/common/sensitiveData.js";
    import shareData from "./../shareData.js";
    import { serviceType, color, defaultLocation } from "@/common/globalData.js";
    
    import Location from '@/common/classes/Location.js';
    import Address from '@/common/classes/Address.js';
    
    import { promisify } from '@/common/helper.js';
    
    const app = getApp();
    let page;

    let mapContext;
    
	export default {
        name: 'newOrderPage',
        components: {
            topTabBar, addressCard, uniNavBar
        },
		methods: {
            switchTab: function(e) {
                console.log(e)
                shareData.setServiceType(e.index);
            },
            
            mapTouchStart: function() {
                console.log('touch begin')
                page.mapIconHover = true;
            },
            
			mapTouchEnd: async function() {
                page.mapIconHover = false;
                shareData.addressCardLock = true;
                let res = await promisify(mapContext.getCenterLocation, null, mapContext);
                await shareData.setCurrentLocation(res.longitude, res.latitude);
                shareData.addressCardLock = false;
            },
            
            locate: async function() {
                try {
                    const res = await uni.getLocation();
                    shareData.setCurrentLocation(res[1].longitude, res[1].latitude);
                } catch(e) {
                    console.log(e)
                    uni.showToast({
                        title: '定位失败，请手动定位',
                        icon: 'none',
                        success: function() {
                            setTimeout(function() {
                                shareData.setCurrentLocation(defaultLocation.longitude, defaultLocation.latitude);
                            }, 1000)
                            
                        }
                    });
                    
                }
                
            },
            
            
            clearShareData: function() {
                shareData.clear();
                page.locate();
            }
		},
        created: function(e) {
            page = this;
            page.QQ_MAP_KEY = QQ_MAP_KEY;
            page.shareData = shareData;
            mapContext = uni.createMapContext('map', page);
            shareData.setMapContext(mapContext);
            page.color = color;
            page.defaultLocation = defaultLocation;
        },
        
        beforeMount: async function(e) {
            console.log('mount')
            page.clearShareData();
        },
        
        data() {
        	return {
                longitude: 113,
                latitude: 40,
        		tabIndex: 0,
                tabs: [
                    {
                        index: serviceType.HELP_DELIVER,
                        text: '校园取送',
                    },
                    {
                        index: serviceType.HELP_BUY,
                        text: '校园帮买',
                    },
                    {
                        index: serviceType.OTHERS,
                        text: '其他跑腿',
                    },
                ],
                addressCardStyle: {
                    [serviceType.HELP_DELIVER]: {
                        single: false,
                        static: [
                            {
                                color: 'green',
                                text: '取',
                                placeholder: '请选择取件地址'
                            },
                            {
                                color: 'red',
                                text: '送',
                                placeholder: '请选择送件地址'
                            }
                        ],
                    },
                    [serviceType.HELP_BUY]: {
                        single: true,
                        static: {
                            from: {
                                color: 'red',
                                text: '送',
                                placeholder: '请选择派送地址'
                            }
                        }
                    },
                    [serviceType.OTHERS]: {
                        single: true,
                        static: {
                            from: {
                                color: 'red',
                                text: '至',
                                placeholder: '请选择服务地址'
                            }
                        }
                    },
                },
                shareData: null,
                QQ_MAP_KEY: null,
                color: null,
                defaultLocation: null,
                lock: false,
                mapIconHover: false,
            }
        },
	}
</script>

<style scoped>
    
   .page {
        position: fixed;
        top: 0;
        left: 0;
    }

    .map {
        position: absolute;
        top: -15vh;
        left: 0;
        width: 100vw;
        height: 120vh;
        z-index: 0;
    }
    
    .mapIcon {
        width: 70rpx;
        height: 70rpx;
        
        position: absolute;
        left: 340rpx;
        bottom: 60vh;
        margin: auto;
        z-index: 1;
    }
    
    .hoverMapIcon {
        bottom: 62vh;
    }
    
    .mapIconShadow {
        position: absolute;
        left: 360rpx;
        top: calc(60vh - 10rpx);
        
        width: 25rpx;
        height: 25rpx;
        border-radius: 50%;
        
        background-color: rgba(0, 0, 0, 0.3);
        transform: scaleY(0.2);
        box-shadow: 0 0 10rpx 10rpx rgba(0, 0, 0, 0.3);
    }
    
    .hoverIconShadow {
        transform: scaleY(0.1) scaleX(0.5);
    }
    
    .topTabBar {
        z-index: 1;
        position: absolute;
        top: var(--height-navbar);
        left: 0;
        width: 100vw;
        background-color: var(--color-main);
        color: white;
    }
    
    .aboveMap {
        z-index: 1;
        width: 700rpx;
        
        margin-top: auto;
        margin-bottom: calc(var(--height-tabbar) + 20rpx);
       
        
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
    }
    
    .locateIconContainer {
        background-color: white;
        border-radius: 20%;
        width: 60rpx;
        height:60rpx;
        
        margin-bottom: 10rpx;
    }
 
    .locateIcon {
        width: 60rpx;
        height: 60rpx;
    }
    
    
</style>
