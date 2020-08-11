<template>
	<view class="root mask">
        <view class="body" :class="{fadeOut: outFlag}">
            <view class="header">
                <uni-icons type="back" class="back" size="24" @click="back"></uni-icons>
                <view class="title">物品信息</view>
            </view>
            <view class="main">
                
                <view class="section">
                    <view class="sectionTitle">物品种类</view>
                    <view class="sectionGrid">
                        <view class="item" :class="{selectedItem: index==typeIndex}" v-for="(type,index) in typeList" :key="index" @click="selectType(index)">{{ type }}</view>
                    </view>
                    
                    
                </view>
                
                <view v-if="typeIndex==EXPRESS_PACKAGE_TYPE_INDEX" class="section">
                    <view class="sectionTitle">快递信息</view>
                    <textarea class="expressInfo" :value="expressInfo" placeholder="请根据快递提取方式提供快递收件人姓名及手机或粘贴短信" />
                </view>
                
                
                <view v-else-if="typeIndex==OTHERS_TYPE_INDEX" class="section">
                    <view class="sectionTitle">具体种类</view>
                    <input type="text" :value="otherType" maxlength="5" class="concreteType"/>
                </view>
                
                <view class="section">
                    <view class="sectionTitle">物品价值</view>
                    <view class="sectionGrid">
                        <view class="item" :class="{selectedItem: index==valueIndex}" v-for="(value,index) in valueList" :key="index" @click="selectValue(index)">{{ value }}</view>
                    </view>
                </view>
                
                <view class="section">
                    <view class="sectionTitle">物品重量</view>
                    <view class="weight"> {{ weight==4?'<4kg':weight==21?'>20kg':weight+'kg' }} </view>
                    <slider block-size="20" :value="weight" @change="changeWeight" min="4" max="21" :activeColor="colorMain" class="weightSlider"/>
                </view>
                
                <view class="button" @click="confirm">确定</view>
            </view>
        </view>
		
        
	</view>
</template>

<script>
    import { color } from '@/common/globalData.js';
    
    let that;
    
	export default {
        name: 'itemInfoSelector',
        props: {
            value: {
                type: Object,
                default: null,
            }
        },
		data() {
			return {
				typeList: ['快递', '书籍', '文件', '生活用品', '钥匙', '其他'],
                typeIndex: null,
                EXPRESS_PACKAGE_TYPE_INDEX: 0,
                OTHERS_TYPE_INDEX: 5,
                
                expressInfo: null,
                otherType: null,
                
                valueList: ['50元以下', '50-200元', '200元以上'],
                valueIndex: null,
                
                weight: 4,
                
                colorMain: color.MAIN,
                outFlag: false,
			};
		},
        methods: {
            fadeOut: function() {
                that.outFlag = true;
                setTimeout(function() {
                    that.outFlag = false;
                }, 1500);
            },
            back: function() {
                that.fadeOut();
                setTimeout(function() {
                    that.$emit('exit', {
                        valid: false,
                    })
                }, 300)
            },
            
            selectType: function(index) {
                if (index == that.EXPRESS_PACKAGE_TYPE_INDEX) {
                    that.expressInfo = '';
                } else if (index == that.OTHERS_TYPE_INDEX) {
                    that.otherType = '';
                }
                that.typeIndex = index;
            },
            
            selectValue: function(index) {
                that.valueIndex = index;
            },
            
            changeWeight: function(e) {
                that.weight = e.detail.value;
            },
            
            confirm: function() {
                let notice = null;
                if (!that.typeIndex) {
                    notice = '请选择物品种类';
                } else if ((that.typeIndex==that.EXPRESS_PACKAGE_TYPE_INDEX) && (that.expressInfo.trim() == '')) {
                    notice = '请填写取件信息';
                } else if ((that.typeIndex==that.OTHERS_TYPE_INDEX) && (that.otherType.trim() == '')) {
                    notice = '请填写快递取货信息';
                } else if (!that.valueIndex) {
                    notice = '请选择物品价值';
                }
                
                if (notice) {
                    uni.showToast({
                        icon: 'none',
                        title: notice,
                    });
                    return;
                } else {
                    let type;
                    let expressInfo;
                    let weight;
                    
                    if (that.typeIndex == that.OTHERS_TYPE_INDEX) {
                        type = that.otherType;
                    } else {
                        type = that.typeList[that.typeIndex];
                        if (that.typeIndex == that.EXPRESS_PACKAGE_TYPE_INDEX) {
                            expressInfo = that.expressInfo;
                        }
                    }
                    
                    switch(that.weight) {
                        case 4:
                            weight = '小于5kg';
                            break;
                        case 21:
                            weight = '大于20kg';
                            break;
                        default:
                            weight = that.weight + 'kg';
                            break;
                    }
                    
                    that.fadeOut();
                    that.$emit('exit', {
                        valid: true,
                        value: {
                            type: type,
                            expressInfo: expressInfo,
                            value: that.valueList[that.valueIndex],
                            weight: weight
                        }
                    });
                }
            }
        },
        
        created: function() {
            that = this;

        }
	}
</script>

<style scoped>
    
    @import url("@/common/style/formInputComponent.css");
    
    
    .main {
        width: 95vw;
        
        display: flex;
        flex-flow: column nowrap;
        
        justify-content: space-around;
        padding: 10px 20px;
    }
    
    .section {
        width: 100%;
        
        display: flex;
        flex-flow: column nowrap;
        
    }
    
    .sectionTitle {
        margin: 15rpx 0;
    }
    
    .sectionGrid {
        width: 100%;
        
        align-self: center;
        
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        
        grid-gap: 10px 20px;
    }
    
    .expressInfo {
        height: 140rpx;
        border: 1px solid var(--color-main);
        border-radius: 2px;
        
        margin: 10rpx 0;
    }
        
    .concreteType {
        height: 1.2em;
        line-height: 1.2em;
        border-bottom: 1px solid var(--color-main);
        
        margin: 10rpx 0;
    }
    
    .item {
        border: 1px solid var(--color-border);
        text-align: center;
        border-radius: 4px;
        padding: 3px;
    }
    
    .selectedItem {
        color: white;
        background-color: var(--color-main);
        border: none;
    }
    
    .weight {
        align-self: center;
        font-size: 20px;
    }
    
    .weightSlider {
        margin: 25px 20px;
    }
    
    .button {
        text-align: center;
        background-color: var(--color-main);
        width: 100%;
        
        font-weight: 600;
        font-size: 1.2em;
        letter-spacing: .8em;
        color: white;
        
        height: 2em;
        line-height: 2em;
        border-radius: 2px;
    }
    
</style>
