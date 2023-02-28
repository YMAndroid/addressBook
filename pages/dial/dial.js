// pages/dial/dial.js
const constants = require('../../utils/constants')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        webViewUrl: constants.webViewUrl,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log('options====>', options);
    },

    onWebLoad() {
        console.log("onWebLoad===>", this)
    },

    onWebError() {
    },

    /**
   * 用户点击右上角分享
   */
    onShareAppMessage: function () {
    }

})