// pages/messgaerecord/messgaerecord.js
const httpUtils = require('../../utils/httpUtils')
const ui = require('../../utils/ui')
const constants = require('../../utils/constants')
const utils = require('../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        messageRecordList: [],
        loginName: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            loginName: wx.getStorageSync('userInfo').loginName
        })
        this.getMessageRocord();
    },

    getMessageRocord() {
        let obj = {
            method: "POST",
            showLoading: true,
            url: `${constants.messageRecordApi}?udn=${wx.getStorageSync('userInfo').loginName}`
        }
        httpUtils.request(obj).then(res => {
            if (res.data.code == 0) {
                this.setData({
                    messageRecordList: res.data.rows
                })
                console.log("messageRecordList===》",this.data.messageRecordList)
            }
        }).catch(err => {
            console.log('ERROR')
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
    }
})