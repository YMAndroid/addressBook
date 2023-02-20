// pages/live/liveh5/liveh5.js
const constants = require('../../../utils/constants')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rtcUrl: '',
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            rtcUrl: `${constants.liveH5}?rtcUrl=${constants.webRtc}${options.name}`
        })
        
    },

    onWebLoad() {
        console.log("onWebLoad===>", this.data.rtcUrl)
    },

    onWebError(e) {
        console.log("onWebError", e)
    }
})