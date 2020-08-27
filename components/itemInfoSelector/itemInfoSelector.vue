<template>
	<view class="root mask">
        <view class="body" :class="{fadeOut: outFlag}">
            <view class="header">
                <uni-icons type="closeempty" size="24" class="back" @click="back"></uni-icons>
                <view class="title">物品信息</view>
            </view>
            <view class="main">
                
                <view class="section">
                    <view class="sectionTitle">物品种类</view>
                    <view class="sectionGrid">
                        <view class="item" :class="{selectedItem: type==item}" v-for="(item,index) in typeList" :key="index" @click="selectType(item)">{{ item }}</view>
                    </view>
                    
                    
                </view>
                
                <view v-if="type=='快递'" class="section">
                    <view class="sectionTitle">快递信息</view>
                    <textarea class="expressInfo" :value="expressInfo" placeholder="请根据快递提取方式提供快递收件人姓名及手机或粘贴短信" />
                </view>
                
                <view v-else-if="type=='外卖'" class="section">
                    <view class="sectionTitle">外卖信息</view>
                    <textarea class="expressInfo" :value="expressInfo" placeholder="请提供取外卖所需的信息,如取件姓名电话和骑手电话等" />
                </view>
                
                
                <view v-else-if="type=='其他'" class="section">
                    <view class="sectionTitle">具体种类</view>
                    <input type="text" v-model="otherType" maxlength="5" class="concreteType"/>
                </view>
                
                <view class="section">
                    <view class="sectionTitle">物品价值</view>
                    <view class="sectionGrid">
                        <view class="item" :class="{selectedItem: item==itemValue}" v-for="(item,index) in itemValueList" :key="index" @click="selectValue(item)">{{ item }}</view>
                    </view>
                </view>
                
                <view class="section">
                    <view class="sectionTitle">物品重量</view>
                    <view class="weight"> {{ getWeightString() }} </view>
                    <slider block-size="20" :value="weight" @change="changeWeight" :min="MIN_WEIGHT-1" :max="MAX_WEIGHT+1" :activeColor="colorMain" class="weightSlider"/>
                </view>
                
                <view class="button" @click="confirm">确定</view>
            </view>
        </view>
		
        
	</view>
</template>

<script>
    import { color } from '@/common/globalData.js';
    import { weightAssistant } from '@/common/helper.js';
    
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
				typeList: ['快递', '外卖', '书籍文件', '生活用品', '钥匙', '其他'],
                type: null,
                
                additionalInfo: null,
                otherType: null,
                
                itemValueList: ['50元以下', '50-200元', '200元以上'],
                itemValue: null,
                
                MIN_WEIGHT: null,
                MAX_WEIGHT: null,
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
            
            selectType: function(type) {
                if (type == '快递' || type == '外卖') {
                    that.additionalInfo = '';
                } else {
                    that.additionalInfo = null;
                }
                
                if (type == '其他') {
                    that.otherType = '';
                } else {
                    that.otherType = null;
                }
                that.type = type;
            },
            
            selectValue: function(value) {
                that.itemValue = value;
            },
            
            changeWeight: function(e) {
                that.weight = e.detail.value;
            },
            
            confirm: function() {
                let notice = null;
                if (!that.type) {
                    notice = '请选择物品种类';
                } else if ((that.type=='快递') && (that.additionalInfo.trim()=='')) {
                    notice = '请填写快递取件信息';
                } else if ((that.type=='外卖') && (that.additionalInfo.trim()=='')) {
                    notice = '请填写取外卖信息'
                } else if ((that.type=='其他') && (that.otherType.trim() == '')) {
                    notice = '请填写具体物品种类';
                } else if (!that.itemValue) {
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
                    let additionalInfo = that.additionalInfo;
                    let itemValue = that.itemValue;
                    let weight = that.weight;
                    
                    
                    if (that.type == '其他') {
                        type = that.otherType;
                    } else {
                        type = that.type;
                    }
                    
                    
                    that.fadeOut();
                    that.$emit('input', {
                        type,
                        additionalInfo,
                        itemValue,
                        weight,
                    });
                    
                    that.$emit('exit', {
                        valid: true,
                        value: {
                            type,
                            additionalInfo,
                            itemValue,
                            weight,
                        }
                    });
                    
                }
            },
            
            getWeightString: function() {
                return weightAssistant.getWeightString(that.weight)
            }
        },
        
        created: function() {
            that = this;
            
            that.MIN_WEIGHT = weightAssistant.MIN_WEIGHT;
            that.MAX_WEIGHT = weightAssistant.MAX_WEIGHT;
            
            if (Object.keys(that.value).length != 0) {
                if (that.typeList.includes(that.value.type)) {
                    that.type = that.value.type;
                } else {
                    that.type = '其他',
                    that.otherType = that.value.type;
                }
                that.additionalInfo = that.value.additionalInfo;
                that.itemValue = that.value.itemValue;
                that.weight = that.value.weight;
                
            }
        }
	}
</script>

<style scoped>
    
    @import url("@/common/style/formInputComponent.css");
    
    

    
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
    
    
    
</style>
