// pages/user/user.js
var _app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        bottomOpt: [
            {name:"消息",icon:"/image/actfriendinfo_msg.png",type:1},
            {name:"语音",icon:"/image/actfriendinfo_voice.png",type:2},
            {name:"视频",icon:"/image/actfriendinfo_video.png",type:3},
            {name:"监听",icon:"/image/ambientv.png",type:4},
            {name:"监视",icon:"/image/monitor.png",type:5},
            {name:"回传",icon:"/image/monitor_send.png",type:6},
            {name:"手机",icon:"/image/actfriendinfo_phone.png",type:7},
            {name:"好友",icon:"/image/add_firends.png",type:8}
        ]
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
