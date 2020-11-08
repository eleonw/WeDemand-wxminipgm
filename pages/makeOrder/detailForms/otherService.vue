<template>
	<view class="root page">

        <statusBar class="statusBar"></statusBar>
        
		<map id="map" class="map" longitude="113" latitude="39" scale="15" :subkey="QQ_MAP_KEY" :markers="mapMarkers"></map>
        <backgroundIcon type="back" size="25" shadow="true" class="backNavigator" @click="back"></backgroundIcon>
        <view class="detailForm">
            
            <view class="form card">
                <addressCard></addressCard>
                <view class="formItem lastFormItem">
                    <view class="formItemTitle">服务时间</view>
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
            </view>
            
            
            <view class="form card">
                <view class="formItem textareaSet">
                    <view class="textareaTitle">填写需要的服务及注意事项</view>
                    <textarea class="textareaBody"  v-model="serviceDesc" placeholder="如排队、搬东西、送花..." maxlength="250"></textarea>
                    <view class="textareaKeyWords">
                        <view class="textareaKeyWord" v-for="(keyWord,index) in textareaKeyWords" :key="index" @click="addKeyWord(keyWord)">{{ keyWord }}</view>
                    </view>
                </view>
                <view class="formItem lastFormItem">
                    <view class="formitemTitle">敏感信息</view>
                    <view class="formItemRight">
                        <navigatorWithPlaceholder :content="sensitiveInfo.main" placeholder="只有接单的用户可以查看" @click.native="showSelector('sensitiveInfo')"></navigatorWithPlaceholder>
                    </view>
                </view>
                
            </view>
            
            <view class="form card">
                <view class="formItem">
                    <view class="formItemTitle">优惠券</view>
                    <view class="formItemRight">
                       <navigatorWithPlaceholder :content="coupon?coupon:''" placeholder="选择优惠券" @click.native="chooseCoupon"></navigatorWithPlaceholder>
                    </view>
                </view>
                <view class="formItem lastFormItem">
                    <view class="formItemTitle">服务费</view>
                    <view class="formItemRight">
                        <navigatorWithPlaceholder :content="getTipString()" placeholder="通过增加服务费加快接单速度" @click.native="showSelector('tip')"></navigatorWithPlaceholder>
                    </view>
                </view>
            </view>
            
            <view class="form card">
                <view class="formItem">
                    <view class="formItemTitle">取消时间</view>
                    <view class="formItemRight formItemBlock">
                        <radio-group @change="expireTimeTypeChange" class="radioGroup">
                            <label>
                                <radio :value="0" :color="colorMain" :checked="!assignExpireTime"/><text>自动取消</text>
                                <radio :value="1" :color="colorMain" :checked="assignExpireTime"/><text>指定时间</text>
                            </label>
                        </radio-group>
                       <view v-if="assignExpireTime">
                           <navigatorWithPlaceholder :content="getTimeString(2)" placeholder="请选择取消时间"  @click.native="showSelector('expireTime')"></navigatorWithPlaceholder>
                       </view>
                       <view else>
                           {{ getTimeString(0) }}
                       </view>
                    </view>
                </view>
            </view>
            
            
            
        </view>
        
        <timePicker v-if="show_startTime" class="selectorComponent" @exit="hideSelector('startTime')" v-model="startTime"></timePicker>
        <timePicker v-if="show_endTime" class="selectorComponent" @exit="hideSelector('endTime')" v-model="endTime"></timePicker>
        <seperateTextarea v-else-if="show_sensitiveInfo" v-model="sensitiveInfo.main" class="selectorComponent"  @exit="hideSelector('sensitiveInfo')"></seperateTextarea>
        <priceInput v-else-if="show_tip" class="selectorComponent" title="服务费" @exit="hideSelector('tip')" v-model="tip"></priceInput>
        <timePicker v-else-if="show_expireTime" class="selectorComponent"  @exit="hideSelector('expireTime')" v-model="expireTime"></timePicker>
        
        <orderNav class="orderNav" :costItems="[{
            title: '基础费用',
            cost: getBasicCost(),
        },
        {
            title: '小费',
            cost: tip,
        }]" @clickConfirm="confirm"></orderNav>
        
        
        
	</view>
</template>

<script>
    import addressCard from './../components/addressCard.vue';
    import statusBar from '@/components/statusBar/statusBar.vue';
    import backgroundIcon from '@/components/backgroundIcon/backgroundIcon.vue'
    import navigatorWithPlaceholder from '@/components/navigatorWithPlaceholder/navigatorWithPlaceholder.vue';
    import orderNav from '@/components/orderNav/orderNav.vue';
    
    import timePicker from '@/components/timePicker/timePicker.vue';
    import priceInput from '@/components/priceInput/priceInput.vue';
    import tipSelector from '@/components/tipSelector/tipSelector.vue';
    
    import Location from '@/common/classes/Location.js';
    
    import { color, serviceType as _serviceType }from '@/common/globalData.js';
    import shareData from './../shareData.js';
    import { QQ_MAP_KEY} from '@/common/sensitiveData.js';
    
    import { getTimeString, getMoneyString } from '@/common/helper.js';
    import { orderAssistant_creater as orderAssistant } from '@/common/server.js'
    import eventBus from '@/common/eventBus.js';
    
    let page;
    let mapContext;
    const dev = false;
    let orderId;
    const payEventName = 'payOtherService';
    
	export default {
        components: {
             addressCard, navigatorWithPlaceholder, statusBar, backgroundIcon, orderNav,
             timePicker, tipSelector, priceInput
        },
        
		data() {
			return {
        mapMarkers: null,
				colorMain: null,
        textareaKeyWords: ['务必准时'],
        sensitiveInfo: {
            main: ''
        },
        startTime: null,
        endTime: null,
        serviceDesc: '',
        tip: 0,
        expireTime: null,
        assignExpireTime: false,

        show_startTime: false,
        show_endTime: false,
        show_tip: false,
        show_sensitiveInfo: false,
        show_expireTime: false,
			}
		},
        
    created: function() {
        page = this;
        page.colorMain = color.MAIN;
        mapContext = uni.createMapContext('map');
    },
        
    onShow: function() {
      page.mapMarkers = [
        {
            id: 0,
            latitude: shareData.address[0].location.latitude,
            longitude: shareData.address[0].location.longitude,
            iconPath: '/static/image/icon/deliver.png',
            width: 40,
            height: 40, 
        }
      ];
      mapContext.includePoints({
          points: page.mapMarkers,
          padding: [80, 30, 120, 30],
      });
    },
        
		methods: {
      back: function() {
      
        uni.showModal({
          content: '放弃订单？',
          cancelColor: color.MAIN,
          confirmColor: "#8f8f8f",
          
          success: res => {
            if (res.confirm) {
              shareData.clear();
              uni.navigateBack();
            }
          },
        })
      },
      
      showSelector: function(type) {
        page['show_'+type] = true;
      },
      
      hideSelector: function(type) {
        page['show_'+type] = false;
      },
      
      getTimeString: function(index) {
          
        const target = index==0 ? 'startTime' : 'endTime'; 
        const substitude = '现在'
        if (page[target]) { return getTimeString({timestamp: page[target], substitude}); } 
        else { return ''; }
      },
      
      getTipString: function(){
        const moneyString = getMoneyString(page.tip);
        return moneyString == '' ? '' : '￥' + moneyString;
      },
      
      addKeyWord: function(keyWord) {
        page.serviceDesc = page.serviceDesc + ' ' + keyWord + ' ';
      },
      
      getBasicCost: function() {
        return 100;
      },
      
      confirm: async function(e) {
          let notice;
          if (!dev) {
              if (!shareData.completed[0]) {
                  notice = '请填写服务地址';
              } else if (!page.startTime || !page.endTime) {
                  notice = '请完善服务时间';
              } else if (page.startTime >= page.endTime) {
                  notice = '请确保服务起始时间早于服务结束时间';
              } else if (page.serviceDesc.trim() == '') {
                  notice = '请填写服务信息';
              } else if (!page.tip || page.tip<=0) {
                  notice = '请填写服务费用';
              } else if (page.assignExpireTime && !page.expireTime) {
                  notice = '请选择订单取消时间'
              }
          }
          
          if (notice) {
              uni.showToast({
                  title: notice,
                  icon: 'none',
              });
              return;
          }
          
          uni.showLoading();
          
          const serviceType = _serviceType.OTHER_SERVICE;
          const address = shareData.address[0];
          const startTime = page.startTime;
          const endTime = page.endTime;
          const serviceDesc = page.serviceDesc;
          const couponId = page.coupon ? page.coupon.id : null;
          const sensitiveInfo = page.sensitiveInfo;
          const expireTime = page.assignExpireTime ? page.expireTime : page.startTime;
          const cost = {
              tip: page.tip?page.tip:0,
              basic: page.getBasicCost(),
          }
          const totalCost = e.totalCost;
          const order = {serviceType, address, startTime, endTime, serviceDesc, couponId, sensitiveInfo, expireTime, cost, totalCost };
          // console.log(order);
          // return;
          let res = await orderAssistant.initial(order);
          if (!res.success) {
            await page.promisify(uni.showModal, {
                content: '操作失败，请重试',
                showCancel: false,
            })
            return;
          } else {
            orderId = res.orderId;
            const paras = 'amount=' + totalCost + "&eventName=" + payEventName;
            eventBus.$on(payEventName, postPay)
            uni.navigateTo({url: '/pages/pay/pay?' + paras});
          }
      },
		}
	}
  
  async function postPay(e) {
    eventBus.$off(payEventName);
    let res;
    if (e.success) { res = await orderAssistant.create({orderId: orderId}); }
    const url = './result?success=true&orderId=' + orderId;
    uni.hideLoading();
    if (e.success) {
        shareData.clear();
        uni.redirectTo({url})
    } else {
        uni.navigateTo({url})
    }
  }
  
</script>

<style>
    @import url("./detailForms.css");
    
    #buyingLocationBlock {
        align-items: flex-end;
    }
    
    #buyingLocationBlock view {
        margin: 5rpx 0;
    }
    
</style>
