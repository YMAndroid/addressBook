// pages/me/me.js
let itemType = {
    map: 1,
    messageRecord: 2,
    setting: 3
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loginName: "",
        listMenu: [
            { name: "通话记录", icon: "/image/callrecord.png", type: 1 },
            { name: "消息记录", icon: "/image/workflow.png", type: 2 },
            { name: "设置", icon: "/image/setting.png", type: 3 }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            loginName: wx.getStorageSync('userInfo').loginName
        })
    },

    itemClick(e) {
        console.log("ellllll===>", e.currentTarget.dataset.type)
        let type = e.currentTarget.dataset.type;
        switch (type) {
            case itemType.map:
                wx.navigateTo({
                    url: '/pages/callrecord/callrecord',
                })
                break;
            case itemType.messageRecord:
                wx.navigateTo({
                    url: '/pages/messgaerecord/messgaerecord',
                })
                break;
            case itemType.setting:
                wx.navigateTo({
                    url: '/pages/me/setting/setting',
                })
                break;
        }
    },

    /**
   * 用户点击右上角分享
   */
    onShareAppMessage: function () {
    }
})