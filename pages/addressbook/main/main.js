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
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getGroupList();
        this.getFriendList();
    },
    getGroupList() {
        let obj = {
            method: "POST",
            showLoading: true,
            url: `/api/group/list`,
            message: "加载中..."
        }
        httpUtils.request(obj).then(res => {
            console.log("获取的群组：", res);
            this.setData({
                groupList: res.data.rows ? res.data.rows : []
            })
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
                url = `/pages/addressbook/member/member?jumpType=2`
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
        console.log(e.detail.params);
        if(e.detail.params){
            this.getGroupList();
        }
    }
})