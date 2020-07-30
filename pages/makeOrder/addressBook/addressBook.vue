<template>
	<view class="root">
    <view class="page">
        <view class="form">
            <view v-for="(item,idx) in address" class="formItem">
                <view class="formItemBlock">
                    <view class="addressMain">
                        {{ (item.location.name==''?item.location.name:item.location.address) + ' ' + item.location.detail }}
                    </view>
                    <view class="addressSub">
                        {{ item.name + ' ' + item.tel }}
                    </view>
                </view>
                <uni-icons type="compose" class="formItemRight" @click="modifyAddress(idx)"></uni-icons>
            </view>
        </view>
        
    </view>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    
    import { defaultLocation } from '@/common/globalData.js';
    import shareData from './../shareData.js';
    import Vue from 'vue';
    
    
    
    import Address from '@/common/classes/Address.js';
    
    let page;

    
	export default {
        components: {
            uniIcons,
        },
		data() {
			return {
				address: [new Address({
                    location: defaultLocation,
                    name: '‰∏',
                    tel: '11111111111'
                }),
                new Address({
                    location: defaultLocation,
                    name: 'yi',
                    tel: '2222221'
                })],
			}
		},
        created: function() {
            page = this;
        },
		methods: {
			modifyAddress: function(index) {
                const address = JSON.stringify(page.address[index]);
                uni.navigateTo({
                    url: './modifyAddress?address=' + address,
                })
                uni.$on('addressModify', res => {
                    switch (res.status) {
                        case 0:
                            // not modified
                            break;
                        case 1:
                            // delete the address
                            page.address.splice(index, 1);
                            break;
                        case 2:
                            // modify the address
                            page.address.splice(index, 1);
                            page.address.unshift(res.newAddress);
                            break;
                        case -1:
                            uni.showToast({
                                icon: 'none',
                                title: 'µÿ÷∑–ﬁ∏ƒ ß∞‹£¨«Î÷ÿ ‘'
                            });
                            break;
                        default:
                            console.log('invalid status');
                    }
                    uni.$off('addressModify');
                    
                })
            }
		}
	}
</script>

<style>
    @import url("@/common/style/form.css");
    
    .addressMain {
        letter-spacing: .2em;
    }
    
    .addressSub {
        font-size: .8em;
        font-weight: 300;
    }
    
    .formItem {
        width: 700rpx;
    }
</style>
