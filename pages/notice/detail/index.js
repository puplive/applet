//获取应用实例
const app = getApp()
var url = app.globalData.url;
// var call = require("../../utils/request.js") 
Page({
    data: {
        expo: app.globalData.expo,
        detail: {},
        id: '',
        
    },
    // onShareAppMessage: function(){},
    onLoad: function (options) {
        this.setData({
            expo: app.globalData.expo,
            id: options.id
        })
    },
    onShow: function () {
        this.getData()
    },
    onEditorReady: function(){
        let that = this
        wx.createSelectorQuery().select('#editor').context(function (res) {
            that.editorCtx = res.context
        }).exec() 
    },
    setContent: function(content){
        let that = this
        if(this.editorCtx){
            this.editorCtx.setContents({
                html: content
            })
        }else{
            setTimeout(() => {
                that.setContent(content)
            }, 200);
        }
    },
    getData: function () {
        let that = this
        wx.request({
            url: url + '/field/notice/home-notice',
            data: {
                hui_id: this.data.expo.hui_id
            },
            success(data) {
                let res = data.data
                if(res.Code == 200){
                    let list = res.data
                    for (const key in list) {
                        let item = list[key]
                        if (item.id == that.data.id) {
                            that.setData({
                                detail: item
                            })
                            break
                        }
                    }
                    that.setContent(that.data.detail.content)
                }
            },
            fail: function (err) {
                console.log(err)
            }
        })
    }
})
