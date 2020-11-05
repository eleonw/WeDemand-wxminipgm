<template>
	<view class="root page">
		{{ getUserInfoString() }}
	</view>
</template>

<script>
    import { userInfo } from '@/common/globalData.js';
    
	export default {
		data() {
			return {
				
			};
		},
        
        methods: {
            getUserInfoString: function() {
                let res = '';
                for (let item in userInfo) {
                    res += item + ':' + userInfo[item] + ';';
                }
                return res;
            }
        }
	}
    
</script>

<style lang="scss">

    .page {
        background-color: var(--color-main);
        color: white;
        font-size: 40rpx;
        
        display: flex;
        justify-content: flex-end;
    }
</style>
