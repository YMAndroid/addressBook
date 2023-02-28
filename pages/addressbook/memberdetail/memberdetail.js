// pages/user/user.js
var _app = getApp();
const constants = require('../../../utils/constants')
const optType = {
    msg: 1,
    voice: 2,
    video: 3,
    ambientv: 4,
    monitor: 5,
    monitor_send: 6,
    phone: 7,
    firends: 8
}
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        bottomOpt: [
            { name: "消息", icon: "/image/actfriendinfo_msg.png", type: optType.msg },
            { name: "语音", icon: "/image/actfriendinfo_voice.png", type: optType.voice },
            { name: "视频", icon: "/image/actfriendinfo_video.png", type: optType.video },
            { name: "监听", icon: "/image/ambientv.png", type: optType.ambientv },
            { name: "监视", icon: "/image/monitor.png", type: optType.monitor },
            { name: "回传", icon: "/image/monitor_send.png", type: optType.monitor_send },
            { name: "手机", icon: "/image/actfriendinfo_phone.png", type: optType.phone },
            { name: "好友", icon: "/image/add_firends.png", type: optType.firends }
        ],
        webViewUrl: "",
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log("options:", options)
        this.setData({
            userInfo: JSON.parse(options.userInfo)
        })
    },
    copyInfo() {
        console.log("ppppp:", this.data.userInfo)
        wx.setClipboardData({
            data: this.data.userInfo.mobile//需要复制的文本
        })
    },

    optClick(e) {
        console.log("e==>", e);
        switch (e.currentTarget.dataset.type) {
            case optType.msg:
                break;
            case optType.voice:
                let url = `${constants.webViewUrl}?loginName=${wx.getStorageSync('userInfo').loginName}&memNum=${this.data.userInfo.id}&optType=voice`;
                console.log("url===>", url);
                this.setData({
                    webViewUrl: url
                })
                break;
            case optType.video:
                break;
            case optType.ambientv:
                break;
            case optType.monitor:
                break;
            case optType.monitor_send:
                break;
            case optType.phone:
                break;
            case optType.firends:
                break;
        }
    },

    /**
   * 用户点击右上角分享
   */
    onShareAppMessage: function () {
    }
})
