<template>
	<view class="root mask">
		<view class="body" :class="{fadeOut: outFlag}">
            <view class="header">
                <view class="back" @click="cancel">取消</view>
                <view class="title">{{ title }}</view>
                <view class="confirm" @click="confirm">确认</view>
            </view>
            <picker-view indicator-style="height: 90rpx;" :value="value" @change="bindChange">
                <picker-view-column>
                    <view class="item" v-for="(day,index) in days">{{day}}</view>
                </picker-view-column>
                <picker-view-column>
                    <view class="item" v-for="(hour,index) in hours">{{hour}}</view>
                </picker-view-column>
                <picker-view-column>
                    <view class="item" v-for="(minute,index) in minutes">{{minute}}</view>
                </picker-view-column>
            </picker-view>
        </view>
	</view>
</template>

<script>
    const MINUTE_TIME = 1000 * 60;
    const HOUR_TIME = 60 * MINUTE_TIME;
    const DAY_TIME = 24 * HOUR_TIME;
    
    let that;
    
    let currentTime;
    let dayBaseTime;
    
    
	export default {
        name: 'timePicker',
        props: {
            title: {
                type: String,
                default: '选择时间',
            },
            rightNowString: {
                type: String,
                default: '马上取件',
            },
            forwardDayCount: {
                type: [Number, String],
                default: 5,
            }
        },
		data() {
			return {
                value: [0, 0, 0],
                
				days: null,
                hours: null,
                minutes: null,
                
                staticHours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
                dynamicHours: null,
                staticMinutes: ['00', '10', '20', '30', '40', '50'],
                dynamicMinutes: [],
                
                outFlag: false,
                
			};
		},
        created: function() {
            that = this;
            
            
            const date = new Date();
            
            currentTime = new Date(date - 0);
            
            that.dynamicHours = that.staticHours.slice(date.getHours()+1);
            that.dynamicHours.unshift(that.rightNowString);
            
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            const dateNumber = date - 0;
            dayBaseTime = [];
            for (let i = 0; i < that.forwardDayCount; i++) {
                dayBaseTime.push(dateNumber + (i*DAY_TIME));
            }
            that.days = ['今天'];
            for (let i = 1; i < that.forwardDayCount; i++) {
                let theDate = new Date(dayBaseTime[i]+1000)
                that.days.push((theDate.getMonth()+1) + '月' + theDate.getDate() + '日');
            }
            
            that.hours = that.dynamicHours;
            that.minutes = that.dynamicMinutes;
            that.value = [0, 0, 0];
        },
        methods: {
            bindChange: function(e) {
                const newValue = e.detail.value;
                // console.log(that.value);
                // console.log(newValue)
                if (newValue[0] != that.value[0]) {
                    if (newValue[0] == 0) {
                        that.hours = that.dynamicHours;
                        that.minutes = that.dynamicMinutes;
                        that.value.splice(1, 1, 0);
                        that.value.splice(2, 1, 0);
                    } else if (that.value[0] == 0) {
                        that.hours = that.staticHours;
                        that.minutes = that.staticMinutes;
                        that.value.splice(1, 1, 0);
                        that.value.splice(2, 1, 0);
                    } 
                    that.value.splice(0, 1, newValue[0]);
                } else if ((newValue[0] == 0) && (newValue[1] != that.value[1])) {
                    if (newValue[1] == 0) {
                        that.minutes = that.dynamicMinutes;
                        that.value.splice(2, 1, 0);
                    } else if (that.value[1] == 0) {
                        that.minutes = that.staticMinutes;
                        that.value.splice(2, 1, 0);
                    }
                    that.value.splice(1, 1, newValue[1]);
                } else {
                    that.value.splice(2, 1, newValue[2]);
                }
            },
            
            getSelectedTimestamp: function() {
                let timestamp = dayBaseTime[that.value[0]];
                if (that.value[0] == 0) {
                    timestamp += (that.value[1]+currentTime.getHours()) * HOUR_TIME;
                    if (that.value[1] == 0) {
                        let minute = currentTime.getMinutes();
                        timestamp += (minute - minute%10) * MINUTE_TIME;
                    } else {
                        timestamp += that.value[2]*10*MINUTE_TIME;
                    }
                } else {
                    timestamp += that.value[1]*HOUR_TIME;
                    timestamp += that.value[2]*10*MINUTE_TIME; 
                }
                return timestamp;
            },
            
            fadeOut: function() {
                that.outFlag = true;
                setTimeout(function() {
                    that.outFlag = false;
                }, 1500);
            },
            
            confirm: function() {
                that.fadeOut();
                let timestamp = that.getSelectedTimestamp();
                setTimeout(function() {
                    that.$emit('exit', {
                        valid: true,
                        value: timestamp,
                    });
                }, 300)
                
            },
            
            cancel: function() {
                that.fadeOut();
                setTimeout(function() {
                    that.$emit('exit', {
                        valid: false,
                    });
                }, 300)

            },
        }
	}
</script>

<style scoped>
    
    @import url("@/common/style/formInputComponent.css");
    
    picker-view {
        width: 750rpx;
        height: 360rpx;
        
        text-align: center;
    }
    
    .item {
        padding: auto;
        line-height: 80rpx;
    }
    
</style>
