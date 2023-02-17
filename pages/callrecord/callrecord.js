// pages/callrecord/callrecord.js
const httpUtils = require('../../utils/httpUtils')
const ui = require('../../utils/ui')
const constants = require('../../utils/constants')
const utils = require('../../utils/util')
const App = getApp();
//声明一个公共的API接口
var audioCtx = wx.createInnerAudioContext();
let attrType = {
    voice: 1,//音频
    video: 2,//视频
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        callRecordList: [],
        loginName: "",
        isPlay: false,
        playIndex: 0,
        isPause: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            loginName: wx.getStorageSync('userInfo').loginName
        })
        audioCtx.onEnded(() => {
            console.log("监听播放结束")
            //监听音频自然播放至结束的事件
            this.setData({
                isPlay: false,
                isPause: false
            })
        })
    },

    getCallRocords() {
        let obj = {
            method: "POST",
            showLoading: true,
            url: constants.callrecordListApi,
            data: { callnum: wx.getStorageSync('userInfo').loginName }
        }
        httpUtils.request(obj).then(res => {
            if (res.data.code == 0) {
                for (let i = 0; i < res.data.rows.length; i++) {
                    res.data.rows[i].times = utils.humandate(res.data.rows[i].billsec);
                    res.data.rows[i].isTouchMove = false;
                    res.data.rows[i].callType = res.data.rows[i].recordname.includes(".wav") ? attrType.voice : attrType.video;
                    res.data.rows[i].recordname = constants.attrUrl + '/' + res.data.rows[i].recordname;
                }
                this.setData({
                    callRecordList: res.data.rows
                })
            }
        }).catch(err => {
            console.log('ERROR')
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        console.log("onShow===>")
        this.getCallRocords();
    },

    jumpMessage(e) {
        console.log("e===>", e.currentTarget.dataset.callobj);
    },

    deleteRocord(e) {
        console.log("删除id===>", e.currentTarget.dataset.id)
    },

    touchstart: function (e) {
        //开始触摸时 重置所有删除
        let data = App.touch._touchstart(e, this.data.callRecordList) //将修改过的list setData
        this.setData({
            callRecordList: data
        })
    },

    //滑动事件处理
    touchmove: function (e) {
        let data = App.touch._touchmove(e, this.data.callRecordList, 'id')//将修改过的list setData
        this.setData({
            callRecordList: data
        })
    },

    //播放
    audioPlay() {
        audioCtx.play();
        this.setData({
            isPlay: true,
            isPause: false
        })
    },
    // 停止播放
    audioPause() {
        audioCtx.pause()
        this.setData({
            isPlay: false
        })
    },

    //拖动滑块
    bindchanging(e) {
        var that = this;
        console.log(e)
        //停止播放
        audioCtx.pause();
        //设置播放时间
        that.audioCtx.seek(e.detail.value);
        that.setData({
            time: util.secondToTime(audioCtx.currentTime)//秒数转分钟与秒
        })
    },
    //拖动滑块结束
    bindchange() {
        audioCtx.play();
    },
    //页面关闭时，停止播放
    onHide() {
        console.log("uuuuonHide===>", this.data.isPlay)
        if (this.data.isPlay) {
            this.audioPause();
        }
    },
    onUnload() {
        if (this.data.isPlay) {
            this.audioPause();
        }
    },
    //设置音乐栏目默认值
    setMusic: function (index) {
        var music = this.data.callRecordList[index]
        audioCtx.src = music.recordname
        this.setData({
            'playIndex': index,
        })
    },

    itemClick(e) {
        let type = this.data.callRecordList[e.currentTarget.dataset.index].callType;
        if (this.data.callRecordList[e.currentTarget.dataset.index].billsec <= 0) {
            ui.showToast("无通话时长!");
            return;
        }
        if (type == attrType.voice) {
            if (this.data.playIndex == e.currentTarget.dataset.index && this.data.isPlay) {
                this.audioPause();
                this.setData({
                    isPause: true
                })
                return;
            }
            this.setMusic(e.currentTarget.dataset.index)
            this.audioPlay();
        } else {
            if (this.data.isPlay) {
                this.audioPause();
                this.setData({
                    isPause: true,
                    isPlay: false
                })
            }
            wx.navigateTo({
                url: `/pages/callrecord/callrecordvedio/callrecordvedio?src=${this.data.callRecordList[e.currentTarget.dataset.index].recordname}&title=${this.data.callRecordList[e.currentTarget.dataset.index].callednum}`,
            })
        }
    },
})