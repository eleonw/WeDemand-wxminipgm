<template>
	<view class="page">
        <topTabBar class="topTabBar" :tabs="tabs" v-model="tabIndex"></topTabBar>
		<map id="map" class="map" longitude="113" latitude="39" scale="15" subkey="PQGBZ-DGOKX-2GC4U-T66D3-ZKKHQ-F5BXH" @touchend="mapMove">
            <image src="../../../static/image/icon/location.png" class="mapLocationIcon" mode=""></image>
        </map>
        
        <view class="aboveMap">
            <view class="locateIconContainer shadow" @click="locate">
                <image class="locateIcon" src="@/static/image/icon/locate.png"></image>
            </view>
            <addressCard class="locationCard" :single="addressCardStyle[tabIndex].single" :static="addressCardStyle[tabIndex].static" :address1="address1" :address2="address2" @address1Click="addressCardClick({list:false, index:1})" @address2Click="addressCardClick({list:false, index:2})" @list1Click="addressCardClick({list:true, index:1})" @list2Click="addressCardClick({list:true, index:2})"></addressCard>
        </view>
        </movable-area>
	</view>
</template>

<script>
    import topTabBar from "@/components/topTabBar/topTabBar.vue";
    import addressCard from "@/components/addressCard/addressCard.vue";
    
    import addressBus from "@/common/bus/addressBus.js";
    
    import Location from '@/common/classes/Location.js';
    import Address from '@/common/classes/Address.js'
    
    const app = getApp();
    let page;

    let mapContext;
    let mapLocation;
    
	export default {
        name: 'newOrderPage',
        components: {
            topTabBar, addressCard
        },
		methods: {
            
			mapMove: async function() {
                let res = await app.promisify(mapContext.getCenterLocation, null, mapContext);
                // console.log(res);
                page.setMapLocation(res.longitude, res.latitude);
            },
            
            setMapLocation: async function(longitude, latitude) {
                mapContext.moveToLocation({
                    longitude: longitude,
                    latitude: latitude
                });
                mapLocation.longitude = longitude;
                mapLocation.latitude = latitude;
                mapLocation.reverseGeocoder();
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
                mapContext.moveToLocation({
                    longitude: res[1].longitude,
                    latitude: res[1].latitude,
                });
                page.setMapLocation(res[1].longitude, res[1].latitude);
            },
            
            addressCardClick: function(msg) {
                console.log(msg);
                
                addressBus.$on('sendAddress', res => {
                    console.log('receive sendAddress')
                    console.log(res);
                    if (res.formCompleted) {
                        page['address' + msg.index] = res.address;
                        page['address' + msg.index + 'Completed'] = true;
                    }
                    addressBus.$off('sendAddress');
                })
                
                if (msg.list) {
                    console.log('list');
                    uni.navigateTo({
                        url: './addressBook/addressBook',
                    })
                } else {
                    console.log('not list')
                    let title;
                    let location = 'null'
                    
                    if (msg.index == 1) {
                        location = JSON.stringify(page.address1.location);
                    }

                    switch (page.tabIndex) {
                        case 0:
                            title = msg.index==1?'发件地址':'送件地址';
                            break;
                        case 1:
                            title = msg.index==1?'取件地址':'派件地址';
                            break;
                        case 2:
                            title = '派送地址';
                            break;
                        case 3:
                            title = "服务地址";
                            break;
                         default:
                            null;
                    }
                    uni.navigateTo({
                        url: './addressForm/addressForm?title=' + title + '&location=' + location,
                        fail: e => {
                            console.log(e)
                        }
                    })
                }
                
                
            },
            
		},
        created: function(e) {
            page = this;
            mapContext = uni.createMapContext('map', page);
        },
        
        beforeMount: async function(e) {
    
            page.address1Completed = false;
            page.address2Completed = false;
            page.address1 = new Address();
            page.address2 = new Address();
            mapLocation = page.address1.location;
            
            page.locate();
        },
        
        data() {
        	return {
                longitude: 113,
                latitude: 40,
        		tabIndex: 0,
                tabs: [
                    {
                        index: 0,
                        text: '帮我送'
                    },
                    {
                        index: 1,
                        text: '帮我取',
                    },
                    {
                        index: 2,
                        text: '帮我买'
                    },
                    {
                        index: 3.,
                        text: '其他跑腿'
                    }
                ],
                addressCardStyle: [
                    {
                        single: false,
                        static: {
                            from: {
                                color: 'green',
                                text: '收',
                                placeholder: '请选择收件地址'
                            },
                            to: {
                                color: 'red',
                                text: '送',
                                placeholder: '请选择送件地址'
                            }
                        }
                        
                    },
                    {
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
                                placeholder: '请选择派送地址'
                            }
                        }
                        
                    },
                    {
                        single: true,
                        static: {
                            from: {
                                color: 'red',
                                text: '送',
                                placeholder: '请选择派送地址'
                            }
                        }
                    },
                    {
                        single: true,
                        static: {
                            from: {
                                color: 'red',
                                text: '至',
                                placeholder: '请选择服务地址'
                            }
                        }
                        
                    }
                ],
                address1: null,
                address2: null,
                address1Completed: false,
                address2Completed: false,
            }
        },
	}
</script>

<style scoped>
    
    .page {
        height: 92vh;
        
    }
    
    .map {
        position: absolute;
        top: -10vh;
        left: 0;
        width: 100vw;
        height: 110vh;
        z-index: 0;
    }
    
    .mapLocationIcon {
        width: 10vw;
        height: 10vw;
        
        position: absolute;
        left: 45vw;
        bottom: 55vh;
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
