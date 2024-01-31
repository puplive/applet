var app = getApp();
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
// var call = require("../../utils/request.js")
Page({
    data: {
        host: url,
        expo: {},
        count: {}
    },
    onReady: function () {},
    onLoad: function (options) {
        wx.hideHomeButton()
    },
    onShow: function () {
        wx.hideHomeButton()
        this.setData({
            expo: app.globalData.expo
        })
        this.get_count()
    },
    onShareAppMessage: function () {

    },
    get_count: function () {
        var that = this;
        wx.request({
            url: url + 'worksite/car-info/statistics',
            data: {
                ProjectId: sendMessageContent.projectId
            },
            success(res) {
                if (res.data.Code == 200) {
                    that.setData({
                        count: res.data.data
                    })
                } else {

                }
            },
            fail: function (err) {
                // 服务异常
            }
        })
    }
})