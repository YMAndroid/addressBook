// pages/callrecord/callrecord.js
const httpUtils = require('../../utils/httpUtils')
const ui = require('../../utils/ui')
const constants = require('../../utils/constants')
const utils = require('../../utils/util')
const App = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        callRecordList: [],
        loginName: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            loginName: wx.getStorageSync('userInfo').loginName
        })

        //ceshi 
        //console.log("时间差:",utils.humandate("2023-02-14 21:40:37","2023-02-14 21:40:38"));
    },

    getCallRocords() {
        let obj = {
            method: "POST",
            showLoading: true,
            url: constants.callrecordListApi,
            data: { callnum: wx.getStorageSync('userInfo').loginName }
        }
        httpUtils.request(obj).then(res => {
            if (res.data.code == 0) {
                for(let i=0; i<res.data.rows.length;i++){
                    res.data.rows[i].times = utils.humandate(res.data.rows[i].billsec)
                    res.data.rows[i].isTouchMove = false
                }
                console.log("0000000===>",res.data.rows);
                this.setData({
                    callRecordList: res.data.rows
                })
                //测试

            }
        }).catch(err => {
            console.log('ERROR')
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        //console.loginName("onShow===>")
        this.getCallRocords();
    },

    jumpMessage(e){
        console.log("e===>",e.currentTarget.dataset.callobj);
    },

    deleteRocord(e){
        console.log("删除id===>",e.currentTarget.dataset.id)
    },

    touchstart: function (e) {
        //开始触摸时 重置所有删除
        let data = App.touch._touchstart(e, this.data.callRecordList) //将修改过的list setData
        this.setData({
            callRecordList: data
        })
      },
    
      //滑动事件处理
      touchmove: function (e) {
        let data = App.touch._touchmove(e, this.data.callRecordList,'id')//将修改过的list setData
        this.setData({
            callRecordList: data
        })
      },
})