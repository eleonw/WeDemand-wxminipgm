<template>
	<view>
		<map id="map" class="map" longitude="113" latitude="39" scale="15" :subkey="QQ_MAP_KEY" :markers="mapMarkers">
            
		</map>
	</view>
</template>

<script>
    import shareData from './../shareData.js';
    import { QQ_MAP_KEY} from '@/common/sensitiveData.js';
    let page;
    let mapContext;
    
	export default {
		data() {
			return {
				mapMarkers: null,
                QQ_MAP_KEY: null,
			}
		},
		methods: {
			
		},
        onLoad: function() {
            page = this;
            page.QQ_MAP_KEY = QQ_MAP_KEY;
            mapContext = uni.createMapContext('map', page);
        },
        
        onShow: function() {
            
            page.mapMarkers = [
                {
                    id: 0,
                    latitude: shareData.address[0].location.latitude,
                    longitude: shareData.address[1].location.longitude,
                    iconPath: '/static/image/icon/retrive.png',
                    width: 20,
                    height: 20, 
                }, 
                {
                    id: 1,
                    latitude: shareData.address[1].location.latitude,
                    longitude: shareData.address[1].location.longitude,
                    iconPath: '/static/image/icon/deliver.png',
                    width: 20,
                    height: 20,
                }
            ];
            
            mapContext.includePoints({
                points: [
                    {
                        longitude: page.mapMarkers[0].longitude,
                        latitude: page.mapMarkers[0].latitdue,
                    },
                    {
                        longitude: page.mapMarkers[1].longitude,
                        latitude: page.mapMarkers[1].latitude,
                    }
                ],
                padding: [10, 10, 30, 10],
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

</style>
