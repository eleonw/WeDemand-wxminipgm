<template>
	<view class="root">
        <view class="body" :class="{fadeOut: outFlag}">
            <view class="header" v-if="asSeletor">
                <uni-icons type="closeempty" size="20" class="back" @click="cancel"></uni-icons>
                <view class="title">
                    <view class="titleMain">选择支付方式</view>
                    <view class="titleSub">￥{{ costString }}</view>
                </view>
            </view>
            <radio-group class="main" @change="bindChange">
                <view class="item" :class="{activeItem: paymentMethod==PayMethod.WX}">
                    <view class="itemTitle">微信支付</view>
                    <radio class="radio" :value="PayMethod.WX" :checked="paymentMethod==PayMethod.WX" :color="colorMain"/>
                </view>
                <view class="item" :class="{activeItem: paymentMethod==PayMethod.BALANCE}">
                    <view class="itemTitle">{{ getBalancePaymentTitle() }}</view>
                    <radio class="radio" :value="PayMethod.BALANCE" :checked="paymentMethod==PayMethod.BALANCE" :color="colorMain"/>
                </view>
                
                <view class="button" @click="confirm">确认</view>
            </radio-group>
            
            
        </view>
		
	</view>
</template>

<script>
    
    import { color, PayMethod } from '@/common/globalData.js';
    import { getMoneyString } from '@/common/helper.js';
    import { balanceAssistant } from '@/common/server.js';
    
    let that;
    
	export default {
        name: 'paymentMethodSelector',
        props: {
            value: {
                type: Number,
                default: 0,
            },
            cost: {
                type: [Number, String],
                default: 0,
            },
        },
		data() {
			return {
                PayMethod: null,
				outFlag: false,
                paymentMethod: 0,
                balance: null,
                colorMain: null,
                costString: null,
                balancePayString: null,
                lackBalance: null,
			};
		},
        
        created: async function() {
            that = this;
            that.PayMethod = PayMethod;
            that.colorMain = color.MAIN;
            that.costString = getMoneyString(that.cost);
            if (!initialBalanceRelevant()) {
                uni.showToast({
                    title: '获取余额异常',
                    icon: 'none',
                })
            } 
        },
        
        methods: {
            bindChange: function(e) {
                if (e.detail.value == PayMethod.BALANCE) {
                    if (lackBalance == null) {
                        uni.showModal({
                            content: '余额查询异常，请尝试刷新',
                            complete: function(e) {
                                that.cancel();
                            }
                        })
                    } else if (lackBalance) {
                        uni.showModal({
                            title: '余额不足，是否前往充值？',
                            success: function(e) {
                                if (e.confirm) {
                                    uni.navigateTo({url: '/pages/balanceCenter/recharge'});
                                    that.cancel();
                                }
                            }
                        })
                    } else {
                        that.paymentMethod = 1
                    }
                } else {
                    that.paymentMethod = e.detail.value;
                }
            },
            
            fadeOut: function() {
                that.outFlag = true;
                setTimeout(function() {
                    that.outFlag = false;
                }, 1500);
            },
            
            cancel: function() {
                that.fadeOut();
                setTimeout(function() {
                    that.$emit('exit', {
                        valid: false,
                    });
                }, 300)
            },
            
            confirm: function() {
                that.fadeOut();
                that.$emit('input', that.paymentMethod);
                setTimeout(function() {
                    that.$emit('exit', {
                        valid: true,
                        paymentMethod: that.paymentMethod,
                        
                    });
                }, 300)
                
            },
        }
	}
    
    async function initialBalanceRelevant() {
        const res = await balanceAssistant.checkBalance();
        if (!res.success) {
            that.balance = null;
            that.balancePayString = '余额支付 (余额查询异常，请重新打开页面尝试)';
            that.lackBalance = null;
        }
        that.balance = res.balance;
        if (that.cost < that.balance) {
            that.lackBalance = false;
            that.balancePayString = "余额支付（剩余￥" + getMoneyString(that.balance) + "）";
        } else {
            that.lackBalance = true;
            that.balancePayString = "余额支付（剩余￥" + getMoneyString(that.balance) + "，余额不足）";
        }
        return true;
    }
    
    
</script>

<style>

    @import url("@/common/style/formInputComponent.css");
    
    .radio {
        transform: scale(0.7);
    }
    
    .main {
        align-items: stretch;
    }
    
    .item {
/*        width: 100%; */
        display: flex;
        flex-direction: row;
        
        justify-content: space-between;
        align-items: center;
        padding: 10rpx;
        
        border-bottom: 1px solid var(--color-border);
    }
    
    .itemTitle {
        font-weight: 600;
    }
    
    .button {
        margin-top: 80rpx;
    }
    
</style>
