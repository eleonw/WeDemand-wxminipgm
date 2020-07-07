<template>
	<view>
        <view v-if="selectedTabIndex==0">
            <include src="../subpages/page1.html"></include>
            page of index 0
            <map id="map" longitude="116.34694203128674" latitude="39.980988001848075" scale="15" subkey="PQGBZ-DGOKX-2GC4U-T66D3-ZKKHQ-F5BXH" show-location="true" @regionchange="regionChange" @updated="mapUpdated"></map>
        </view>
        
        
        
        <view v-if="selectedTabIndex==1">
            page of index 1
        </view>
        
        
        
        <view v-if="selectedTabIndex==2">
            page of index 2
        </view>
        
		<tabBar :tabItems="tabItems" v-model="selectedTabIndex" @tabchange="tabChange"></tabBar>
	</view>
</template>

<script>
    import tabBar from "@/components/tabBar/tabBar.vue"

    const QQMapWX = require('@/libs/qqmap-wx-jssdk.js');
    let qqmapsdk;
    let mapContext;
    let page;
    
    const app = getApp();
    
	export default {

        components: {
            tabBar, 
        },
		data() {
			return {
                location: 
                    {
                        latitude: "39.980988001848075",
                        longitude: "116.34694203128674",
                    },
                selectedTabIndex: 0,
				tabItems: [
                    {
                        index: 0,
                        text: '首页',
                        iconPath: '/static/image/icon/home.png',
                        selectedIconPath: '/static/image/icon/home_sel.png'
                    },
                    {
                        index: 1,
                        text: '订单',
                        iconPath: '/static/image/icon/order.png',
                        selectedIconPath: '/static/image/icon/order_sel.png'
                    },
                    {
                        index: 2,
                        text: '我的',
                        iconPath: '/static/image/icon/me.png',
                        selectedIconPath: '/static/image/icon/me_sel.png'
                    }
                ]
			}
		},
        methods: {
            tabChange(e) {
                if (e.index == 0) {
                    page.setCurrentLocation();
                }
            },
            setCurrentLocation() {
                uni.getLocation({type: 'gcj02'}).then(res => {
                    console.log('getLocation');
                    page.location.longitude = res[1].longitude;
                    page.location.latitude = res[1].latitude;

                    console.log(page.location)
                    console.log(res)
                }).then(() => {
                    mapContext.moveToLocation({
                        longitude: page.location.longitude,
                        latitude: page.location.latitude
                    });
                }).catch(e => {
                    uni.showToast({
                        title: '定位失败，请手动定位',
                        icon: 'none',
                    })
                }) 
            },
            mapUpdated: function() {
                console.log(page.location);
            },
            regionChange: function() {
                app.promisify(mapContext.getCenterLocation).then(e => {
                    console.log(e)
                    page.location.longitude = e.longitude;
                    page.location.latitude = e.latitude;
                    // page.location = {
                    //     longtitude: e.longtitude,
                    //     latitude: e.latitude
                    // } 这样子不行，记得做笔记 page.location会变成__ob__ observer
                    // 其实是可以的！
                })
            }
        },
        onLoad: function(msg) {
            
            page = this;
            qqmapsdk = new QQMapWX({
                        key: 'PQGBZ-DGOKX-2GC4U-T66D3-ZKKHQ-F5BXH'
                    });
            mapContext = wx.createMapContext('map', page);
        },
        onShow: function() {
            page.setCurrentLocation();
        }
	}
</script>

<style>
    
    map {
        position: absolute;
        z-index: 998;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }
</style>
