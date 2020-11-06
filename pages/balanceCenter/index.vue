<template>
	<view>
		
        <uni-nav-bar left-icon="none"  title="微叮当"></uni-nav-bar>
        这是余额中心
        <view>{{balance}}</view>
        <view @click="retry">{{balanceString}}</view>
        <view class="item" @click="navigateTo('recharge')">充值</view>
        <view class="item" @click="navigateTo('withdraw')">提现</view>
	</view>
</template>

<script>
    import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
    
    import { balanceAssistant } from '@/common/server.js';
    import { getMoneyString } from '@/common/helper.js';
    
    const pageUrls = {
        recharge: './recharge',
        withdraw: './withdraw',
    }
    
    let that;
    
	export default {
		components: {
            uniNavBar
        },
        beforeCreate: function() {
            that = this;
        },
        created: async function() {
            await initialBalanceRelevant();
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
            retry: async function() {
                await initialBalanceRelevant();
            }
		}
	}
    
    async function initialBalanceRelevant() {
        const res = await balanceAssistant.checkBalance();
        if (!res.success || !res.balance) {
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
            that.balanceString = getMoneyString(that.balance);
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
