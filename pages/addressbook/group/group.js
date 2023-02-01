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
        let obj = {
            method: "POST",
            showLoading: true,
            url: `/api/group/list`,
            message: "加载中..."
        }
        httpUtils.request(obj).then(res => {
            console.log("获取的群组：",res);
            this.setData({
                groupList: res.data.rows ? res.data.rows : []
            })
        }).catch(err => {
            console.log('ERROR')
        });
    },
})