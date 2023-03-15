// pages/addressbook/main/main.js
const httpUtils = require('../../../utils/httpUtils')
const ui = require('../../../utils/ui')
const constants = require('../../../utils/constants')
let tabType = {
    dept: 1,
    group: 2,
    member: 3,
    friend: 4
}
let longtap = 0;
//通讯录主页面
Page({

    /**
     * 页面的初始数据
     */
    data: {
        headTab: [
            { name: '部门', icon: "/image/dept.png", type: tabType.dept },
            { name: '群组', icon: "/image/group.png", type: tabType.group },
            { name: '组成员', icon: "/image/member.png", type: tabType.member },
            { name: '好友', icon: "/image/friend.png", type: tabType.friend }
        ],
        //群组列表
        groupList: [],
        //好友列表
        friendList: [],
        curChooseGroupIndex: 0,
    },

    onShow() {
        this.getGroupList();
        this.getFriendList();
    },

    getGroupList() {
        let obj = {
            method: "POST",
            showLoading: true,
            url: constants.getGroupListApi,
            message: "加载中...",
            data: {
                loginName: wx.getStorageSync('userInfo').loginName
            }
        }
        httpUtils.request(obj).then(res => {
            console.log("获取的群组：", res);
            if (res.data.code == 0) {
                this.setData({
                    groupList: res.data.data ? res.data.data : []
                })
            }
        }).catch(err => {
            console.log('ERROR')
        });
    },
    getFriendList() {
        let data1 = {
            userNum: wx.getStorageSync('userInfo').loginName
        }
        let obj = {
            method: "GET",
            showLoading: true,
            url: constants.getFriendsApi,
            message: "加载中...",
            data: data1
        }
        httpUtils.request(obj).then(res => {
            console.log("获取好友列表：", res);
            if (res.data.code == 0) {
                this.setData({
                    friendList: res.data.rows,
                })
                this.initList();
            }
        }).catch(err => {
            console.log('ERROR')
        });
    },
    tabClick(e) {
        console.log("tabClick:", e);
        let type = e.currentTarget.dataset.tabtype;
        let url = "";
        switch (type) {
            case tabType.dept:
                url = "/pages/addressbook/organization/organization"
                break;
            case tabType.group:
                url = "/pages/addressbook/group/group"
                break;
            case tabType.member:
                url = `/pages/addressbook/member/member?jumpType=2&groupId=${this.data.groupList[this.data.curChooseGroupIndex].groupNo}`
                break;
            case tabType.friend:
                url = "/pages/addressbook/goodfriend/goodfriend"
                break;
        }
        wx.navigateTo({
            url: url,
        })
    },
    myevent(e) {
        console.log("myevent===>", e.detail.params);
        if (e.detail.params) {
            this.getGroupList();
        }
    },
    curSelectIndex(e) {
        console.log("curSelectIndex===>", e);
        this.setData({
            curChooseGroupIndex: e.detail.idx
        })
    },

    bindlongtap(e) {
        console.log("长按：", e)
        longtap = 1;
        console.log("长按事件:", e);
        let that = this;
        wx.showModal({
            title: '删除好友',
            content: `确认删除 ${e.currentTarget.dataset.groupobj.name} ?`,
            success: res => {
                if (res.confirm) {
                    let obj = {
                        method: "POST",
                        showLoading: true,
                        url: `${constants.deleteFriend}?id=${e.currentTarget.dataset.groupobj.id}`,
                        message: "删除中...",
                    }
                    httpUtils.request(obj).then(res => {
                        if (res.data.code == 0) {
                            ui.showToast("删除成功！")
                            this.getFriendList();
                        }
                    }).catch(err => {
                        console.log('ERROR')
                    });
                }
            }
        })
    },

    jumpToDetail(e) {
        if (longtap != 1) {
            wx.navigateTo({
                url: `/pages/addressbook/memberdetail/memberdetail?userInfo=${JSON.stringify(e.currentTarget.dataset.groupobj)}&isFriend=true`,
            })
        }
        longtap = 0;
    },
    /**
   * 用户点击右上角分享
   */
    onShareAppMessage: function () {
    }
})