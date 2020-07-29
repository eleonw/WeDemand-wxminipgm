<template>
    <view class="root">
    <view class="component">
        <view :class="['tabItem', {selected: activeIndex == item.index}]" v-for="item in tabs" @click.stop="switchTab(item.index)">
            <view>{{ item.text }}</view>
            <view class="bottomLine" :style="[{backgroundColor: bottomLineColor}, {visibility: activeIndex==item.index?'visible':'hidden'}]"></view>
        </view>
    </view>
	</view>
</template>

<script>
	export default {
        name: 'topTabBar',
        props: {
            value: {
                type: [Number, String],
                default: 0
            },
            tabs: {
                type: Array,
                default: []
            },
            bottomLineColor: {
                type: String,
                default: 'black'
            }
        },
		data() {
			return {
                activeIndex: this.value,
				bottomLineStyle: {
                    'background-color': this.bottomLineColor,
                },
                tabBarStyle: {
                    width: this.width,
                    'background-color': this.backgroundColor,
                }
			};
		},
        methods: {
            switchTab(index) {
                this.activeIndex = index;
                this.$emit('switchTab', {index: index});
                this.$emit('input', index);
                console.log('tab change to: ' + index)
            }
        }
	}
</script>

<style scoped>

   .component {
        z-index: 998;
        height: var(--height-toptabbar);
        background-color: transparent;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-evenly
    }
    
    .tabItem {
        height: 100%;
        background-color: transparent;
        flex-grow: 1;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: center;
    }
    
    .selected {
        font-size: 1.1em;
        font-weight: 700;
    }
    
    .bottomLine {
        height: 0.2em;
        width: 4em;
    }
    
    
</style>
