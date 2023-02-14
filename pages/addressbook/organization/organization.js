// pages/addressbook/addressbook.js
const httpUtils = require('../../../utils/httpUtils')
const ui = require('../../../utils/ui')
const constants = require('../../../utils/constants')
//引入汉字转拼音插件
var pinyin = require("../../../utils/pinyin/web-pinyin.js");
Page({
    data: {
        windowHeight: '',
        deptData: [],
        userData: [],
        originData: [],
        organizationList: [],
        curIndex: 0,
        checkType: '', //checkbox-多选类型 radio-单选类型 其他-基本通讯录
    },

    onLoad: function (options) {
        this.getDeptList();
        try {
            var res = wx.getSystemInfoSync()
            this.setData({
                windowHeight: res.windowHeight + 'px',
            })
        } catch (e) {
            console.log(e);
        }
    },

    getDeptList() {
        let obj = {
            method: "POST",
            showLoading: true,
            url: `${constants.getAddressListApi}?num=${wx.getStorageSync('userInfo').loginName}`,
            message: "正在登录.."
        }
        httpUtils.request(obj).then(res => {
            if (res.data.responseCode == 0) {
                if (res.data.data && res.data.data.length > 0) {
                    this.setData({
                        originData: res.data.data,
                        deptData: res.data.data
                    })
                }

            }
        }).catch(err => {
            console.log('ERROR')
        }); 
    },

    // 拨打电话给
    callGetPhone(e) {
        // 号码
        let telPhone = e.currentTarget.dataset.getphone;
        if (telPhone == 'null' || telPhone == '') {
            wx.showToast({
                title: '电话号码为空!',
            })
            return;
        }
        wx.showModal({
            title: '拨打电话',
            content: telPhone,
            confirmText: '拨打',
            success: function (res) {
                if (res.confirm) {
                    wx.makePhoneCall({
                        phoneNumber: telPhone
                    })
                }
            }
        })
    },

    viewUserInfo(e) {
        console.log("viewUserInfo:", e.currentTarget.dataset.userinfoobj)
        wx.navigateTo({
            url: '/pages/addressbook/memberdetail/memberdetail?userInfo=' + JSON.stringify(e.currentTarget.dataset.userinfoobj)
        })
    },

    jumpToDept(e) {
        console.log("bindex:", e);
        let tempArr = this.data.organizationList;
        let index = e.currentTarget.dataset.index;
        if (index < tempArr.length - 1) {
            tempArr.splice(index + 1, tempArr.length - 1);
        }
        this.setData({
            organizationList: tempArr,
            curIndex: this.data.organizationList.length - 1
        })
        console.log("处理后的---->", this.data.organizationList);
        let tempDatas = this.getTreeItem(this.data.originData, this.data.organizationList[this.data.curIndex].id);
        this.setData({
            deptData: tempDatas.childDepartment,
            userData: tempDatas.listUserInfo,
        })
        //this.initBookList();
    },

    deptClick(e) {
        console.log("deptClick:", e);
        let tempArr = this.data.organizationList;
        // tempArr.push(e.currentTarget.dataset.obj);
        let tempDatas = this.getTreeItem(this.data.originData, e.currentTarget.dataset.obj.id);
        console.log("tempDatas===>", tempDatas);
        let obj = {
            id: tempDatas.id,
            name: tempDatas.name
        }
        tempArr.push(obj);
        this.setData({
            deptData: tempDatas.childDepartment,
            userData: tempDatas.listUserInfo,
            organizationList: tempArr,
            curIndex: this.data.organizationList.length - 1
        })

        console.log("originDatas====>", this.data.originData);
        this.initBookList();
    },

    itemClickEvent(e) {
        console.log("itemClickEvent====",e)
        console.log("viewUserInfo:", e.detail.item)
        let temp = {
            id:e.detail.item.num,
            name: e.detail.item.nickname,
            mobile:  e.detail.item.mobilenum,
        }
        wx.navigateTo({
            url: '/pages/addressbook/memberdetail/memberdetail?userInfo=' + JSON.stringify(temp)
        })
    },

    itemCallClickEvent(e){
        console.log("call ----->",e);
    },

    getTreeItem(list, id) {
        let _this = this
        for (let i = 0; i < list.length; i++) {
            let a = list[i]
            if (a.id === id) {
                return a;
            } else {
                if (a.childDepartment && a.childDepartment.length > 0) {
                    let res = _this.getTreeItem(a.childDepartment, id)
                    if (res) {
                        return res
                    }
                }
            }
        }
    },

    //初始化数据源，并初始化通讯录列表
    initBookList: function () {
        var teacherList = this.data.userData;
        //中文转拼音，性能还行
        try {
            for (var i in teacherList) {
                //汉字转拼音
                teacherList[i]['HZPY'] = pinyin(teacherList[i].nickname, {
                    style: pinyin.STYLE_NORMAL, // 设置拼音风格-普通风格，即不带声调。
                }).join('');
                //格式如:[['bei'],['jing']]，join后格式如：beijing
            }
        } catch (e) {
            console.log('exception', e);
            for (var i in teacherList) {
                teacherList[i]['HZPY'] = teacherList[i].nickname; //转换异常，默认替换
            }
        }
        //更新数据源
        this.setData({
            userData: teacherList,
        })
        this.alphabet_order_list = this.selectComponent('#alphabet_order_list');
    },
})