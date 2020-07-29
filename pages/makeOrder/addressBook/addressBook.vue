<template>
	<view class="root">
    <view class="page">
        <view class="form">
            <view v-for="item in address" class="formItem">
                <view class="formItemBlock">
                    <view class="addressMain">
                        {{ (item.location.name==''?item.location.name:item.location.address) + ' ' + item.location.detail }}
                    </view>
                    <view class="addressSub">
                        {{ item.name + ' ' + item.tel }}
                    </view>
                </view>
            </view>
        </view>
        
		this is address book
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				address: [new Address()],
			}
		},
        created: function() {
            
        },
		methods: {
			
		}
	}
</script>

<style>
    @import url("@/common/style/form.css");
</style>
