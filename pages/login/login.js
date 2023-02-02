// pages/login/login.js
//index.js
//获取应用实例
const httpUtils = require('../../utils/httpUtils')
const ui = require('../../utils/ui')
Page({
    data: {
        username: '',
        password: '',
        clientHeight: '',
        appid: "wxc0966f1fa5d28ef8",
    },
    onLoad() {
        var that = this
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    clientHeight: res.windowHeight
                });
            }
        })
    },
    //跳转到主页
    jumpToMain() {
        wx.redirectTo({
            url: '/pages/addressbook/main/main',
        })
    },
    //获取输入款内容
    content(e) {
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
            this.jumpToMain();
            let obj = {
                method: "POST",
                showLoading: true,
                url: `/api/wx/user/${this.data.appid}/login?code=xxx&password=${this.data.password}&loginName=${this.data.username}`,
                message: "正在注册..."
            }
            httpUtils.request(obj).then(res => {
                if (res.data.code == 0) {
                    let obj = {
                        userId: "0001",
                        token: "yyyyymmmmm",
                    }
                    //登录成功--存储登录用户信息
                    wx.setStorage({
                        key: "userInfo",
                        data: obj,
                    })
                }
                ui.showToast(res.data.msg)
            }).catch(err => {
                console.log('ERROR')
            });
        }
    }
})