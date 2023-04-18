var app = getApp();
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../utils/request.js")
Page({
    data: {
        host: url,
        list: [],
        order_not: [],
        indexBottom: '',
        notBottom: '',
        expo: {},
    },
    onReady: function () {
      },
    onLoad: function (options) {
        wx.hideHomeButton()
        let isPhone = app.globalData.isIphoneX;
        if (isPhone) {
            this.setData({
                indexBottom: "418rpx",
                notBottom: "166rpx",
            })
        }
        app.editTabBar1();
        // console.log(2,this.data.isIphoneX)
    },
    onShow: function () {
        wx.hideHomeButton()
        this.setData({
            expo: app.globalData.expo
        })
        console.log(this.data.expo)
        var openId = wx.getStorageSync('openId')
        var that = this;
        wx.request({
            url: url + 'worksite/home/list',
            data: { ProjectId: sendMessageContent.projectId, OpenId: openId },
            method: 'GET',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                if (res.data.Code == 200) {

                    that.setData({
                        list: res.data.data.role,
                        order_not: res.data.data
                    })
                } else {

                }
            },
            fail: function (err) {
                // 服务异常
            }
        })
    },
    onShareAppMessage: function () {

    },
    telPhone: function(e){
        console.log(e)
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.tel,
            fail: function(err){
                console.log(err)
            }
        })
    },
    // 人员显示隐藏
    kindToggle: function (e) {
        var id = e.currentTarget.id, 
            list = this.data.list;
        for (var i = 0, len = list.length; i < len; ++i) {
            if (i == id) {
                list[i].open = !list[i].open
            } else {
                list[i].open = false
            }
        }
        this.setData({
            list: list
        });
    },
})