<template>
	<view class="root">
        <view class="component">
            <slot />
        </view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style>
    
    .component {
        width: 750rpx;
        height: calc(1.2 * var(--height-statusbar));
        background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.15) 60%, transparent);
    }
    
</style>
