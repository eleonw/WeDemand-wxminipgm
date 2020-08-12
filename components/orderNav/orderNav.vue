<template>
	<view class="root" :class="{mask: showDetail}">
        
        <view class="detail" v-if="showDetail" :class="{fadeOut: fadeOut}">
            <view class="detailHeader">费用明细</view>
            <view class="detailMain">
                <view class="detailItem" v-for="(item,index) in costItems" :key="index" v-if="item.cost!=0">
                    <view class="detailItemTitle">{{item.title}}</view>
                    <view class="detailItemSub">{{item.sub?item.sub:''}}</view>
                    <view class="detailItemCost">￥{{item.cost}}</view>
                </view>
            </view>
        </view>
        <view class="barArea shadow">
            <view class="main">
                <view class="brief">
                    跑腿费<text class="cost">￥{{ getTotalCost() }}</text>
                </view>
                <view class="detailNav"  @click="showDetailChange">
                    <view>明细</view>
                    <uni-icons size="12" :color="colorPlaceholder" :type="showDetail?'arrowdown':'arrowup'" class="navIcon"></uni-icons>
                </view>
            </view>
            <view class="confirmButton">
                提交订单
            </view>
        </view>
        
	</view>
</template>

<script>
    let that;
    
    import { color } from '@/common/globalData.js';
    
	export default {
        name: 'orderNav',
        props: {
            costItems: {
                type: Array,
                default: [
                    {
                        title: '基础费用',
                        cost: '10',
                        placeholder: undefined,
                    }
                ],
            }
        },
		data() {
			return {
				showDetail: false,
                fadeOut: false,
			};
		},
        
        created: function() {
            that = this;
            that.colorPlaceholder = color.PLACEHOLDER;
        },
        
        methods: {
            showDetailChange: function() {
                if (that.showDetail) {
                    that.fadeOut = true;
                    setTimeout(function() {
                        that.showDetail = false;
                        that.fadeOut = false;
                    }, 200);
                } else {
                    that.showDetail = true;
                }
                
            },
            getTotalCost: function() {
                let cost = 0;
                for (let item of that.costItems) {
                    cost += Number(item.cost);
                }
                return cost;
            }
        }
        
	}
</script>

<style scoped>
    
    .root {
        position: fixed;
        left: 0;
        bottom: 0;
        background-color: transparent;

        width: 100vw;
        
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: flex-end;
    }
    
    .barArea {
        
        background-color: white;
        
        height: var(--height-tabbar);
        width: 100%;
        
        display: flex;
        flex-flow: row nowrap;
    }
    
    .main {
        width: 70%;
        height: 100%;
        display: flex;
        flex-flow: row nowrap;

        align-items: center;
        justify-content: space-between;
        
        padding: 0 20rpx 0 30rpx;
    }
    
    .cost {
        color: var(--color-contrast);
        font-weight: 600;
    }
    
    .detailNav {
        display: flex;
        flex-flow: row nowrap;
        
        color: var(--color-placeholder);
        font-size: .8em;
        
    }
    
    .confirmButton {
        width: 30%;
        height: var(--height-tabbar);
        
        text-align: center;
        line-height: var(--height-tabbar);
        
        background-color: var(--color-main);
        
        color: white;
        font-weight: 600;
    }
    
    .detail {
        width: 100%;
        
        padding-bottom: 10rpx;
        
        background-color: white;
        display: flex;
        flex-flow: column nowrap;
        
        align-items: center;
        
        animation: fadeIn .4s;
    }
    
    .detailHeader {
        width: 95%;
        padding: 30rpx;
        
        text-align: center;
        font-weight: 500;
        
        
        border-bottom: 1px solid var(--color-border);
        
        
    }
    
    .detailMain {
        width: 100%;
        
        display: flex;
        flex-flow: column nowrap;
        
    }
    
    .detailItem {

        display: flex;
        flex-flow: row nowrap;
        
        align-items: center;
        justify-content: flex-start;
        
        padding: 30rpx;
    }
    
    .detailItemCost {
        margin-left: auto;
    }
    
    .mask {
        height: 100vh;
        background-color: var(--color-mask);
    }
    
    .fadeOut {
        animation: fadeOut .4s;
    }
    
    .navIcon {
        margin-left: 10rpx;
    }
    
    
</style>
