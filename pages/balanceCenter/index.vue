<template>
	<view class="root page">
		
        <view class="title">余额中心</view>
        <view cal>{{ balanceString }}</view>
        <view class="item" @click="navigateTo('recharge')">充值</view>
        <view class="item" @click="navigateTo('withdraw')">提现</view>
	</view>
</template>

<script>
    import { balanceAssistant } from '@/common/server.js';
    import { getMoneyString } from '@/common/helper.js';
    
    const pageUrls = {
        recharge: './recharge',
        withdraw: './withdraw',
    }
    
    let that;
    
	export default {
		components: {
           
    },
    beforeCreate: function() {
        that = this;
    },
    onShow: async function() {
        uni.showLoading({mask: true});
        await initialBalanceRelevant();
        uni.hideLoading();
    },
    data() {
			return {
				balance: undefined,
                balanceString: '',
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
    
    async function initialBalanceRelevant() {
        const res = await balanceAssistant.checkBalance();
        if (!res.success) {
            if (res.code == -2) {
                that.loginStatusFailure();
            } else {
                that.balance = undefined;
                that.balanceString = '余额查询异常，请重新打开页面'
                uni.showModal({
                    content: '余额查询异常，请重新打开页面',
                    showCancel: false
                })
            }
            
        } else {
            that.balance = res.balance;
            that.balanceString = "￥" + getMoneyString(that.balance);
        }
    }
</script>

<style lang="scss">
    .page {
        background-color: var(--color-main);
        color: white;
        align-items: center;
        
        .title {
          font-size: 60rpx;
        }
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
