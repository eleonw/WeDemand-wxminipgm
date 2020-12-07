<template>
	<view class="root">
    <view class="page">
        <uni-nav-bar class="navBar" title="常用地址" @clickLeft="cancel"></uni-nav-bar>
        <view class="form">
            <view v-for="(item,idx) in shareData.addressBook" :key="item['_id']" @click="selectAddress(item.address)" @longtap="removeAddress(idx)"  class="formItem">
                <view class="formItemBlock">
                    <view class="addressMain">
                        {{ item.address.location.toString() }}
                    </view>
                    <view class="addressSub">
                        {{ item.address.name + ' ' + item.address.mobile }}
                    </view>
                </view>
                <uni-icons type="compose" class="formItemRight" @click.native.stop="modifyAddress(idx)"></uni-icons>
            </view>
        </view>
        
    </view>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
    
    import { defaultLocation, color } from '@/common/globalData.js';
    import shareData from './../shareData.js';
    
    import { clone } from '@/common/helper.js';
    
    import Vue from 'vue';
    import Address from '@/common/classes/Address.js';
    
    let page;

    
	export default {
        components: {
            uniIcons, uniNavBar
        },
		data() {
			return {
                shareData: null,
			}
		},
        created: function() {
            page = this;
            page.shareData = shareData;
            console.log(shareData.addressBook)
        },
		methods: {
            cancel: function() {
                uni.navigateBack();
            },
            
            selectAddress: function(address) {
                shareData.setCurrentAddress(address);
                shareData.navigateAfterCompleteAddress();
            },
            
			modifyAddress: function(index) {
                uni.navigateTo({
                    url: './modifyAddress?index=' + index,
                })
            },
            
            removeAddress: async function(index) {
                const res = await uni.showModal({
                    title: '从常用地址中移除？',
                    confirmColor: color.MAIN,
                })
                
                if (res[1].confirm) {
                    uni.showLoading({mask:true});
                    try {
                        await shareData.removeAddress({index: index});
                        uni.hideLoading();
                    } catch(e) {
                        console.log(e);
                        uni.hideLoading();
                        uni.showToast({
                            icon: 'none',
                            title: '系统繁忙，请稍后重试'
                        });
                    }
                }
 
                
                
            }
		}
	}
</script>

<style>
    @import url("@/common/style/form.css");
    
    .form {
        margin-top: 25rpx;
    }
    
    .addressMain {
        /* letter-spacing: .2em; */
    }
    
    .addressSub {
        font-size: .8em;
        font-weight: 300;
    }
    
    .formItem {
        width: 700rpx;
    }
</style>
