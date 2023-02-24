//const constants = require('../../utils/constants')
const port1 = 19443;
const port2 = 18090;
const defaultPort = 443;
const baseUrl = "https://ptalk.com.cn";//"https://ptalk.com.cn:19443";
//附件
const attrUrl = `${baseUrl}:${port2}`;//"https://ptalk.com.cn:18090";
//拨号h5
const webViewUrl = `${baseUrl}:${defaultPort}/webrtcdemo.html`;//"https://ptalk.com.cn:443/webrtcdemo.html";
//直播H5
const liveH5 = `${baseUrl}:${port2}/players/rtc_playerdemo.html`;
const webRtc = "webrtc://ptalk.com.cn:1990/live/";
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
//直播列表
const liveListApi = "/interface/livelist.php";
//获取终端位置信息
const getTerminalLocationApi = "/api/info/list/udntop";
//获取终端轨迹
const getTerminalTrackApi = "/api/info/list/udntime";
module.exports = {
    baseUrl,
    attrUrl,
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
    callrecordListApi,
    liveListApi,
    liveH5,
    port1,
    port2,
    webRtc,
    getTerminalLocationApi,
    getTerminalTrackApi
}