// pages/addressbook/addressbook.js
Page({
    data: {
        windowHeight: '',
        deptData: [{
            "deptName": '基础研发部',
            id:1,
        },
        {
            "deptName": '设计部',
            id:2,
        },
        {
            "deptName": '测试部',
            id:3,
        },
        {
            "deptName": '质量管理部',
            id:4,
        },
        {
            "deptName": '生产部',
            id:5,
        }],
        userData: [
            { "letter": "A", "data": [{ "name": "AAA", "phoneNum": "15771009876", "icon": "/image/user_icon.png" }, { "name": "AAAAAAA", "phoneNum": "15771009876", "icon": "/image/user_icon.png" },] },
            { "letter": "B", "data": [{ "name": "BBB", "phoneNum": "15771009876", "icon": "/image/user_icon.png" },] },
            { "letter": "C", "data": [{ "name": "CCC", "phoneNum": "15771009876", "icon": "/image/user_icon.png" }, { "name": "CCC", "phoneNum": "15771009876", "icon": "/image/user_icon.png" }, { "name": "CCC", "phoneNum": "15771009876", "icon": "/image/user_icon.png" }, { "name": "CCC", "phoneNum": "15771009876", "icon": "/image/user_icon.png" }, { "name": "CCC", "phoneNum": "15771009876", "icon": "/image/user_icon.png" }] },
            { "letter": "D", "data": [{ "name": "DDD", "phoneNum": "15771009876", "icon": "/image/user_icon.png" }] },
            { "letter": "E", "data": [{ "name": "EEE", "phoneNum": "15771009876", "icon": "/image/user_icon.png" },] },
            { "letter": "F", "data": [{ "name": "FFF", "phoneNum": "15771009876", "icon": "/image/user_icon.png" }] },
            { "letter": "G", "data": [{ "name": "GGG", "phoneNum": "15771009876", "icon": "/image/user_icon.png" }] },
            { "letter": "H", "data": [{ "name": "HHHH", "phoneNum": "15771009876", "icon": "/image/user_icon.png" }] },
            { "letter": "I", "data": [{ "name": "IIIII", "phoneNum": "15771009876", "icon": "/image/user_icon.png" }] },
            { "letter": "J", "data": [{ "name": "JJJ", "phoneNum": "15771009876", "icon": "/image/user_icon.png" }, { "name": "JJJ", "phoneNum": "15771009876", "icon": "/image/user_icon.png" }, { "name": "JJJ", "phoneNum": "15771009876", "icon": "/image/user_icon.png" }, { "name": "JJJ", "phoneNum": "15771009876", "icon": "/image/user_icon.png" }, { "name": "JJJ", "phoneNum": "15771009876", "icon": "/image/user_icon.png" }, { "name": "JJJ", "phoneNum": "15771009876", "icon": "/image/user_icon.png" }, { "name": "JJJ", "phoneNum": "15771009876", "icon": "/image/user_icon.png" }, { "name": "JJJ", "phoneNum": "15771009876", "icon": "/image/user_icon.png" }] },
            { "letter": "K", "data": [{ "name": "KKK", "phoneNum": "15771009876", "icon": "/image/user_icon.png" },] },
            {
                "letter": "L", "data": [{ "name": "LLL", "phoneNum": "15771009876", "icon": "/image/user_icon.png" },
                ]
            },
            { "letter": "M", "data": [] },
            { "letter": "N", "data": [{ "name": "NNN", "phoneNum": "15771009876", "icon": "/image/user_icon.png" },] },
            { "letter": "O", "data": [{ "name": "OOO", "phoneNum": "15771009876", "icon": "/image/user_icon.png" },] },
            { "letter": "P", "data": [{ "name": "PPP", "phoneNum": "15771009876", "icon": "/image/user_icon.png" },] },
            { "letter": "Q", "data": [{ "name": "QQQ", "phoneNum": "15771009876", "icon": "/image/user_icon.png" },] },
            { "letter": "R", "data": [{ "name": "RRR", "phoneNum": "15771009876", "icon": "/image/user_icon.png" },] },
            { "letter": "S", "data": [{ "name": "SSS", "phoneNum": "15771009876", "icon": "/image/user_icon.png" },] },
            { "letter": "T", "data": [{ "name": "TTT", "phoneNum": "15771009876", "icon": "/image/user_icon.png" },] },
            { "letter": "U", "data": [{ "name": "UUU", "phoneNum": "15771009876", "icon": "/image/user_icon.png" },] },
            { "letter": "V", "data": [{ "name": "VVV", "phoneNum": "15771009876", "icon": "/image/user_icon.png" },] },
            { "letter": "W", "data": [{ "name": "WWW", "phoneNum": "15771009876", "icon": "/image/user_icon.png" },] },
            { "letter": "X", "data": [] },
            { "letter": "Y", "data": [{ "name": "YYY", "phoneNum": "15771009876", "icon": "/image/user_icon.png" },] },
            { "letter": "Z", "data": [] },
        ],
        organizationList: [],
        curIndex: 0,
    },

    onLoad: function (options) {
        console.log("options:", options)
        let tempArr = [{ id: options.id, deptName: options.deptName }];
        tempArr.push()
        try {
            var res = wx.getSystemInfoSync()
            this.setData({
                windowHeight: res.windowHeight + 'px',
                organizationList: tempArr
            })
        } catch (e) {
            console.log(e);
        }
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
            url: '/pages/userinfo/userinfo?userInfoObj=' + JSON.stringify(e.currentTarget.dataset.userinfoobj)
        })
    },

    jumpToDept(e){
        console.log("bindex:",e);
        let tempArr = this.data.organizationList; 
        let index = e.currentTarget.dataset.index;
        if(index < tempArr.length - 1){
            tempArr.splice(index + 1, tempArr.length - 1);
        }
        this.setData({
            organizationList: tempArr,
            curIndex: this.data.organizationList.length - 1
        })
    },

    deptClick(e){
        console.log("deptClick:",e);
        let tempArr = this.data.organizationList;
        tempArr.push(e.currentTarget.dataset.obj);
        this.setData({
            organizationList: tempArr,
            curIndex: this.data.organizationList.length - 1
        })
    }
})