// pages/user/user.js
var _app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfoObj: {}
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            userInfoObj: JSON.parse(options.userInfoObj)
        })
    },
    copyInfo() {
        console.log("ppppp:",this.data.userInfoObj)
        wx.setClipboardData({
            data: this.data.userInfoObj.phoneNum//需要复制的文本
        })
    },
})
