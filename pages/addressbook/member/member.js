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
        teacherList: [],//成员列表
        userListSearch: [],//搜索用户列表
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
        // console.log('onLoad options',options);
        // //checkType：checkbox-多选类型 radio-单选类型 其他-基本通讯录
        // this.setData({
        //   checkType: options.checkType || ''
        // });
        console.log("options:", options);
        this.setData({
            groupId: options.groupId ? options.groupId : "",
            jumpType: options.jumpType
        })
        //初始化教师列表
        //this.initTeacherList();
        this.getMemberList();
    },

    getMemberList(enable = false) {
        console.log("enable:", enable);
        let data = {
            groupid: !enable ? this.data.groupId : '',
        }

        let data1 = {
            loginName: wx.getStorageSync('userInfo').loginName
        }
        let obj = {
            method: "POST",
            showLoading: true,
            url: this.data.jumpType == jumpType.member || enable ? constants.getAllMemberListApi : constants.getMemberListApi,
            message: "加载中...",
            data: this.data.jumpType == jumpType.member || enable ? data1 : data
        }
        httpUtils.request(obj).then(res => {
            console.log("获取的组成员：", res, ";模式：", checkType.multiple);
            if (res.data.code == 0) {
                //处理数据
                let tempData = [];
                if (res.data.data) {
                    for (let i = 0; i < res.data.data.length; i++) {
                        tempData.push({
                            id: res.data.data[i].loginName,
                            name: res.data.data[i].userName,
                            mobile: res.data.data[i].phonenumber,
                            photo: '/image/user_icon.png',//res.data.data[i].avatar,
                            checked: false,
                        });
                    }
                }
                console.log("处理后的数据:", tempData)
                this.setData({
                    teacherList: tempData,
                    checkType: enable ? checkType.multiple : checkType.other,
                    optBtnType: enable ? optBtnType.addMember : optBtnType.createGroup
                })
                console.log("处理后的原始数据:", this.data.teacherList)
                this.initTeacherList();
            }
        }).catch(err => {
            console.log('ERROR')
        });
    },

    //全选或反选事件
    changeCheckAllType: function (e) {
        console.log('changeCheckAllType e', e);
        //标记为开启全选或反选操作功能
        this.setData({
            checkAllFlag: true,
        });

        //重新初始化教师列表
        this.initTeacherList();

    },

    //排序类型变换事件
    changeSortType: function (e) {
        console.log("optBtnType:", this.data.optBtnType)
        switch (this.data.optBtnType) {
            case optBtnType.createGroup:
                this.createGroup();
                break;
            case optBtnType.addMember:
                this.addMember();
                break;
            case optBtnType.delMember:
                this.deleteMember();
                break;
        }
    },

    //添加组员
    addMember() {
        let that = this;
        wx.showModal({
            title: '添加组员',
            content: "确认添加所选组员到群组？",
            success: function (res) {
                if (res.confirm) {
                    let data = {
                        groupid: that.data.groupId,
                        groupList: that.data.chooseUserList
                    }
                    let obj = {
                        method: "POST",
                        showLoading: true,
                        url: constants.addGroupMemberApi,
                        message: "添加中...",
                        data: data
                    }
                    httpUtils.request(obj).then(res => {
                        if (res.data.code == 0) {
                            ui.showToast('添加成功！');
                            that.setData({
                                checkType: checkType.other,
                                chooseUserList: []
                            })
                            that.getMemberList();
                        } else {
                            ui.showToast('添加失败！')
                        }
                    }).catch(err => {
                        console.log('ERROR')
                    });
                }
            }
        })
    },

    //创建群组
    createGroup() {
        let that = this;
        //弹框
        wx.showModal({
            title: '请输入群组名称',
            editable: true,
            placeholderText: "请输入",
            success: function (res) {
                console.log("dialog res =>", res);
                if (res.confirm) {
                    if (!res.content) {
                        ui.showToast("请输入群组名称!")
                        return;
                    } else {
                        let tempArr = that.data.chooseUserList;
                        tempArr.push(wx.getStorageSync('userInfo').loginName);
                        let data = {
                            groupName: res.content,
                            groupList: tempArr,
                        }
                        let obj = {
                            method: "POST",
                            showLoading: true,
                            url: constants.addGroupApi,
                            message: "创建中...",
                            data: data
                        }
                        httpUtils.request(obj).then(res => {
                            if (res.data.code == 0) {
                                ui.showToast('创建成功！')
                                //创建成功，跳转到主页
                                wx.switchTab({
                                    url: '/pages/addressbook/main/main',
                                })
                            }
                        }).catch(err => {
                            console.log('ERROR')
                        });
                    }
                }
            }
        })
    },

    //删除群组
    deleteMember() {
        let that = this;
        wx.showModal({
            title: '删除组员',
            content: "确认删除所选组员",
            success: function (res) {
                console.log("dialog res =>", res);
                if (res.confirm) {
                    let data = {
                        groupid: that.data.groupId,
                        groupList: that.data.chooseUserList
                    }
                    let obj = {
                        method: "POST",
                        showLoading: true,
                        url: constants.deleteGrouoMemberApi,
                        message: "删除中...",
                        data: data
                    }
                    httpUtils.request(obj).then(res => {
                        if (res.data.code == 0) {
                            ui.showToast(res.data.msg)
                            that.setData({
                                checkType: checkType.other,
                                chooseUserList: []
                            })
                            that.getMemberList();
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
        //console.log('searchTextTap e',e);
        this.setData({
            searchFocus: !this.data.searchFocus,
            searchText: '',
            userListSearch: [],
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
            userListSearch: [],
        });
    },

    //开始搜索
    searchSubmit: function (e) {
        //console.log('searchSubmit e', e);
        var userListSearch = [];
        var teacherList = this.data.teacherList;
        var searchText = this.data.searchText;
        //console.log('searchSubmit searchText', searchText);

        if (this.data.searchText.length > 0) {
            //本地搜索，比较姓名、拼音、手机号、职位
            for (var i in teacherList) {
                if (teacherList[i].name.indexOf(searchText) != -1
                    || searchText.indexOf(teacherList[i].name) != -1
                    || teacherList[i]['HZPY'].indexOf(searchText) != -1
                    || searchText.indexOf(teacherList[i]['HZPY']) != -1) {
                    userListSearch.push(teacherList[i]);
                }
            }
            if (userListSearch.length == 0) {
                ui.showToast('无匹配结果');
            }
        }

        //搜索结果
        this.setData({
            userListSearch: userListSearch,
        });

        console.log('this.data.userListSearch', userListSearch)

        //一些处理
        if (inputTimeout != null) {
            clearTimeout(inputTimeout);
            inputTimeout = null;
        }
    },

    //初始化教师列表
    initTeacherList: function () {
        // 初始化教师列表
        let teacherList = this.data.teacherList
        // 全选状态
        if (this.data.checkType == 'checkbox') {
            //已开启全选或反选操作
            if (this.data.checkAllFlag) {
                //checkAllType：false-待全选 true-待反选
                for (var i in teacherList) {
                    teacherList[i]['checked'] = !this.data.checkAllType; //设置为全选或反选
                }
                //更新全选或反选状态
                this.setData({
                    checkAllType: !this.data.checkAllType,
                })
            }
        }

        //更新数据结果
        this.setData({
            teacherList: teacherList,
            searchFocus: false,
            searchText: '',
            userListSearch: [],
        })
        //初始化通讯录列表
        this.initBookList();
    },

    //初始化数据源，并初始化通讯录列表
    initBookList: function () {
        var teacherList = this.data.teacherList;
        var sortType = this.data.sortType || 0; //排序类型，默认0-以姓名排序 1-以职位排序
        //中文转拼音，性能还行
        try {
            for (var i in teacherList) {
                //汉字转拼音
                teacherList[i]['HZPY'] = pinyin(sortType == 0 ? teacherList[i].name : teacherList[i].positionName, {
                    style: pinyin.STYLE_NORMAL, // 设置拼音风格-普通风格，即不带声调。
                }).join('');
                //格式如:[['bei'],['jing']]，join后格式如：beijing
            }
        } catch (e) {
            console.log('exception', e);
            for (var i in teacherList) {
                teacherList[i]['HZPY'] = sortType == 0 ? teacherList[i].name : teacherList[i].positionName; //转换异常，默认替换
            }
        }
        //更新数据源
        this.setData({
            teacherList: teacherList,
        })
        //console.log('teacherList', this.data.teacherList);

        //初始化通讯录列表
        this.alphabet_order_list = this.selectComponent('#alphabet_order_list');
        console.log(this.alphabet_order_list);

    },

    //选中事件
    checkBoxChange: function (e) {
        console.log('checkBoxChange e', e);
        console.log("chooseUserList:", this.data.chooseUserList);
        this.setData({
            chooseUserList: e.detail.item ? e.detail.item : e.detail.value
        })
        //ui.showToast('已选择[' + this.data.chooseUserList.length + ']个对象');
        console.log("选择的用户列表:", this.data.chooseUserList)
        //设置上一页选择数据
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去

    },

    //单选
    radioChange: function (e) {
        var item = e.detail.item ? e.detail.item : e.detail.value;;//"521"
        var teacherList = this.data.teacherList;
        var teacher = null;
        for (var i in teacherList) {
            if (item == teacherList[i].id) {
                teacher = teacherList[i];
                break;
            }
        }

        if (teacher != null) {
            app.toastSuccess('已选择[' + teacher.name + ']', false);
        }

        //设置上一页选择数据
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去

    },

    //点击事件
    itemClickEvent: function (e) {
        //console.log('itemClickEvent e', e); 

        var item = e.detail.item ? e.detail.item : e.currentTarget.dataset.item;

        this.itemClick(item);

    },

    //点击事件
    itemClick: function (item) {
        wx.navigateTo({
            url: `/pages/addressbook/memberdetail/memberdetail?userInfo=${JSON.stringify(item)}`,
        })
    },

    //添加操作
    addOpt: function (e) {
        var that = this;
        let itemSheet = [];
        if (this.data.jumpType == 1) {
            itemSheet.push('删除组员');
            itemSheet.push('添加组员');
        }
        if (this.data.jumpType == 2) {
            itemSheet.push('创建群组');
        }
        wx.showActionSheet({
            itemList: itemSheet,
            success(res) {
                console.log(res.tapIndex);
                if (res.tapIndex == 0) {
                    that.setData({
                        checkType: checkType.multiple,
                        optBtnType: that.data.jumpType == 2 ? optBtnType.createGroup : optBtnType.delMember
                    })
                }
                //默认全选-并且添加组员
                if (res.tapIndex == 1) {
                    //查询所有成员，并开启多选模式
                    let enable = true;
                    that.getMemberList(enable);
                }
            },
            fail(res) {
                console.log(res.errMsg);
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

    /**
   * 用户点击右上角分享
   */
    onShareAppMessage: function () {
    }
})