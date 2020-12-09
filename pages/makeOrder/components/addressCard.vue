<template>
    
    <view class="root form card">
        
        <view class="formItem" v-for="(item,index) in shareData.address" :key="index" :class="{selectedItem: index==shareData.currentAddressIdx}">
            <textIcon class="formItemIcon" :text="static[shareData.serviceType][index].text" :backgroundColor="static[shareData.serviceType][index].color" color="white" diameter="1.2em"></textIcon>
            <view class="formItemBlock" @click="addressClick(index)">
                <withPlaceholder :content="item.location.toString()" :placeholder="static[shareData.serviceType][index].placeholder" class="addressMain"></withPlaceholder>
                <view v-if="item.location.toString()!=''">
                    <withPlaceholder :content="item.name + ' ' + item.mobile" placeholder="请填写详细信息" class="addressDtl"></withPlaceholder>
                </view>
            </view>
            <uni-icons type="list" @click="listClick(index)" class="formItemRight"></uni-icons>
        </view>
        
    </view>
</template>

<script>
    import textIcon from "@/components/textIcon/textIcon.vue";
    import uniIcons from "@/components/uni-icons/uni-icons.vue";
    import withPlaceholder from "@/components/withPlaceholder/withPlaceholder.vue";
    
    import shareData from "./../shareData.js";
    import { serviceType, color } from "@/common/globalData.js";
    
    import Address from "@/common/classes/Address.js";

    let that = null;
    
	export default {
        name: 'addressCard',
        components: {
            textIcon, uniIcons, withPlaceholder
        },
        props: {
        },
        methods: {
            addressClick: async function(index) {
              if (!getApp().globalData.login) {
                let res = await that.promisify(uni.showModal, {title: '提示', content: '您还没有登录，无法下单，是否前往登录？'})
                if (res.confirm) { uni.reLaunch({url: '/pages/front/front'}); }
                return;
              }
                
                console.log('addressClick');
                if (shareData.addressCardLock) {
                    console.log('location parsing');
                    return null;
                }
                shareData.currentAddressIdx = index;
                uni.navigateTo({
                    url: '/pages/makeOrder/addressForm/addressForm',
                    complete: function(e) {
                        console.log(e)
                    }
                })
            },
            listClick: async function(index) {
                console.log('list click');
                if (!getApp().globalData.login) {
                  let res = await that.promisify(uni.showModal, {title: '提示', content: '您还没有登录，无法下单，是否前往登录？'})
                  if (res.confirm) { uni.reLaunch({url: '/pages/front/front'}); }
                  return;
                }
                if (shareData.addressCardLock) {
                    console.log('location parsing');
                    return null;
                }
                shareData.currentAddressIdx = index;
                uni.navigateTo({
                    url: '/pages/makeOrder/addressBook/addressBook'
                })
            }
        },
		data() {
			return {
                shareData: null,
                static: {
                    [serviceType.HELP_DELIVER]: [
                        {
                            color: color.DARK,
                            text: '取',
                            placeholder: '请选择取货地址'
                        },
                        {
                            color: color.LIGHT,
                            text: '送',
                            placeholder: '请选择送货地址'
                        }
                    ],
                    [serviceType.HELP_BUY]: [
                        {
                            color: color.LIGHT,
                            text: '送',
                            placeholder: '请选择派送地址'
                        }
                    ],
                    [serviceType.OTHER_SERVICE]: [
                        {
                            color: color.LIGHT,
                            text: '至',
                            placeholder: '请选择服务地址'
                        }
                    ]
                }
			};
		},
    created: function() {
        this.shareData = shareData;
    },
    beforeCreate: function() {
      that = this;
    }
        
	}
</script>

<style>
    @import url("@/common/style/form.css");
    
    
    .formItemBlock {
        width: 80%;
    }
    
    
    .addressMain {
        font-weight: 600;
        line-height: 80rpx;
        letter-spacing: 5rpx;
    }
    
    .addressDtl {
        font-size: .8em;
        font-weight: 300;
    }
    
</style>
