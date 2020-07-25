<template>
	<view class="page">
        <topTabBar class="topTabBar" :tabs="tabs" v-model="shareData.serviceType"></topTabBar>
		<map id="map" class="map" longitude="113" latitude="39" scale="15" :subkey="QQ_MAP_KEY" @touchend="mapMove">
            <image src="../../../static/image/icon/location.png" class="mapLocationIcon" mode=""></image>
        </map>
        
        <view class="aboveMap">
            <view class="locateIconContainer shadow" @click="locate">
            ffrgrgf
                <image class="locateIcon" src="@/static/image/icon/locate.png"></image>
            </view>
            <addressCard class="locationCard" :single="addressCardStyle[shareData.serviceType].single" :static="addressCardStyle[shareData.serviceType].static" :address1="shareData.address[0]" :address2="shareData.address[1]" @address1Click="addressCardClick({list:false, index:1})" @address2Click="addressCardClick({list:false, index:2})" @list1Click="addressCardClick({list:true, index:1})" @list2Click="addressCardClick({list:true, index:2})"></addressCard>
        </view>
	</view>
</template>

<script>
    import topTabBar from "@/components/topTabBar/topTabBar.vue";
    import addressCard from "@/components/addressCard/addressCard.vue";
    
    import { QQ_MAP_KEY } from "@/common/sensitiveData.js";
    import shareData from "./../shareData.js";
    import { serviceType } from "@/common/globalData.js";
    
    import Location from '@/common/classes/Location.js';
    import Address from '@/common/classes/Address.js'
    
    const app = getApp();
    let page;

    let mapContext;
    
	export default {
        name: 'newOrderPage',
        components: {
            topTabBar, addressCard
        },
		methods: {
            
			mapMove: async function() {
                let res = await app.promisify(mapContext.getCenterLocation, null, mapContext);
                // console.log(res);
                shareData.setCurrentLocation(res.longitude, res.latitude);
            },
            
            locate: async function() {
                let res;
                try {
                    res = await uni.getLocation();
                } catch(e) {
                    console.log(e)
                    uni.showToast({
                        title: '定位失败，请手动定位',
                        icon: 'none'
                    });
                    return;
                };
                shareData.setCurrentLocation(res[1].longitude, res[1].latitude);
            },
            
            addressCardClick: function(msg) {
                console.log(msg);
                
                if (msg.list) {
                    console.log('list');
                    uni.navigateTo({
                        url: './addressBook/addressBook',
                    })
                } else {
                    uni.navigateTo({
                        url: './addressForm/addressForm',
                        fail: e => {
                            console.log(e)
                        }
                    })
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
                        static: {
                            from: {
                                color: 'green',
                                text: '取',
                                placeholder: '请选择取件地址'
                            },
                            to: {
                                color: 'red',
                                text: '送',
                                placeholder: '请选择送件地址'
                            }
                        }
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
            }
        },
	}
</script>

<style scoped>
    
    .page {
        position: fixed;
        top: 0;
        left: 0;

        height: 92vh;
    }
    
    .map {
        position: absolute;
        top: -20vh;
        left: 0;
        width: 100vw;
        height: 120vh;
        z-index: 0;
    }
    
    .mapLocationIcon {
        width: 10vw;
        height: 10vw;
        
        position: absolute;
        left: 45vw;
        bottom: 60vh;
        margin: auto;
        z-index: 1;
    }
    
    .topTabBar {
        z-index: 1;
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        background-color: var(--color-main);
        color: white;
    }
    
    .aboveMap {
        z-index: 1;
        width: 100%;
        
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        
        position: absolute;
        left: 0;
        bottom: 0vh;
        
    }
    
    .locateIconContainer {
        margin-left: 5vw;
        
        background-color: white;
        border-radius: 20%;
        width: 8vw;
        height: 8vw;
    }
 
    .locateIcon {
        width: 8vw;
        height: 8vw;
    }
    
    .locationCard {
        z-index: 1;
        font-size: 1em;
        align-self: center;
        margin-top: 2vw;
        margin-bottom: 3vw;
    }
    
</style>
