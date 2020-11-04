<template>
	<view class="root">
        <view class="body" :class="{fadeOut: outFlag}">
            <view class="header">
                <uni-icons type="closeempty" size="20" class="back" @click="cancel"></uni-icons>
                <view class="title">
                    <view class="titleMain">选择支付方式</view>
                    <view class="titleSub">￥{{cost}}</view>
                </view>
            </view>
            <radio-group class="main" @change="bindChange">
                <view class="item" :class="{activeItem: paymentMethod==0}">
                    <view class="itemTitle">微信支付</view>
                    <radio class="radio" value="0" :checked="paymentMethod==0" :color="colorMain"/>
                </view>
                <view class="item" :class="{activeItem: paymentMethod==1}">
                    <view class="itemTitle">支付宝支付</view>
                    <radio class="radio" value="1" :checked="paymentMethod==1" :color="colorMain"/>
                </view>
                <view class="item" :class="{activeItem: paymentMethod==2}">
                    <view class="itemTitle">{{ getBalancePaymentTitle() }}</view>
                    <radio class="radio" value="2" :checked="paymentMethod==2" :color="colorMain"/>
                </view>
                
                <view class="button" @click="confirm">确认</view>
            </radio-group>
            
            
        </view>
		
	</view>
</template>

<script>
    
    import { userInfo, color } from '@/common/globalData.js';
    import { getMoneyString } from '@/common/helper.js';
    
    let that;
    
	export default {
        name: 'paymentMethodSelector',
        props: {
            cost: {
                type: [Number, String],
                default: 0,
            }
        },
		data() {
			return {
				outFlag: false,
                paymentMethod: 0,
                balance: null,
                colorMain: null,
			};
		},
        
        created: function() {
            that = this;
            that.balance = userInfo.balance;
            that.colorMain = color.MAIN;
        },
        
        methods: {
            bindChange: function(e) {
                if (e.detail.value == 1 && (that.cost > that.balance)) {
                    uni.showModal({
                        title: '余额不足，是否前往充值？',
                        success: e => {
                            console.log(e);
                        }
                    })
                } else {
                    that.paymentMethod = e.detail.value;
                }
            },
            
            getBalancePaymentTitle: function() {
                if (that.cost < that.balance) {
                    return "余额支付（剩余￥" + getMoneyString(balance) + "）";
                } else {
                    return " 余额支付（剩余￥" + that.balance + "，余额不足）";
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
                let timestamp = that.getSelectedTimestamp();
                that.$emit('input', timestamp);
                setTimeout(function() {
                    that.$emit('exit', {
                        valid: true,
                        pickerValue: timestamp,
                    });
                }, 300)
                
            },
        }
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
