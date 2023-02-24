// pages/login/login.js
//index.js
//获取应用实例
const httpUtils = require('../../utils/httpUtils')
const ui = require('../../utils/ui')
const constants = require('../../utils/constants')
Page({
    data: {
        username: '',
        password: '',
        clientHeight: '',
        appid: "wxc2fdc548b4f218a7",
    },
    onLoad() {
        wx.getSystemInfo({
            success: res=> {
                this.setData({
                    clientHeight: res.windowHeight
                });
            }
        });
        let value = wx.getStorageSync('userInfo');
        console.log("value:===>",value)
        if(value){
            this.setData({
                username: value.loginName,
                password: value.password
            })
            console.log("this.data===>",this.data.username)
        }
    },
    //跳转到主页
    jumpToMain() {
        wx.switchTab({
            url: '/pages/map/map',
        })
    },
    //获取输入款内容
    content(e) {
        console.log("content===>",e);
        this.setData({
            username: e.detail.value
        })

    },
    password(e) {
        this.setData({
            password: e.detail.value
        })
    },
    //登录事件
    goadmin() {
        if (this.data.username == '') {
            wx.showToast({
                icon: 'none',
                title: '账号不能为空',
            })
        } else if (this.data.password == '') {
            wx.showToast({
                icon: 'none',
                title: '密码不能为空',
            })
        } else {
            //微信登录
            wx.login({
                success: res => {
                    if (res.code) {
                        //发起网络请求
                        //三方登录接口
                        let obj = {
                            method: "POST",
                            showLoading: true,
                            url: `${constants.loginApi}${this.data.appid}/login?code=${res.code}&password=${this.data.password}&loginName=${this.data.username}`,
                            message: "正在登录.."
                        }
                        httpUtils.request(obj).then(res => {
                            if (res.data.code == 0) {
                                let obj = {
                                    loginName: this.data.username,
                                    password: this.data.password,
                                    token: res.data.msg
                                }
                                //登录成功--存储登录用户信息
                                wx.setStorage({
                                    key: "userInfo",
                                    data: obj,
                                })
                                this.jumpToMain();
                            }
                            ui.showToast(res.data.code == 0 ? '登录成功！' : res.data.msg)
                        }).catch(err => {
                            console.log('ERROR')
                        });
                    } else {
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            })
        }
    }
})