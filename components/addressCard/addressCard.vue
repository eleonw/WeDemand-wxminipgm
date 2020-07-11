<template>
    <view class="addressCard">
        <view class="item">
            <textIcon class="itemIcon" :text="static.from.text" :backgroundColor="static.from.color" color="white" diameter="1.2em"></textIcon>
            <view class="itemMain">
                <view class="itemMainDtl borderRight" @click="this.$emit('address1Click')">
                    <textarea :value="address1.location.name==''?address1.location.address:address1.location.name + address1.location.extra" class="itemMainDtlLocation" disabled="true" :placeholder="static.from.placeholder"  auto-height="true"></textarea>
                    <view class="itemMainDtlContact" v-if="address1.name!=''">
                        {{address1.name}} {{address1.tel}}
                    </view>
                </view>
                <uni-icons type="list" @click="this.$emit('list1Click')"></uni-icons>
            </view>
            
        </view>
        
        <view class="item" v-if="single==false">
            <textIcon class="itemIcon" :text="static.to.text" :backgroundColor="static.to.color" color="white" diameter="1.2em"></textIcon>
            <view class="itemMain borderTop">
                <view class="itemMainDtl borderRight" @click="this.$emit('address2Click')">
                    <textarea :value="address2.location.name==''?address2.location.address:address2.location.name + address2.location.extra" class="itemMainDtlLocation" disabled="true" :placeholder="static.to.placeholder" auto-height="true"></textarea>
                    <view class="itemMainDtlContact" v-if="address2.name!=''">
                        {{address2.name}} {{address2.tel}}
                    </view>
                </view>
                <uni-icons type="list" @click="this.$emit('list2Click')"></uni-icons>
            </view>
        </view>
        
    </view>

</template>

<script>
    import textIcon from "@/components/textIcon/textIcon.vue";
    import uniIcons from "@/components/uni-icons/uni-icons.vue";
    
	export default {
        name: 'addressCard',
        components: {
            textIcon, uniIcons
        },
        props: {
            single: {
                type: Boolean,
                default: false,
            },
            static: {
                type: Object,
                default: {
                    from: {
                        color: 'green',
                        text: '取',
                        placeholder: '请选择取货地址'
                    },
                    to: {
                        color: 'red',
                        text: '收',
                        placeholder: '请选择收货地址'
                    }
                }
            },
            address1: {
                type: Object,
                default: {
                    location: {
                        longitude: '',
                        latitude: '',
                        address: '',
                        name: '',
                        extra: '',
                    },
                    name: '',
                    tel: ''
                },
                required: true
            },
            address2: {
                type: Object,
                default: {
                    location: {
                        longitude: '',
                        latitude: '',
                        address: '',
                        name: '',
                        extra: '',
                    },
                    name: '',
                    tel: ''
                },
                required: true
            },
        },
		data() {
			return {
				
			};
		}
	}
</script>

<style>
    .addressCard {
        background-color: white;
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        align-items: center;

        width: 90vw;

        border-radius: 5vw;

        line-height: 3em;
        
    }
    
    .item {
/*       background-color: red; */
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
        
        width: 100%;
    }
    
    .itemIcon {
        margin-left: .4em;
        margin-right: .3em;
        
    }
    
    .itemMain {
  /*    background-color: yellow; */
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-evenly;
        align-items: center;
        
        width: 85%;
        padding: .5em 0 .5em 0;
        margin-right: .4em;
    }
    
    .itemMainDtl {
/*      background-color: blue; */
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: flex-start;
        
        width: 90%;
        margin-right: .2em
        
    }
    

    .itemMainDtlLocation {
/*       background-color: orange; */
        width: 100%;
    
    }
    
    .itemMainDtlContact {
/*        background-color: pink; */
        line-height: 1em;
        font-size: .7em;
        letter-spacing: .05em;
        width: 100%
    }
</style>
