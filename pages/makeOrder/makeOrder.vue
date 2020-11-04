<template>
	<view class="root">

        
        <view v-if="selectedTabIndex==0">
            <newOrderPage></newOrderPage>
        </view>
        
        <view v-else>
            <myOrderPage></myOrderPage>
        </view>
        
       
        
        
		<tabBar class="tabBar" :tabs="mainTabs" v-model="selectedTabIndex" @tabchange="tabChange"></tabBar>
 
	</view>
</template>

<script>
    import tabBar from "@/components/tabBar/tabBar.vue";
    import topTabBar from "@/components/topTabBar/topTabBar.vue";
    
    import newOrderPage from "./subpages/newOrderPage.vue";
    import myOrderPage from "./subpages/myOrderPage.vue";
    
    import shareData from "./shareData.js";
    import eventBus from "./eventBus.js";
    
    let page;
    let enablePullDownRefresh;
    
	export default {

        components: {
            tabBar, topTabBar, 
            newOrderPage, myOrderPage
        },
		data() {
			return {
        selectedTabIndex: 1,
				mainTabs: [
                    {
                        index: 0,
                        text: '新的订单',
                        iconPath: '/static/image/icon/home.png',
                        selectedIconPath: '/static/image/icon/home_sel.png'
                    },
                    {
                        index: 1,
                        text: '我的订单',
                        iconPath: '/static/image/icon/me.png',
                        selectedIconPath: '/static/image/icon/me_sel.png'
                    }
                ],
                
			}
		},
        methods: {
            tabChange(e) {
                if (e.index == 0) {
                    eventBus.$off('startPullDownRefresh');
                    page.setCurrentLocation();
                } else {
                    eventBus.$on('startPullDownRefresh', function() {
                        uni.startPullDownRefresh()
                    });
                }
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
            },
            enablePullDownRefresh: function(status) {
                if (status) {
                    enablePullDownRefresh = true;
                    eventBus.$on('startPullDownRefresh', () => {
                        uni.startPullDownRefresh();
                    });
                    eventBus.$on('stopPullDownRefresh', () => {
                        uni.stopPullDownRefresh();
                    });
                } else {
                    enablePullDownRefresh = false;
                    eventBus.$off('startPullDownRefresh');
                    eventBus.$off('stopPullDownRefresh');
                }
            }
        },
        
        beforeCreate: function() {
            page = this;
            shareData.getAddressBook();
        },
        
        beforeMount: function() {
            if (page.selectedTabIndex == 1) {
                page.enablePullDownRefresh(true);
            } else {
                page.enablePullDownRefresh(false);
            }
        },
        
        beforeDestroy: function() {
            page.enablePullDownRefresh(false);
        },
        
        onReachBottom: function() {
            console.log('reach bottom')
            eventBus.$emit('reachBottom');
        },
        
        onPullDownRefresh: function() {
            if (enablePullDownRefresh) {
                eventBus.$emit('pullDownRefresh');
            }
        }
	}
</script>

<style>

</style>
