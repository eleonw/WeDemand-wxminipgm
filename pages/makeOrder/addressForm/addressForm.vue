<template>
	<view class="root">
    <view class="page">
		<uni-nav-bar class="navBar" left-icon="back" :title="title" shadow="true" fixed="true" statusBar="true" @clickLeft="clickBack"></uni-nav-bar>
        <view class="form">
            
            <view class="formItem" @click="chooseLocation">
                <uni-icons class="formItemIcon" type="location"></uni-icons>
                <withPlaceholder class="chooseLocation" :content="address.location.name==''?address.location.address:address.location.name" placeholder="请选择地址"></withPlaceholder>
                    <!-- <textarea class="chooseLocation" disabled="true" :value="address.location.name==''?address.location.address:address.location.name" placeholder="点击选择地址" auto-height="true"></textarea> -->
                <uni-icons type="forward" class="formItemRight"></uni-icons>
            </view>
            
            <view class="formItem">
                <uni-icons class="formItemIcon" type="home"></uni-icons>
                <input placeholder="地址详情(如楼层门牌号)" maxlength="20" type="text" v-model="address.location.detail" class="locationDetail"></input>
                <view class="formItemBlank"></view>
            </view>
            
            <view class="formItem">
                <uni-icons class="formItemIcon" type="person"></uni-icons>
                <input class="name" placeholder="姓名或昵称" maxlength="10" type="text" v-model="address.name"></input>
                <radio-group @change="sexChange" class="formItemRight">
                    <label class="radio">
                        <radio class="radio" value="0" :checked="address.sex==0" :color="colorMain"></radio><text>先生</text>
                    </label>
                    <label class="radio">
                        <radio class="radio" value="1" :checked="address.sex==1" :color="colorMain"></radio><text>女士</text>
                    </label>
                </radio-group>
            </view>
            
            <view class="formItem">
                <uni-icons class="formItemIcon" type="phone"></uni-icons>
                <input placeholder="联系电话" type="number" maxlength="11" v-model="address.tel" class="tel"></input>
                <view class="formItemBlank"></view>
            </view>
            
            <view class="formItem" style="justify-content: center">
                <view class="confirmButton" @click="confirm">
                    <view class="buttonText">确&nbsp&nbsp定</view>
                </view>
            </view>
            
        </view>
    </view>
	</view>
</template>

<script>
    import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import withPlaceholder from '@/components/withPlaceholder/withPlaceholder.vue';
    
    import shareData from "./../shareData.js";
    import { serviceType } from "@/common/globalData.js";
    
    import Location from '@/common/classes/Location.js';
    import Address from '@/common/classes/Address.js';
    import Vue from 'vue';
    
    let page;
    const app = getApp();
    
    const titles = {
        [serviceType.HELP_DELIVER]: ['取件地址', '送件地址'],
        [serviceType.HELP_BUY]: ['送件地址'],
        [serviceType.OTHERS]: ['服务地址'],
    }
    
    const detailFormUrls = {
        [serviceType.HELP_DELIVER]: './../detailForms/helpDeliver',
        [serviceType.HELP_BUY]: './../detailForms/helpBuy',
        [serviceType.OTHERS]: './../detailForms/others',
    }
    
	export default {
        components: {
            uniNavBar, uniIcons, withPlaceholder
        },
		data() {
			return {
                title: '地址信息',
                colorMain: '',
                address: null,
                save: false,
			}
		},
		methods: {
            clickBack: function() {
                uni.showModal({
                    title: '提示',
                    content: '是否放弃此次编辑？',
                    confirmText: '确认',
                    cancelText: '取消',
                    complete: (res) => {
                        if (res.confirm) {
                            uni.navigateBack();
                        }
                    }
                    
                })  
            },
			chooseLocation: async function() {
                try {
                    const argument = {
                        latitude: undefined,
                        longitude: undefined,
                    };
                    if (page.address.location.longitude) {
                        argument.longitude = page.address.location.longitude;
                        argument.latitude = page.address.location.latitude;
                    }
                    let res = await uni.chooseLocation(argument);
                    console.log(res)
                    
                    const location = page.address.location;
                    location.longitude = res[1].longitude;
                    location.latitude = res[1].latitude;
                    location.address = res[1].address;
                    location.name = res[1].name;
                    
                } catch(e) {
                    console.log(e)
                    uni.showToast({
                        title: '地址选择失败，请重新尝试',
                        icon: 'none'
                    })
                }
                
                console.log(location)
            },
            
            sexChange: function(e) {
                page.address.sex = e.detail.value;
            },
            
            confirm: function() {
                
                let notice;
                
                if (!app.globalData.dev) {
                   if (!page.address.location.isValid()) {
                       notice = '请选择地址';
                   } else if (!page.address.location.hasDetail()) {
                       notice = '请填写地址详情';
                   } else if (!page.address.hasName()) {
                       notice = '请填写联系人姓名或昵称';
                   } else if (!page.address.hasSex()) {
                       notice = '请选择联系人性别（用于称呼）';
                   } else if (!page.address.hasValidTel()) {
                       notice = '请填写正确联系方式';
                   } 
                }
                
                if (notice) {
                    uni.showToast({
                        icon: 'none',
                        title: notice,
                    })
                } else {

                    if (page.save) {
                        page.saveToAddressBook()
                    }
                    
                    Vue.set(shareData.address, shareData.currentAddressIdx, page.address);
                    Vue.set(shareData.completed, shareData.currentAddressIdx, true);
                    
                    if (shareData.status != 0) {
                        uni.navigateBack();
                    } else if (shareData.addressCompleted()) {
                        shareData.status = 1;
                        uni.redirectTo({
                            url: detailFormUrls[shareData.serviceType],
                        })
                    } else {
                        shareData.currentAddressIdx++;
                        uni.navigateBack();
                    }
                }
            }
		},
        onLoad: function(opt) {
            page = this;
 
            page.title = titles[shareData.serviceType][shareData.currentAddressIdx];

            page.colorMain = app.globalData.colorMain;
            
            page.address = new Address();
            page.address.copy(shareData.address[shareData.currentAddressIdx]);
            
        }
	}
</script>

<style>
    @import url("@/common/style/form.css");
    .navBar {
        font-size: 2em;
    }
    
    .formItemIcon {
        position: relative;
        bottom: .2em;
    }
    
   
    
    .chooseLocation {
        width: 75vw;
    }
    
    .locationDetail {
        width: 80vw;
    }
    
    .tel {
        width: 80vw;
    }
    
    .name {
        width: 8em;
    }
    
    .radio {
        transform: scale(0.7);
    }
    
    .confirmButton {
        background-color: var(--color-main);
        margin: auto;
        width: 80%;
        display: flex;
        align-items: center;
        justify-content: center;
        
        height: 2em;
        font-size: 1.2em;
        font-weight: 600;
        border-radius: 1.2em;
        color: white;
        margin: .5em
    }
    
    .buttonText {

        text-align: center;
        width: 70%
    }
</style>
