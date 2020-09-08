<template>
	<view class="root page">
        <uni-nav-bar class="navigationBar" @clickLeft="navigateBack"></uni-nav-bar>
        <topTabBar class="topTabBar" :tabs="tabs" size="35rpx" @switchTab="switchTab"></topTabBar>
		<map id="map" class="map" :longitude="defaultLocation.longitude" :latitude="defaultLocation.latitude" scale="15" :subkey="QQ_MAP_KEY" @regionchange="regionchange">
            <image src="../../../static/image/icon/location.png" class="mapIcon" :class="{'hoverMapIcon': mapIconHover, bounce: false}"></image>
            <view class="mapIconShadow" :class="{'hoverIconShadow': mapIconHover}"></view>
        </map>
        
        <view class="aboveMap">
            <view class="locateIconContainer shadow" @click="locate">
                <image class="locateIcon" src="@/static/image/icon/locate.png"></image>
            </view>
            <addressCard></addressCard>
        </view>
    </view>
</template>

<script>
    import topTabBar from "@/components/topTabBar/topTabBar.vue";
    import addressCard from './../components/addressCard.vue';
    import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
    import orderCard from './../components/orderCard.vue';
    
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
            topTabBar, addressCard, uniNavBar, orderCard
        },
		methods: {
            regionchange: async function(e) {
                if (e.type == 'begin') {
                    page.mapIconHover = true;
                    page.iconBounce = false;
                } else {
                    page.mapIconHover = false;
                    page.iconBounce = true;
                    shareData.addressCardLock = true;
                    let res = await promisify(mapContext.getCenterLocation, null, mapContext);
                    await shareData.setCurrentLocation(res.longitude, res.latitude, false);
                    shareData.addressCardLock = false;
                }
            },
            switchTab: function(e) {
                console.log(e)
                shareData.setServiceType(e.index);
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
            },
            
            navigateBack: function() {
                uni.navigateBack()
            }
		},
        created: function(e) {
            page = this;
            page.QQ_MAP_KEY = QQ_MAP_KEY;
            page.shareData = shareData;
            mapContext = uni.createMapContext('map', page);
            shareData.setMapContext(mapContext);
            page.colorMain = color.MAIN;
            page.defaultLocation = defaultLocation;
            
        },
        
        beforeMount: async function(e) {
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
                        index: serviceType.OTHER_SERVICE,
                        text: '其他跑腿',
                    },
                ],
                shareData: null,
                QQ_MAP_KEY: null,
                colorMain: null,
                defaultLocation: null,
                lock: false,
                mapIconHover: false,
                iconBounce: false,
            }
        },
	}
</script>

<style scoped>

    .map {
        position: fixed;
        top: -15vh;
        left: 0;
        width: 750rpx;
        height: 115vh;
        z-index: 0;
    }
    
    .bounce {
        animation: bounce .3s;
    }
    
    .mapIcon {
        width: 70rpx;
        height: 70rpx;
        
        position: fixed;
        left: 340rpx;
        bottom: 55vh;
        margin: auto;
        z-index: 1;
        
        
    }
    
    .hoverMapIcon {
        bottom: 57vh;
    }
    
    .mapIconShadow {
        position: fixed;
        left: 360rpx;
        bottom: calc(55vh - 25rpx);
        
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
