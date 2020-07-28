<template>
	<view class="page">
        help buy
		<map id="map" class="map" longitude="113" latitude="39" scale="15" :subkey="QQ_MAP_KEY" @touchend="mapMove">
		    <image src="../../../static/image/icon/location.png" class="mapLocationIcon" mode=""></image>
		</map>
	</view>
</template>

<script>
    import { QQ_MAP_KEY } from '@/common/sensitiveData.js';
    
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
/*    @import url("./detailForms.css"); */
</style>
