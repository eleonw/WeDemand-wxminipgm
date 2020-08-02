<template>
    <view class="root">
	<view class="navBar" :class="[gradient==true?'gradient':'noGradient']">

	</view>
    </view>
</template>

<script>
	export default {
		name: 'statusBar',
        props: {
            gradient: {
            	type: [Boolean, String],
            	default: true
            },
        },
		data() {
			return {
				
			}
		},
	}
</script>

<style scoped>
    .navBar {
        width: 750rpx;
        height: 20px;
    }
    
	.noGradient {
        height: var(--height-statusbar);
		background-color: rgba(0, 0, 0, 0.15);
	}
    
    .gradient {
        height: calc(1.3 * var(--height-statusbar));
        background: linear-gradient(rgba(0, 0, 0, 0.4), transparent);
    }
</style>