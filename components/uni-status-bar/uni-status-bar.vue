<template>
    <view class="root">
	<view class="uni-status-bar">
		<slot />
	</view>
    </view>
</template>

<script>
	export default {
		name: 'UniStatusBar',
		data() {
			return {
				
			}
		}
	}
</script>

<style scoped>
	.uni-status-bar {
		width: 750rpx;
		height: 20px;
		height: var(--height-statusbar);
        
        background-color: rgba(0, 0, 0, 0.15);
	}
</style>