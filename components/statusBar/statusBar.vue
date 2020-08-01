<template>
    <view class="root">
	<view class="component" :class="[gradient?'componentGradient':'component']">
		<slot />
	</view>
    </view>
</template>

<script>
	// var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px'
	export default {
		name: 'statusBar',
        props: {
            gradient: {
                type: Boolean,
                defualt: false,
                required: false
            }
        },
		data() {
			return {
				// statusBarHeight: statusBarHeight
			}
		}
	}
</script>

<style>
	.component {
		width: 750rpx;
/* 		height: 20px; */
		height: var(--height-statusbar);
        background-color: rgba(0, 0, 0, 0.15);
	}
    
    .componentGradient {
        width: 750rpx;
        height: calc(var(--height-statusbar) * 1.2);
        background: linear-gradient(rgba(0, 0, 0, 1), transparent);
    }
</style>