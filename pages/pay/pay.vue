<template>

    <view class="root page">
        
        <view class="cost">
            <view class="title">支付金额</view>
            <view class="amount">￥{{ amountString }}</view>
        </view>

        <view class="payMethod">
            <radio-group class="main" @change="methodChange">
                <view class="item" :class="{activeItem: method==PayMethod.WX}">
                    <view class="itemTitle">微信支付</view>
                    <radio class="radio" :value="PayMethod.WX" :checked="method==PayMethod.WX" :color="colorMain"/>
                </view>
                <view class="item" :class="{activeItem: method==PayMethod.BALANCE}">
                    <view class="itemTitle">{{ balancePayString }}</view>
                    <radio class="radio" :value="PayMethod.BALANCE" :checked="method==PayMethod.BALANCE" :color="colorMain"/>
                </view>
            </radio-group>
        </view>
        
        <view class="confirmButton" @click="confirm">
            确认
        </view>
            
    </view>

</template>

<script>
    import eventBus from '@/common/eventBus.js';
    import { color, PayMethod} from '@/common/globalData.js';
    import { getMoneyString } from '@/common/helper.js';
    import { balanceAssistant } from '@/common/server.js';
    
    let that;
    let eventName;
    
	export default {
		data() {
			return {
                amountString: null,
                balance: null,
                amount: null,
				method: PayMethod.WX,
                PayMethod: PayMethod,
                balancePayString: '余额支付',
                colorMain: null,
			}
		},
        
        onLoad: function(opt) {
            that.amount = opt.amount;
            eventName= opt.eventName;
            that.amountString = getMoneyString(that.amount);
        },
        
        beforeCreate: function() {
            that = this;
        },
        
        created: function() {
            that.colorMain = color.MAIN;
        },
        
        onShow: async function() {
            uni.showLoading({
                mask: true
            });
            await initialBalanceRelevant();
            uni.hideLoading();
        },
        
		methods: {
			methodChange: function(e) {
                if (e.detail.value == PayMethod.BALANCE) {
                    if (!that.balance) {
                        uni.showModal({
                            title: '提示',
                            content: '余额加载异常，请重新打开页面尝试',
                            showCancel: false,
                            complete: function() {
                                that.finishPay(false);
                            }
                        })
                    } else if (that.balance < that.amount) {
                        uni.showModal({
                            title: '提示',
                            content: '余额不足，是否前往充值',
                            complete: function(e) {
                                if (e.confirm) {
                                    uni.navigateTo({ url: '/pages/balanceCenter/recharge'});
                                }
                            }
                        })
                    } else {
                        that.method = PayMethod.BALANCE;
                    }
                } else {
                    that.method = e.detail.value;
                }
            },
            
            finishPay: function(status) {
                eventBus.$emit(eventName, {success: status})
            },
            
            confirm: async function() {
                switch (that.method) {
                    case PayMethod.BALANCE:
                        const res = await balanceAssistant.payWithBalance({amount: that.amount});
                        if (res.success) {
                            that.finishPay(true);
                            uni.showToast({
                                title: '支付成功'
                            })
                            setTimeout(() => {
                                uni.navigateBack()
                            }, 1000);
                        } else {
                            uni.showModal({
                                title: '支付失败',
                                content: res.message,
                                showCancel: false,
                                complete: async function(e) {
                                    if (res.code == -2) {
                                        that.loginStatusFailure();
                                    } else {
                                        await initialBalanceRelevant();
                                    }
                                } 
                            })
                        }
                }
            }
            
            
		}
	}
    
    async function initialBalanceRelevant() {
        const res = await balanceAssistant.checkBalance();
        if (!res.success || !res.balance) {
            if (res.code == -2) {
                that.loginStatusFailure();
            }
            that.balance = undefined;
            that.balancePayString = '余额支付 (查询异常，请尝试重新打开页面)';
        } else {
            that.balance = res.balance;
            if (that.amount < that.balance) {
                that.balancePayString = "余额支付（剩余￥" + getMoneyString(that.balance) + "）";
            } else {
                that.balancePayString = "余额支付（剩余￥" + getMoneyString(that.balance) + "，余额不足）";
            }
        }
    }
    
</script>

<style lang="scss">

    .page {
        align-items: center;
    }
    
    .cost {
        margin-top: 200rpx;
        margin-bottom: 150rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .title {
            font-size: 50rpx;
            font-weight: 600;
        }
        .amount {
            margin-top: 20rpx;
            
            color: white;
            background-color: var(--color-main);
            border-radius: 10rpx;
            font-size: 80rpx;
            
        }
    }
    
    .payMethod {
        
        .radio {
            transform: scale(0.7);
        }
        
        .main {
            align-items: stretch;
        }
        
        .item {
            width: 700rpx;
            display: flex;
            flex-direction: row;
            
            justify-content: space-between;
            align-items: center;
            padding: 10rpx;
            
            border-bottom: 2px solid var(--color-border);
        }
        
        .itemTitle {
            font-weight: 600;
        }
    }
    
    .confirmButton {
        margin-top: 50rpx;
        margin-bottom: 100rpx;
        width: 200rpx;
        height: 80rpx;

        display: flex;
        align-items: center;
        justify-content: center;
        
        color: white;
        font-weight: 600;
        font-size: 50rpx;
        background-color: var(--color-main);
        
        border-radius: 10rpx;
    }
    

</style>
