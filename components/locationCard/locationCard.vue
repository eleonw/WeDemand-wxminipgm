<template>
    <view class="container">
        <view class="row bottomLine">
            <view class="icon" :style="{'background-color': static.from.color}"><view class="iconText">{{static.from.text}}</view></view>
            <view class="information">
                <view class="detail">
                    <textarea class="location" disabled="true" :placeholder="static.from.placeholder" auto-height="true"></textarea>
                    <view class="contact">
                        万 13728084958
                    </view>
                </view>
                <image class="addressBook" src="@/static/image/icon/addressBook.png"></image>
            </view>
        </view>
        
        <view class="row">
            <view class="icon" :style="{'background-color': static.to.color}"><view class="iconText">{{static.to.text}}</view></view>
            <view class="information">
                <view class="detail">
                    <textarea class="location" disabled="true" :placeholder="static.from.placeholder" auto-height="true"></textarea>
                    <view class="contact">
                        万 13728084958
                    </view>
                </view>
                <image class="addressBook" src="@/static/image/icon/addressBook.png"></image>
            </view>
        </view>
        
    </view>

</template>

<script>
	export default {
        name: 'locationCard',
        props: {
            static: {
                type: Object,
                default: {
                    from: {
                        color: 'black',
                        text: '取',
                        placeholder: '请选择取货地址'
                    },
                    to: {
                        color: 'grey',
                        text: '收',
                        placeholder: '请选择收货地址'
                    }
                }
            },
            locationDetail: {
                type: Object,
                default: {
                    from: {
                        location: null,
                        name: null,
                        tel: null
                    },
                    to: {
                        location: null,
                        name: null,
                        tel: null
                    }
                }
            },
        },
		data() {
			return {
				
			};
		}
	}
</script>

<style>
    .container {
        border-radius: .5em;
        width: 90vw;
        padding: .5em;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: space-around;
        background-color: white;
    }
    
    .location {
        width: 100%;
/*        background-color: yellow; */
    }
    
    .row {
 /*       margin: 2em, 2em, 2em, 0; */
        padding-top: .2em;
        padding-bottom: .2em;
        width: 100%;
/*        background-color: green; */
        display: flex;
        flex-flow: row nowrap;
        align-items: baseline;
        justify-content: space-between;
    }
    
    .bottomLine {
        border-bottom: .05em grey solid
    }
    
    .icon {
        
        width: 1em;
        height: 1em;
        border-radius: .5em;

    }
    
    .iconText {
        width: 100%;
        heigth: .6em;
        margin-top: .1em;
        text-align: center;
        font-size: .6em;
        color: white;
    }
    
    .information {

        width: 90%;
/*        background-color: red; */
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-evenly;
    }
    
    .detail {
        width: 90%;
        margin-right: .2em;
        border-right: .04em solid #F8F8F8;
/*        background-color: blue; */
        display: flex;
        flex-flow: column nowrap;
        align-items: flex-start;
    }
    
    .contact {
        font-size: .7em;
/*        background-color: grey; */
    }
    
    .addressBook {
        width: 1em;
        height: 1em;
    }
</style>
