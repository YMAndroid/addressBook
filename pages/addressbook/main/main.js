// pages/addressbook/main/main.js
const httpUtils = require('../../../utils/httpUtils')
const ui = require('../../../utils/ui')
let tabType = {
    dept: 1,
    group: 2,
    member: 3,
    friend: 4
}
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getFriendList();
    },

    onShow(){
        this.getGroupList();
    },

    getGroupList() {
        let obj = {
            method: "POST",
            showLoading: true,
            url: `/api/group/usergrouplist`,
            message: "加载中...",
            data : {
                loginName: wx.getStorageSync('userInfo').loginName
            }
        }
        httpUtils.request(obj).then(res => {
            console.log("获取的群组：", res);
            if(res.data.code == 0){
                this.setData({
                    groupList: res.data.data ? res.data.data : []
                })
            }
        }).catch(err => {
            console.log('ERROR')
        });
    },
    getFriendList() {
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
        if(type == tabType.friend){
            ui.showToast("该功能暂未实现！")
            return;
        }
        wx.navigateTo({
            url: url,
        })
    },
    myevent(e){
        console.log("myevent===>",e.detail.params);
        if(e.detail.params){
            this.getGroupList();
        }
    },
    curSelectIndex(e){
        console.log("curSelectIndex===>",e);
        this.setData({
            curChooseGroupIndex: e.detail.idx
        })
    }
})