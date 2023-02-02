// pages/user/user.js
var _app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {}
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log("options:",options)
        this.setData({
            userInfo: JSON.parse(options.userInfo)
        })
    },
    copyInfo() {
        console.log("ppppp:",this.data.userInfo)
        wx.setClipboardData({
            data: this.data.userInfo.mobile//需要复制的文本
        })
    },
})
