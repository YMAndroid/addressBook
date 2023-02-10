// pages/user/user.js
var _app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        groupInfo: {},
        bottomOpt: [
            {name:"语音",icon:"/image/voice.png",type:1},
            {name:"视频",icon:"/image/camera.png",type:2},
            {name:"语音会议",icon:"/image/voice_conference.png",type:3},
            {name:"视频会议",icon:"/image/video_conferece.png",type:4},
        ]
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log("options:",options)
        this.setData({
            groupInfo: JSON.parse(options.groupInfo)
        })
    },
})
