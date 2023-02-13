// pages/addressbook/group/group.js
const httpUtils = require('../../../utils/httpUtils')
const ui = require('../../../utils/ui')
Page({

    /**
     * 页面的初始数据
     */
    data: {
         //群组列表
         groupList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getGroupList();
    },
    getGroupList() {
        let data1 = {
            loginName: wx.getStorageSync('userInfo').loginName
        }
        let obj = {
            method: "POST",
            showLoading: true,
            url: `/api/group/usergrouplist`,
            message: "加载中...",
            data: data1,
        }
        httpUtils.request(obj).then(res => {
            console.log("获取的群组：",res);
            if(res.data.code == 0){
                this.setData({
                    groupList: res.data.data ? res.data.data : []
                })
            }
        }).catch(err => {
            console.log('ERROR')
        });
    },
})