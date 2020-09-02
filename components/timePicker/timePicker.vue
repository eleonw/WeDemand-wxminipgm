<template>
	<view class="root">
		<view class="body" :class="{fadeOut: outFlag}">
            <view class="header">
                <uni-icons type="closeempty" size="24" class="back" @click="cancel"></uni-icons>
                <view class="title">{{ title }}</view>
                <uni-icons type="checkmarkempty" size="24" class="confirm" @click="confirm"></uni-icons>
            </view>
            <picker-view indicator-style="height: 90rpx;" :value="pickerValue" @change="bindChange">
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
            value: {
                type: Number,
                default: null,
            },
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
            },
            startTimestamp: {
                type: Number,
            },
            endTimestamp: {
                type: Number,
            }
        },
		data() {
			return {
                pickerValue: [0, 0, 0],
                
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
            that.pickerValue = [0, 0, 0];
        },
        
        methods: {
            bindChange: function(e) {
                const newPickerValue = e.detail.value;
                if (newPickerValue[0] != that.pickerValue[0]) {
                    if (newPickerValue[0] == 0) {
                        that.hours = that.dynamicHours;
                        that.minutes = that.dynamicMinutes;
                        that.pickerValue.splice(1, 1, 0);
                        that.pickerValue.splice(2, 1, 0);
                    } else if (that.pickerValue[0] == 0) {
                        that.hours = that.staticHours;
                        that.minutes = that.staticMinutes;
                        that.pickerValue.splice(1, 1, 0);
                        that.pickerValue.splice(2, 1, 0);
                    } 
                    that.pickerValue.splice(0, 1, newPickerValue[0]);
                } else if ((newPickerValue[0] == 0) && (newPickerValue[1] != that.pickerValue[1])) {
                    if (newPickerValue[1] == 0) {
                        that.minutes = that.dynamicMinutes;
                        that.pickerValue.splice(2, 1, 0);
                    } else if (that.pickerValue[1] == 0) {
                        that.minutes = that.staticMinutes;
                        that.pickerValue.splice(2, 1, 0);
                    }
                    that.pickerValue.splice(1, 1, newPickerValue[1]);
                } else {
                    that.pickerValue.splice(2, 1, newPickerValue[2]);
                }
            },
            
            getSelectedTimestamp: function() {
                let timestamp = dayBaseTime[that.pickerValue[0]];
                if (that.pickerValue[0] == 0) {
                    timestamp += (that.pickerValue[1]+currentTime.getHours()) * HOUR_TIME;
                    if (that.pickerValue[1] == 0) {
                        let minute = currentTime.getMinutes();
                        timestamp += (minute - minute%10) * MINUTE_TIME;
                    } else {
                        timestamp += that.pickerValue[2]*10*MINUTE_TIME;
                    }
                } else {
                    timestamp += that.pickerValue[1]*HOUR_TIME;
                    timestamp += that.pickerValue[2]*10*MINUTE_TIME; 
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
                that.$emit('input', timestamp);
                setTimeout(function() {
                    that.$emit('exit', {
                        valid: true,
                        pickerValue: timestamp,
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
