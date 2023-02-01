// pages/addressbook/organization/organization.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
    },
    jumpList(){
        wx.navigateTo({
          url: '/pages/addressbook/organization/organizationlist/organizationlist?deptName=北京某某科技公司&id=0',
        })
    }
})