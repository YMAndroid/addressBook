// pages/me/me.js
let itemType = {
    map: 1
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loginName: "",
        listMenu: [
            { name: "地图", icon: "/image/map.png", type: 1 }
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

    itemClick(e){
        console.log("ellllll===>",e.currentTarget.dataset.type)
        let type = e.currentTarget.dataset.type;
        switch(type){
            case itemType.map:
                wx.navigateTo({
                  url: '/pages/map/map',
                })
                break;
        }
    }
})