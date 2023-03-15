// pages/addressbook/member/member.js
const httpUtils = require('../../../utils/httpUtils')
const ui = require('../../../utils/ui')
//引入汉字转拼音插件
var pinyin = require("../../../utils/pinyin/web-pinyin.js");
const constants = require('../../../utils/constants')
//获取应用实例
const app = getApp()
//此页全局即时搜索状态
var inputTimeout = null;
let jumpType = {
    group: 1, //通过某个组跳转--可以添加组成员、删除组成员；
    member: 2, //通过顶部操作跳转--可以新建群组，并且需要添加组成员；
}

let checkType = {
    multiple: 'checkbox',
    single: 'radio',
    other: ''
}

let optBtnType = {
    createGroup: 1,//创建组
    addMember: 2,//添加组员
    delMember: 3, //删除组员
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        checkType: '', //checkbox-多选类型 radio-单选类型 其他-基本通讯录
        jumpType: "",
        friendsList: [],//成员列表
        friendListSearch: [],//搜索用户列表
        chooseUserList: [],//选择的用户列表
        sortType: 0, //排序类型，默认0-以姓名排序 1-以职位排序
        checkAllFlag: false, //是否开启全选反选操作功能，点击时才开启
        checkAllType: false, //false-待全选 true-待反选
        searchFocus: false,
        searchText: '',
        placeholder: '搜索',
        searchHeight: 0, //搜索栏高度，需要传入通讯录插件
        showBottomOpt: true,
        optBtnType: optBtnType.createGroup,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //初始好友列表
        this.getFriendsList();
    },

    getFriendsList() {
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
                    friendsList: res.data.rows,
                })
                this.initList();
            }
        }).catch(err => {
            console.log('ERROR')
        });
    },

    //删除好友
    deleteFriend(item) {
        wx.showModal({
            title: '删除好友',
            content: `确认删除好友 ${item.name}?`,
            success: res => {
                if (res.confirm) {
                    let obj = {
                        method: "POST",
                        showLoading: true,
                        url: `${constants.deleteFriend}?id=${item.id}`,
                        message: "删除中...",
                    }
                    httpUtils.request(obj).then(res => {
                        if (res.data.code == 0) {
                            ui.showToast("删除成功！")
                            this.getFriendsList();
                        }
                    }).catch(err => {
                        console.log('ERROR')
                    });
                }
            }
        })
    },

    //点击/取消搜索
    searchTextTap: function (e) {
        this.setData({
            searchFocus: !this.data.searchFocus,
            searchText: '',
            friendListSearch: [],
        });
        if (inputTimeout != null) {
            clearTimeout(inputTimeout);
            inputTimeout = null;
        }
    },

    //搜索内容输入变化
    searchTextInput: function (e) {
        //console.log('searchTextInput e', e);
        this.setData({
            searchText: e.detail.value,
        });

        //即时搜索
        if (inputTimeout == null) {
            var that = this;
            inputTimeout = setTimeout(function () {
                that.searchSubmit(e);
            }, 1000);
        }
    },

    //清空搜索内容输入
    searchClearTap: function (e) {
        //console.log('searchClearTap e', e);
        this.setData({
            searchText: '',
            friendListSearch: [],
        });
    },

    //开始搜索
    searchSubmit: function (e) {
        //console.log('searchSubmit e', e);
        var friendListSearch = [];
        var friendsList = this.data.friendsList;
        var searchText = this.data.searchText;
        //console.log('searchSubmit searchText', searchText);

        if (this.data.searchText.length > 0) {
            //本地搜索，比较姓名、拼音、手机号、职位
            for (var i in friendsList) {
                if (friendsList[i].name.indexOf(searchText) != -1
                    || searchText.indexOf(friendsList[i].name) != -1
                    || friendsList[i]['HZPY'].indexOf(searchText) != -1
                    || searchText.indexOf(friendsList[i]['HZPY']) != -1) {
                    friendListSearch.push(friendsList[i]);
                }
            }
            if (friendListSearch.length == 0) {
                ui.showToast('无匹配结果');
            }
        }

        //搜索结果
        this.setData({
            friendListSearch: friendListSearch,
        });

        //一些处理
        if (inputTimeout != null) {
            clearTimeout(inputTimeout);
            inputTimeout = null;
        }
    },

    //初始化
    initList: function () {
        // 初始化
        let friendsList = this.data.friendsList
        // 全选状态
        if (this.data.checkType == 'checkbox') {
            //已开启全选或反选操作
            if (this.data.checkAllFlag) {
                //checkAllType：false-待全选 true-待反选
                for (var i in friendsList) {
                    friendsList[i]['checked'] = !this.data.checkAllType; //设置为全选或反选
                }
                //更新全选或反选状态
                this.setData({
                    checkAllType: !this.data.checkAllType,
                })
            }
        }

        //更新数据结果
        this.setData({
            friendsList: friendsList,
            searchFocus: false,
            searchText: '',
            friendListSearch: [],
        })
        //初始化
        this.initFriendList();
    },

    //初始化数据源
    initFriendList: function () {
        var friendsList = this.data.friendsList;
        //中文转拼音，性能还行
        try {
            for (var i in friendsList) {
                //汉字转拼音
                friendsList[i]['HZPY'] = pinyin(friendsList[i].name, {
                    style: pinyin.STYLE_NORMAL, // 设置拼音风格-普通风格，即不带声调。
                }).join('');
                //格式如:[['bei'],['jing']]，join后格式如：beijing
            }
        } catch (e) {
            console.log('exception', e);
            for (var i in friendsList) {
                friendsList[i]['HZPY'] = friendsList[i].name; //转换异常，默认替换
            }
        }
        //更新数据源
        this.setData({
            friendsList: friendsList,
        })
        //console.log('friendsList', this.data.friendsList);

        //初始化通讯录列表
        this.alphabet_order_list = this.selectComponent('#alphabet_order_list');
        console.log(this.alphabet_order_list);

    },

    //点击事件
    itemClickEvent: function (e) {
        console.log('itemClickEvent e====>', e);
        var item = e.detail.item ? e.detail.item : e.currentTarget.dataset.item;
        if (!e.detail.isLongTap) {
            this.itemClick(item);
        } else {
            //长按删除
            this.deleteFriend(item);
        }
    },

    //点击事件
    itemClick: function (item) {
        wx.navigateTo({
            url: `/pages/addressbook/memberdetail/memberdetail?userInfo=${JSON.stringify(item)}&isFriend=true`,
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        if (wx.createSelectorQuery) {
            var that = this;
            var query = wx.createSelectorQuery().in(this);
            //如果有搜索栏
            if (query.select('#searchBar')) {
                //添加节点的布局位置的查询请求。相对于显示区域，以像素为单位。其功能类似于 DOM 的 getBoundingClientRect。
                query.select('#searchBar').boundingClientRect(function (res) {
                    //console.log('searchBar boundingClientRect', res);
                    if (res != null && res != undefined) {
                        //节点的高度
                        that.setData({
                            searchHeight: res.height ? res.height : 0,
                        })
                        //console.log('searchBar searchHeight', that.data.searchHeight);
                    } else {
                        throw ('Initialization failed.')
                    }
                }).exec();
            }
        } else {
            throw ('当前基础库版本小于1.6.0，不支持createSelectorQuery')
        }
    },

    /**
   * 用户点击右上角分享
   */
    onShareAppMessage: function () {
    }
})