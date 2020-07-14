<template>
	<view class="page">
		<uni-nav-bar class="navBar" left-icon="back" :title="title" shadow="true" fixed="true" statusBar="true" @clickLeft="clickBack"></uni-nav-bar>
        <view class="form">
            
            <view class="item" @click="chooseLocation">
                <uni-icons class="itemIcon" type="location"></uni-icons>
                
            
                <view class="itemMain">
                    <textarea class="chooseLocation" disabled="true" :value="address.location.name==''?address.location.address:address.location.name" placeholder="点击选择地址" auto-height="true"></textarea>
                    <uni-icons type="forward"></uni-icons>
                </view>
            </view>
            
            <view class="item">

                <uni-icons class="itemIcon" type="home"></uni-icons>


                <view class="itemMain">
                    <input placeholder="楼层门牌号" maxlength="20" type="text" v-model="address.location.extra"></input>
                </view>
            </view>
            
            <view class="item">
            
                <uni-icons class="itemIcon" type="person"></uni-icons>
            
                <view class="itemMain">
                    <input class="name" placeholder="姓名或昵称" maxlength="10" type="text" v-model="address.name"></input>
                    <radio-group>
                        <label class="radio">
                            <radio class="radio" value="0" :checked="address.gender==0" :color="colorMain"></radio><text>男士</text>
                        </label>
                        <label class="radio">
                            <radio class="radio" value="1" :checked="address.gender==1" :color="colorMain"></radio><text>女士</text>
                        </label>
                    </radio-group>
                </view>
            </view>
            
            <view class="item">
            
                <uni-icons class="itemIcon" type="phone"></uni-icons>
            
                <view class="itemMain">
                    <input placeholder="联系电话" type="number" maxlength="11" v-model="address.tel"></input>
                </view>
            </view>
            
            <view class="item" style="justify-content: center">
                <view class="confirmButton" @click="confirm">
                    <view class="buttonText">确&nbsp&nbsp定</view>
                </view>
            </view>
            
        </view>
	</view>
</template>

<script>
    import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import Location from '@/common/classes/Location.js';
    import Address from '@/common/classes/Address.js';
    
    let page;
    const app = getApp();
    
	export default {
        components: {
            uniNavBar, uniIcons
        },
		data() {
			return {
                title: '地址信息',
                colorMain: '',
                address: null,
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
                    // if (page.address.location.longitude) {
                    //     argument.longitude = page.address.location.longitude;
                    //     argument.latitude = page.address.location.latitude;
                    // }
                    let res = await uni.chooseLocation(argument);
                    page.location = new Location(res[1].longitude, res[1].latitude, res[1].address, res[1].name)
                    console.log(res);
                } catch(e) {
                    console.log(e)
                    uni.showToast({
                        title: '地址选择失败，请重新尝试',
                        icon: 'none'
                    })
                }
                
                console.log(location)
            },
            confirm: function() {
                uni.showModal({
                    content: '是否保存地址到地址簿',
                    confirmText: '是',
                    cancelText: '否',
                    success: async function() {
                        await uni.showToast({
                            title: '保存了',
                        })
                        await uni.showToast({
                            title: '假装回去了'
                        })
                    },
   
                })
            }
		},
        onLoad: function(opt) {
            page = this;

            page.title = opt.title;
            page.colorMain = app.globalData.colorMain;
            
            const location = JSON.parse(opt.location)
            
 
            if (location) {
                Object.setPrototypeOf(location, Location)
                page.address = new Address(location);
            } else {
                page.address = new Address();
            }
            
        }
	}
</script>

<style>    
    .navBar {
        font-size: 2em;
    }
    
    .form {

        width: 100%;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: flex-start;
        
        background-color: white;
    }
    
    .item {

        
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        
        width: 100%;
    }
    
    .itemIcon {

        
        text-align: center;
        width: 1.5em;
        height: 1.5em;
        margin: .5em;
    }
    
    .itemMain { 
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        
        min-height: 3em;
        width: 85%;
        height: 100%;
        margin-right: .5em;
        
        border-bottom: .1em solid var(--color-divided);

    }
    
    .chooseLocation {
        width: 75vw;
    }
    
    .name {
        width: 10em;
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
