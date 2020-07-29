<template>
    <view class="root">
	<view class="component" :style="{'background-color': backgroundColor}">
		<view v-for="item in tabs" class="tabItem" :class="{selected: index==item.index, touching: touching==item.index}" @touchstart.stop="touchstart(item.index)" @touchend.stop="touchend(item.index)">
            <view >
                <image class="icon" mode="aspectFit" :src="item.iconPath" v-if="index==item.index"></image>
                <image class="icon" mode="aspectFit" :src="item.selectedIconPath" v-else></image>
            </view>
            <view>{{item.text}}</view>
        </view>
	</view>
    </view>
</template>

<script>
    
	export default {
        name: 'tabBar',
        props: {
            value: {
                type: [Number, String],
                default: 0
            },
            backgroundColor: {
                type: String,
                default: 'white'
            },
            color: {
                type: String,
                default: 'grey'
            },
            activeColor: {
                type: String,
                default: 'black'
            },
            tabs: {
                type: Array,
                value: []
            }
        },
		data() {
			return {
				index: this.value,
                touching: null,
			};
		},
        methods: {
            touchstart(index) {
                this.touching = index;
                
            },
            touchend(index) {
                this.index = index;
                this.$emit('input', index)
                this.$emit('tabchange', {index: index})
                this.touching = null;
            }
        },

	}
</script>

<style scoped>
    @keyframes touchItem{
        from{
            background-color: white;
        }
        to{
            background-color: grey;
        }
    }
    
    .component {
        width: 100vw;
        height: var(--height-tabbar);
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
        
        box-shadow: 0 0 3rpx 1rpx #F8F8F8;
        
    }
    
    .icon {
        width: 3.5vh;
        height: 3.5vh;
    }
    
    .tabItem {
        flex-grow: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 2vh;
        
        color: grey;
    }
    
    .selected {
        color: black;
        font-weight: 600;
        font-size: 2.1vh;
    }
    
    .touching {
        animation: 1s touchItem forwards;
    }
</style>
