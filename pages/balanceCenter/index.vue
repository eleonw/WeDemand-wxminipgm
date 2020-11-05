<template>
	<view>
		
        <uni-nav-bar left-icon="none"  title="微叮当"></uni-nav-bar>
        这是余额中心
        <view class="item" @click="navigateTo('recharge')">充值</view>
        <view class="item" @click="navigateTo('withdraw')">提现</view>
	</view>
</template>

<script>
    import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
    
    const pageUrls = {
        recharge: './recharge',
        withdraw: './withdraw',
    }
    
	export default {
		components: {
            uniNavBar
        },
        data() {
			return {
				
			}
		},
		methods: {
			navigateTo: function(page) {
			    uni.navigateTo({
			        url: pageUrls[page],
			        complete: e => {
			            console.log(e)
			        }
			    })
			},
		}
	}
</script>

<style>
    .page {
        background-color: var(--color-main);
    }
    
    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        /* background-color: orange; */
        grid-gap: 10px 10px;
        
        height: 20vw;
    }
    
    .gridItem {
        background-color: var(--color-main);
        text-align: center;
    }
    
    .item {
        font-size: 70rpx;
        text-align: center;
        margin: 30rpx;
        width: 400rpx;
        height: 300rpx;
        line-height: 300rpx;
        color: var(--color-main);
        background-color: white;
        
        border-radius: 30rpx;
    }
</style>
