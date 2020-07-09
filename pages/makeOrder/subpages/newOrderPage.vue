<template>
	<view class="page">
        <topTabBar class="topTabBar" :tabs="tabs"></topTabBar>
		<map class="map" longitude="116.34694203128674" latitude="39.980988001848075" scale="15" subkey="PQGBZ-DGOKX-2GC4U-T66D3-ZKKHQ-F5BXH" show-location="true" @regionchange="regionChange" @updated="mapUpdated"></map>
        <view class="aboveMap">
            <view class="locateIconContainer">
                <image class="locateIcon" src="@/static/image/icon/locate.png"></image>
            </view>
            <locationCard class="locationCard"></locationCard>
        </view>


	</view>
</template>

<script>
    import topTabBar from "@/components/topTabBar/topTabBar.vue";
    import locationCard from "@/components/locationCard/locationCard.vue";
    
	export default {
        name: 'newOrderPage',
        components: {
            topTabBar, locationCard
        },
		data() {
			return {
				selectedIndex: 0,
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
                ]
			}
		},
		methods: {
			
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
        top: -20vh;
        left: 0;
        width: 100vw;
        height: 120vh;
        z-index: 0;
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
