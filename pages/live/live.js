// pages/live/liveh5/liveh5.js
const httpUtils = require('../../utils/httpUtils')
const ui = require('../../utils/ui')
const constants = require('../../utils/constants')
//引入汉字转拼音插件
var pinyin = require("../../utils/pinyin/web-pinyin.js");
//此页全局即时搜索状态
var inputTimeout = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        liveList: [],
        liveListSearch:[],
        checkType: '', //checkbox-多选类型 radio-单选类型 其他-基本通讯录
        searchFocus: false,
        searchText: '',
        placeholder: '搜索',
        searchHeight: 0, //搜索栏高度，需要传入通讯录插件
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
    },
    onShow() {
        this.getLiveList();
    },
    //获取直播列表
    getLiveList() {
        let obj = {
            method: "POST",
            showLoading: true,
            url: constants.liveListApi,
            message: "加载中.."
        }
        httpUtils.request(obj, constants.port2).then(res => {
            if (res.data.code == 0) {
                if (res.data.streams) {
                    let tempArr = [];
                    for (let i = 0; i < res.data.streams.length; i++) {
                        if (res.data.streams[i].publish.active) {
                            let obj = {};
                            obj = res.data.streams[i];
                            obj.idlive = res.data.streams[i].id;
                            obj.id = i + 1;
                            obj.icon = "/image/monitor.png"
                            tempArr.push(obj)
                        }
                    }
                    this.setData({
                        liveList: tempArr
                    })
                    this.iniList();
                }
            }
        }).catch(err => {
            console.log('ERROR')
        });
    },

    itemClickEvent(e) {
        console.log("itemClickEvent====", e)
        //播放或者转发
        let itemSheet = ['播放', '转发'];
        wx.showActionSheet({
            itemList: itemSheet,
            success: res => {
                console.log(res.tapIndex);
                if (res.tapIndex == 0) {
                    //e.detail.item.num,
                    wx.navigateTo({
                        url: `/pages/live/liveh5/liveh5?name=${e.detail.item.name}`
                    })
                }
                if (res.tapIndex == 1) {
                    //转发
                    this.shareToUser();
                }
            },
            fail(res) {
                console.log(res.errMsg);
            }
        })
    },

    shareToUser() {
        wx.showModal({
            title: '直播转发',
            editable: true,
            placeholderText: "号码",
            success: res => {
                if (res.confirm) {
                }
            }
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

    //点击/取消搜索
    searchTextTap: function (e) {
        //console.log('searchTextTap e',e);
        this.setData({
            searchFocus: !this.data.searchFocus,
            searchText: '',
            liveListSearch: [],
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
            liveListSearch: [],
        });
    },

    //开始搜索
    searchSubmit: function (e) {
        //console.log('searchSubmit e', e);
        var liveListSearch = [];
        var liveList = this.data.liveList;
        var searchText = this.data.searchText;

        if (this.data.searchText.length > 0) {
            //本地搜索，比较姓名、拼音、手机号、职位
            for (var i in liveList) {
                if (liveList[i].name.indexOf(searchText) != -1
                    || searchText.indexOf(liveList[i].name) != -1
                    || liveList[i]['HZPY'].indexOf(searchText) != -1
                    || searchText.indexOf(liveList[i]['HZPY']) != -1) {
                        liveListSearch.push(liveList[i]);
                }
            }
            if (liveListSearch.length == 0) {
                ui.showToast('无匹配结果');
            }
        }

        //搜索结果
        this.setData({
            liveListSearch: liveListSearch,
        });

        //一些处理
        if (inputTimeout != null) {
            clearTimeout(inputTimeout);
            inputTimeout = null;
        }
    },

     //初始化数据源，并初始化通讯录列表
     iniList: function () {
        var liveList = this.data.liveList;
        //中文转拼音，性能还行
        try {
            for (var i in liveList) {
                //汉字转拼音
                liveList[i]['HZPY'] = pinyin(liveList[i].name, {
                    style: pinyin.STYLE_NORMAL, // 设置拼音风格-普通风格，即不带声调。
                }).join('');
                //格式如:[['bei'],['jing']]，join后格式如：beijing
            }
        } catch (e) {
            console.log('exception', e);
            for (var i in liveList) {
                liveList[i]['HZPY'] = teacherList[i].name; //转换异常，默认替换
            }
        }
        //更新数据源
        this.setData({
            liveList: liveList,
        })
        this.alphabet_order_list = this.selectComponent('#alphabet_order_list');
    },
})