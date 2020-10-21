<template>
	<view class="root page">
        
        <statusBar class="statusBar"></statusBar>
        
        <map id="map" class="map" longitude="113" latitude="39" scale="15" :subkey="QQ_MAP_KEY" :markers="mapMarkers"></map>
        <backgroundIcon type="back" size="25" shadow="true" class="backNavigator" @click="back"></backgroundIcon>
        
        <view class="detailForm">
            <addressCard></addressCard>
            <view class="form card">
                <view class="formItem">
                    <view class="formItemTitle">取件时间</view>
                    <view class="formItemRight fromItemBlock">
                        <view class="timeRangeItem">
                            <view>从</view>
                            <navigatorWithPlaceholder :content="getTimeString(0)" placeholder="选择时间" @click.native="showSelector('startTime')"></navigatorWithPlaceholder>
                        </view>
                        <view class="timeRangeItem">
                            <view>至</view>
                            <navigatorWithPlaceholder :content="getTimeString(1)" placeholder="选择时间" @click.native="showSelector('endTime')"></navigatorWithPlaceholder>
                        </view>
                        
                    </view>
                </view>
                <view class="formItem">
                    <view class="formItemTitle">物品信息</view>
                    <view class="formItemRight">
                        <navigatorWithPlaceholder :content="getItemInfoString()" placeholder="物品类型、价值、重量" @click.native="showSelector('itemInfo')"></navigatorWithPlaceholder>
                    </view>
                </view>
                <view class="formItem">
                    <view class="formItemTitle">备注</view>
                    <view class="formItemRight">
                        <navigatorWithPlaceholder :content="note" placeholder="送件要求、物品描述等" @click.native="showSelector('note')"></navigatorWithPlaceholder>
                    </view>
                </view>

            </view>
            
            <view class="form card">
                <view class="formItem">
                    <view class="formItemTitle">优惠券</view>
                    <view class="formItemRight">
                        <navigatorWithPlaceholder :value="coupon" placeholder="选择优惠券" @click.native="chooseCoupon"></navigatorWithPlaceholder>
                    </view>
                </view>
                <view class="formItem">
                    <view class="formItemTitle">小费</view>
                    <view class="formItemRight">
                        <navigatorWithPlaceholder :content="tip?tip + '￥':''" placeholder="加tip加快接单速度" @click.native="showSelector('tip')"></navigatorWithPlaceholder>
                    </view>
                </view>
            </view>
            
            <view class="form card">
                <view class="formItem">
                    <view class="formItemTitle">取消时间</view>
                    <view class="formItemRight formItemBlock">
                        <radio-group @change="expireTimeTypeChange" class="radioGroup">
                            <label>
                                <radio :value="0" :color="colorMain" :checked="!assignExpireTime"/><text>默认时间</text>
                                <radio :value="1" :color="colorMain" :checked="assignExpireTime"/><text>指定时间</text>
                            </label>
                        </radio-group>
                        <view v-if="assignExpireTime">
                            <navigatorWithPlaceholder :content="getTimeString(3)" placeholder="请选择取消时间"  @click.native="showSelector('expireTime')"></navigatorWithPlaceholder>
                        </view>
                        <view else>
                            {{ getTimeString(1) }}
                        </view>
                    </view>
                </view>
            </view>
            
        </view>
        
        <timePicker v-if="show_startTime" class="selectorComponent" @exit="hideSelector('startTime')" v-model="startTime"></timePicker>
        <timePicker v-else-if="show_endTime" class="selectorComponent"  @exit="hideSelector('endTime')" v-model="endTime"></timePicker>
        <itemInfoSelector v-else-if="show_itemInfo" class="selectorComponent" v-model="itemInfo" @exit="hideSelector('itemInfo')"></itemInfoSelector>
        <seperateTextarea v-else-if="show_note" v-model="note" class="selectorComponent"  @exit="hideSelector('note')"></seperateTextarea>
        <priceInput v-else-if="show_tip" class="selectorComponent"  @exit="hideSelector('tip')" v-model="tip"></priceInput>
        <timePicker v-else-if="show_expireTime" class="selectorComponent"  @exit="hideSelector('expireTime')" v-model="expireTime"></timePicker>

        <orderNav class="orderNav" :costItems="[{
            title: '基础费用',
            cost: getBasicCost(),
        },
        {
            title: '小费',
            cost: tip?tip:0,
        }]" @clickConfirm="confirm"></orderNav>
        
	</view>
</template>

<script src="./helpDeliver.js">

</script>

<style>
    
   @import url("./detailForms.css");
   
</style>
