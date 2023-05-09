// pages/me/setting/setting.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listMenu: [
            { name: "版本", type: 1, value: "" },
            { name: "本机IP", type: 2, value: "" },
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //获取版本号
        this.getVersion();
        this.getIP();
    },
    //获取线上版本号
    getVersion() {
        const accountInfo = wx.getAccountInfoSync();
        let obj = this.data.listMenu[0];
        obj.value = accountInfo.miniProgram.version;
        this.setData({
            ['listMenu[0]']: obj
        })
    },
    // 获取IP地址
    getIP() {
        wx.getLocalIPAddress({
            success: res => {
                const localip = res.localip
                let obj = this.data.listMenu[1];
                obj.value = localip;
                this.setData({
                    ['listMenu[1]']: obj
                })
            }
        })
    }
})