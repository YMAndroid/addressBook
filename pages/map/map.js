// pages/map/map.js
const constants = require('../../utils/constants')
const httpUtils = require('../../utils/httpUtils')
const ui = require('../../utils/ui')
const optType = {
    msg: 1,
    voice: 2,
    video: 3,
    ambientv: 4,
    monitor: 5,
    trajectory: 6,
    position: 7,
};
let originMarker = { // 绘制浮标，传入JSON支持多个
    iconPath: "/image/location.png", //浮标图片路径，推荐png图片
    id: 0, // Id支持多个，方便后期点击浮标获取相关信息
    latitude: 0, // 经度
    longitude: 0, //纬度
    width: 50, // 浮标宽度
    height: 50, // 浮标高度
    title: "",
    callout: {
        content: "",
        display: 'ALWAYS',
        color: '#333333',
        bgColor: '#fff',
        padding: 10,
        borderRadius: 10,
        borderColor: '#fff',
        fontSize: 16,
        borderWidth: 5,
        textAlign: 'center',
    }
};
let timeType = "start";
let originInterval = 5;
Page({

    /**
     * 地图页面的初始数据
     */
    data: {
        //地图缩放等级
        scale: 16,
        bottomOpt: [
            { name: "消息", icon: "/image/actfriendinfo_msg.png", type: optType.msg },
            { name: "语音", icon: "/image/actfriendinfo_voice.png", type: optType.voice },
            { name: "视频", icon: "/image/actfriendinfo_video.png", type: optType.video },
            { name: "监听", icon: "/image/ambientv.png", type: optType.ambientv },
            { name: "监视", icon: "/image/monitor.png", type: optType.monitor },
            { name: "轨迹", icon: "/image/ic_external_stat.png", type: optType.trajectory },
            { name: "位置", icon: "/image/add_firends.png", type: optType.position },
        ],
        //标记物
        markers: [],
        //轨迹列表
        polyline: [],
        //当前位置
        latitude: 39.91488908,
        longitude: 116.40387397,
        //上报定位弹框
        showReportModal: false,
        //轨迹弹框
        showTrackModal: false,
        //轨迹开始时间
        startTime: "",
        //轨迹结束时间
        endTime: "",
        //轨迹输入框绑定用户编号
        traceNum: "",
        //时间选择器模式
        mode: "dateTime",
        //用户编号
        userPositionNum: "",
        //数据时间
        dataTime: "",
        //电量
        battery: "",
        //定位人员编号
        intervalNum: "",
        //定位时间间隔
        interval: 5,
        //是否开启卫星图
        enableSatellite: false,
        //是否开启路线图
        enableTraffic: false,
    },
    markertap(e) {
    },

    onReady: function (e) {
        this.mapCtx = wx.createMapContext('map')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log("onLoad===>");
        let num = wx.getStorageSync('userPositionNum');
        let loginName = wx.getStorageSync('userInfo').loginName;
        this.setData({
            userPositionNum: num ? num : loginName
        })
        //获取当前位置
        this.getCurLocation();
    },

    getCurLocation() {
        wx.getLocation({
            type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
            success: res => {
                console.log("位置success:", res)
                this.setData({
                    longitude: res.longitude,
                    latitude: res.latitude
                })
            },
            fail: function (res) {
                console.log("位置fail:", res)
            },
            complete: function (res) {
                console.log("位置complete:", res)
            }
        })
    },

    optClick(e) {
        console.log("e==>", e);
        switch (e.currentTarget.dataset.type) {
            case optType.msg:
                break;
            case optType.voice:
                wx.navigateTo({
                    url: `/pages/webview/webview?webViewUrl=${constants.webViewUrl}?loginName=${wx.getStorageSync('userInfo').loginName}&memNum=${this.data.userPositionNum}&optType=$voice`,
                })
                break;
            case optType.video:
                break;
            case optType.ambientv:
                break;
            case optType.monitor:
                break;
            case optType.trajectory:
                this.getTerminalTrac();
                break;
            case optType.position:
                wx.showModal({
                    title: '地图定位',
                    editable: true,
                    placeholderText: "号码",
                    content: this.data.userPositionNum,
                    success: res => {
                        console.log("res===>", res)
                        if (res.confirm && res.content) {
                            wx.setStorageSync('userPositionNum', res.content)
                            this.setData({
                                userPositionNum: res.content
                            })
                            this.getUserPosition();
                        }
                    }
                })
                break;
        }
    },

    //获取位置
    getUserPosition() {
        let obj = {
            method: "POST",
            showLoading: true,
            url: `${constants.getTerminalLocationApi}?udn=${this.data.userPositionNum}&id=1`,
            message: "加载中...",
        }
        httpUtils.request(obj).then(res => {
            if (res.data.code == 0) {
                if (res.data.rows.length > 0) {
                    //设置market 
                    originMarker.latitude = res.data.rows[0].latitude;
                    originMarker.longitude = res.data.rows[0].longitude;
                    originMarker.callout.content = this.data.userPositionNum;
                    originMarker.title = this.data.userPositionNum;
                    let tempArr = [];
                    tempArr.push(originMarker);
                    this.setData({
                        latitude: res.data.rows[0].latitude,
                        longitude: res.data.rows[0].longitude,
                        markers: tempArr,
                        battery: res.data.rows[0].battery,
                        dataTime: res.data.rows[0].datatime,
                    })
                } else {
                    ui.showToast("无轨迹数据!")
                }
            }
        }).catch(err => {
            console.log('ERROR')
        });
    },

    //获取轨迹按钮
    getTerminalTrac() {
        this.setData({
            showTrackModal: true,
            traceNum: this.data.userPositionNum
        })
    },

    //轨迹人员号码输入框
    traceNumInput(e) {
        console.log("e===>", e.detail.value);
        this.setData({
            traceNum: e.detail.value
        })
    },

    //获取轨迹列表
    getTrackList() {
        wx.setStorageSync('userPositionNum', this.data.traceNum);
        this.setData({
            userPositionNum: this.data.traceNum,
            showTrackModal: false,
        })
        let obj = {
            method: "POST",
            showLoading: true,
            url: `${constants.getTerminalTrackApi}?udn=${this.data.userPositionNum}&sender=${this.data.startTime}&receiver=${this.data.endTime}`,
            message: "加载中...",
            // data: {
            //     udn: this.data.userPositionNum,
            //     sender: this.data.startTime,
            //     receiver: this.data.endTime
            // }
        }
        httpUtils.request(obj).then(res => {
            if (res.data.code == 0) {
                let length = res.data.rows.length;
                ui.showToast(length == 0 ? '无轨迹数据' : `共${length}个轨迹点!`)
                if (res.data.rows.length > 1) {
                    let point = [];
                    for (let i = 0; i < res.data.rows.length; i++) {
                        point.push({
                            latitude: res.data.rows[i].latitude,
                            longitude: res.data.rows[i].longitude
                        })
                    }
                    let pointLine = [
                        {
                            points: point,
                            color: "#FF0000DD",
                            width: 2,
                            dottedLine: false,
                        }
                    ]
                    this.setData({
                        polyline: pointLine
                    })
                }
            }
        }).catch(err => {
            console.log('ERROR')
        });
    },

    //地图获取当前位置
    locationClick() {
        this.getCurLocation();
    },

    //上报轨迹按钮
    reportClick() {
        this.setData({
            showReportModal: true,
            intervalNum: this.data.userPositionNum,
            interval: originInterval,
        })
    },
    //上报轨迹弹框开始
    modalReportCancel() {
        //ui.showToast("")
        if (this.uploadTrace) {
            originInterval = this.data.interval;
            wx.setStorageSync('userPositionNum', this.data.intervalNum)
            this.setData({
                showReportModal: false,
                userPositionNum: this.data.intervalNum,
            })
            //开启定时器
        }
    },
    //上报轨迹弹框取消
    modalReportConfirm(e) {
        this.setData({
            showReportModal: false,
            intervalNum: this.data.userPositionNum,
            interval: originInterval
        })
    },
    //上报轨迹弹框停止按钮
    modalReportStop() {
        if (this.uploadTrace) {
            this.setData({
                showReportModal: false,
                intervalNum: this.data.userPositionNum,
                interval: originInterval
            })
            //取消定时器
        }
    },

    //上报轨迹条件校验
    uploadTrace() {
        let result = true;
        if (this.data.intervalNum == "") {
            ui.showModal("号码不能为空!")
            return !result
        }
        if (this.data.interval == "") {
            ui.showModal("定位间隔不能为空!")
            return !result
        }
        return result
    },

    //轨迹弹框确定按钮
    trackConfirm(e) {
        if (this.data.traceNum == "") {
            ui.showToast("号码不能为空!");
            return;
        }
        console.log("开始时间:", this.data.startTime)
        if (this.data.startTime == "") {
            ui.showToast("开始时间不能为空!");
            return;
        }
        if (this.data.endTime == "") {
            ui.showToast("结束时间不能为空!");
            return;
        }
        this.getTrackList();
    },

    //轨迹弹框取消按钮
    trackCancel(e) {
        console.log("tracCancel===>", e)
        this.setData({
            showTrackModal: false
        })
    },

    //选择时间
    getTime(e) {
        timeType = e.currentTarget.dataset.type;
    },
    //时间选择器
    onPickerChange(e) {//返回回调函数
        let time = e.detail.value;
        if (timeType == "start") {
            this.setData({
                startTime: time
            })
        } else {
            this.setData({
                endTime: time
            })
        }
    },
    //定位输入编号
    inputNum(e) {
        console.log("inputNum e===>", e)
        this.setData({
            intervalNum: e.detail.value
        })
    },

    //定位输入间隔
    inputInterval(e) {
        this.setData({
            interval: e.detail.value
        })
    },

    //地图放大缩小
    zoomOut(e) {
        console.log("zoomOut==>", e);
        if (e.currentTarget.dataset.type == 'add') {
            if (this.data.scale < 20) {
                this.setData({
                    scale: this.data.scale + 1
                })
            }
        } else {
            if (this.data.scale > 3) {
                this.setData({
                    scale: this.data.scale - 1
                })
            }
        }
    },

    mapType() {
        this.setData({
            enableSatellite: !this.data.enableSatellite
        })
    },

    routeType() {
        this.setData({
            enableTraffic: !this.data.enableTraffic
        })
    },

    /**
   * 用户点击右上角分享
   */
    onShareAppMessage: function () {
    }
})