//const constants = require('../../utils/constants')
const baseUrl = "https://ptalk.com.cn:19443";
const webViewUrl = "https://ptalk.com.cn:443/webrtcdemo.html";
//登录
const loginApi = "/api/wx/user/";
//获取组
const getGroupListApi = "/api/group/usergrouplist";
//添加组
const addGroupApi = "/api/group/addGroup";
//删除组
const deleteGroupApi = "/api/group/delGroup";
//添加组成员
const addGroupMemberApi = "/api/group/addGroupMember";
//删除组成员
const deleteGrouoMemberApi = "/api/group/delGroupMember";
//获取所有组成员
const getAllMemberListApi = "/api/group/totalGroupUserList";
//获取指定组成员
const getMemberListApi = "/api/group/userlist";
//获取组织通讯录
const getAddressListApi = "/api/demo/deptNum";
//通话记录
const callrecordListApi = "/api/callrecord/list";
module.exports = {
    baseUrl,
    webViewUrl,
    loginApi,
    getGroupListApi,
    addGroupApi,
    deleteGroupApi,
    addGroupMemberApi,
    deleteGrouoMemberApi,
    getAllMemberListApi,
    getMemberListApi,
    getAddressListApi,
    callrecordListApi
  }