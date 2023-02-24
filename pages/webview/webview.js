// pages/webview/webview.js
Page({
    data:{
        webViewUrl:"",
    },
    onLoad(options) {
        console.log('options====>',options);
        this.setData({
            webViewUrl: options.webViewUrl
        })
    },

    onWebLoad(){
        console.log("onWebLoad===> 加载成功：",this.data.webViewUrl)
    },

    onWebError(e) {
        console.log("onWebError===> ",this.data.webViewUrl)
    }
})