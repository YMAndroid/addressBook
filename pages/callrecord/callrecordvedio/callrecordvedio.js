const ui = require('../../../utils/ui')
Page({
    onLoad(options) {
        console.log("options:", options);
        this.setData({
            src: options.src,
        })
        wx.setNavigationBarTitle({
            title: options.title,
        })
    },
    onReady() {
        this.videoContext = wx.createVideoContext('myVideo');
        this.videoContext.play()
    },
    data: {
        src: '',
    },

    bindPlayVideo() {
        console.log('1')
        this.videoContext.play()
    },

    videoErrorCallback(e) {
        console.log('视频错误信息:')
        console.log(e.detail.errMsg);
        ui.showToast(`视频错误信息:${e.detail.errMsg}`);
    }
})