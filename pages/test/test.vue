<template>
	<view class="root">
		<view class="color main">main</view>
        <view class="color light">light</view>
        <view class="color dark">dark</view>
        <view class="color contrast">contrast</view>

        <view class="color background">background</view>
	</view>
</template>

<script>
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
    .root {
        display: flex;
        flex-direction: column;
        
        align-items: center;
        
        background-color: black;
    }
    
    .color {
        width: 700rpx;
        height: 200rpx;
    }
    
    .main{
        background-color: var(--color-main);
    }
    
    .contrast {
        background-color: var(--color-contrast);
    }
    
    .light {
        background-color: var(--color-light);
    }
    
    .dark {
        background-color: var(--color-dark);
    }
    
    .background {
        background-color: var(--color-background);
    }
 
</style>
