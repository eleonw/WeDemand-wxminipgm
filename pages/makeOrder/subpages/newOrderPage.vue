<template>
	<view class="page">
        <topTabBar class="topTabBar" :tabs="tabs" v-model="tabIndex"></topTabBar>
		<map class="map" :longitude="address1.location.longitude" :latitude="address1.location.latitude" scale="15" subkey="PQGBZ-DGOKX-2GC4U-T66D3-ZKKHQ-F5BXH" @regionchange="regionChange">
            <image src="../../../static/image/icon/location.png" class="mapLocationIcon" mode=""></image>
        </map>
        
        <view class="aboveMap">
            <view class="locateIconContainer" @click="locate">
                <image class="locateIcon" src="@/static/image/icon/locate.png"></image>
            </view>
            <addressCard class="locationCard" :single="addressCardStyle[tabIndex].single" :static="addressCardStyle[tabIndex].static" :address1="address1" :address2="address2" @address1Click="addressCardClick('address1')" @address2Click="addressCardClick('address2')" @list1Click="addressCardClick('list1')" @list2Click="addressCardClick('list2')"></addressCard>
        </view>
        
	</view>
</template>

<script>
    import topTabBar from "@/components/topTabBar/topTabBar.vue";
    import addressCard from "@/components/addressCard/addressCard.vue";
    
    const app = getApp();
    let page;
    const QQMapWX = require('@/libs/qqmap-wx-jssdk.js');
    let qqmapsdk;
    let mapContext;
    
	export default {
        name: 'newOrderPage',
        components: {
            topTabBar, addressCard
        },
		data() {
			return {
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
                address1: {
                    location: {
                        address: '',
                        name: '',
                        longitude: 113,
                        latitude: 40,
                        extra: '',
                    },
                    name: '',
                    tel: '',
                },
                address2: {
                    location: {
                        address: '',
                        name: '',
                        longitude: 0,
                        latitude: 0,
                        extra: '',
                    },
                    name: '',
                    tel: '',
                }
			}
		},
		methods: {
			regionChange: function() {
                
            },
            locate: async function() {
                let newLocation = {};
                
                let res = await uni.getLocation();
                console.log(res);
                
                page.address1.location.longitude = res[1].longitude;
                page.address1.location.latitude = res[1].latitude;
                
                res = await new Promise((resolve, reject) => {
                    qqmapsdk.reverseGeocoder({
                        locatition: {
                            longitude: page.address1.location.longitude, 
                            latitude: page.address1.location.latitude,
                        },
                        success: (res, data) => resolve(data),
                        fail: err => reject(err),
                    })
                })
                
                page.address1.location.address = res.reverseGeocoderSimplify.city + res.reverseGeocoderSimplify.district + res.reverseGeocoderSimplify.street_number;
                page.address1.location.name =res.reverseGeocoderSimplify.recommend;
                
                console.log(page.address1);
                
                // page.address1.address = 
                // uni.getLocation().then(res => {
                //     newLocation = {
                //         longitude: res[1].longitude,
                //         latitude: res[1].latitude
                //     }
                    
                //     console.log(newLocation);
                //     console.log(qqmapsdk);
                    
                    
                //    qqmapsdk.reverseGeocoder({
                //         location: {
                //             longitude: newLocation.longitude,
                //             latitude: newLocation.latitude,
                //         },
                        
                //         success: res => {
                //             console.log(res)
                //         },
                //         fail: err => {
                //             console.log(err)
                //         },
                        
                //     })
  

                    
                    // console.log(res)
          
            },
            addressCardClick: function(msg) {
                console.log(msg);
            }
		},
        created: function(e) {
            page = this;
            qqmapsdk = new QQMapWX({
                key: "PQGBZ-DGOKX-2GC4U-T66D3-ZKKHQ-F5BXH"
            });
            mapContext = uni.createMapContext('map', this);
        },
        beforeMount: function(e) {
            page.locate();
        }
	}
</script>

<style scoped>
    
    .page {
        height: 92vh;
        justify-content: flex-end;
        align-items: center;
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
        top: 45vh;
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
        
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        
    }
    
    .locateIconContainer {
        background-color: white;
        border-radius: 20%;
        width: 8vw;
        height: 8vw;
        box-shadow: 0 0 .2em .1em #F8F8F8;
    }
 
    .locateIcon {
        width: 8vw;
        height: 8vw;
    }
    
    .locationCard {
        box-shadow: 0 0 .2em .1em #F8F8F8;
        z-index: 1;
        font-size: 1em;
        align-self: center;
        margin-top: 2vw;
        margin-bottom: 3vw;
    }
    
    
    
</style>
