// pages/components/group/group.js
const ui = require('../../utils/ui')
const httpUtils = require('../../utils/httpUtils')
let longtap = 0;
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        groupList: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        //判断是否长按事件
        curIndex: 0,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        jumpMember(e) {
            console.log("e:", e)
            wx.navigateTo({
                url: `/pages/addressbook/member/member?groupId=${e.currentTarget.dataset.groupid}&jumpType=1`,
            })
        },
        jumpVoice(e) {
            if (longtap != 1) {
                //ui.showToast("该功能暂未上线！");
            }
            let index = this.data.groupList.findIndex(item => item.groupId === e.currentTarget.dataset.groupobj.groupId);
            longtap = 0;
        },

        itemClick(e){
            console.log("itemClick:",e)
            this.setData({
                curIndex: e.currentTarget.dataset.index
            })
            this.triggerEvent('curindex', { idx: this.data.curIndex })
        },

        jumpBussiness(e) {
            console.log("e=----->",e)
            //ui.showToast("该功能暂未上线！");
            wx.navigateTo({
              url: `/pages/addressbook/groupdetail/groupdetail?groupInfo=${JSON.stringify(e.currentTarget.dataset.groupobj)}`,
            })
        },

        bindlongtap(e) {
            longtap = 1;
            console.log("长按事件:", e);
            let that = this;
            wx.showModal({
                title: '删除群组',
                content: `确认删除 ${e.currentTarget.dataset.groupobj.groupName} ?`,
                success: function (res) {
                    console.log("dialog res =>", res);
                    if (res.confirm) {
                        let data = {
                            groupid: e.currentTarget.dataset.groupobj.groupNo,
                        }
                        let obj = {
                            method: "POST",
                            showLoading: true,
                            url: `/api/group/delGroup`,
                            message: "删除中...",
                            data: data
                        }
                        httpUtils.request(obj).then(res => {
                            if (res.data.code == 0) {
                                that.triggerEvent('myevent', { params: true })
                                this.setData({
                                    curIndex: 0
                                })
                                this.triggerEvent('curindex', { idx: this.data.curIndex })
                            }
                        }).catch(err => {
                            console.log('ERROR')
                        });
                    }
                }
            })
        }
    }
})
