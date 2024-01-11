const app = getApp()
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../utils/request.js")
Page({
    data: {
        // hiddenName: true
        show_hui_id: 0,
        name: '',
        discountName: '',
    },
    click: function (e) {
        this.setData({
            // hiddenName: !this.data.hiddenName
            show_hui_id: e.currentTarget.dataset.huiId,
        })

    },
    onShow: function () {
        var name = getApp().globalData.name
        var discountName = getApp().globalData.discountName
        if (name || discountName) {
            this.setData({
                name: name,
                discountName: discountName,
            })
        }
        var that = this;
        wx.request({
            url: url + 'field/default/hui-all',
            data: { OpenId: wx.getStorageSync('openId') },
            method: 'GET',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                if (res.data.Code == 200) {
                    that.setData({
                        huiinfo: res.data.data,
                        huiinfo_len: Object.keys(res.data.data).length,
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
    choice_btn: function (e) {//进入项目
        sendMessageContent.projectId = e.target.dataset.key
        app.globalData.expo = e.currentTarget.dataset.d
        var that = this;
        wx.request({
            url: url + 'worksite/default/c-zhui',   //验证是否认证过
            data: { 
              OpenId: wx.getStorageSync('openId'), 
              ProjectId: sendMessageContent.projectId 
            },
            success: function (res) {
                if (res.data.Code == 200) {
                    let applet_role_id = res.data.data.applet_role_id
                    applet_role_id = 15
                    app.globalData.userRole = applet_role_id
                    sendMessageContent.RoleId = applet_role_id;

                    if (applet_role_id < 3) {
                        if (applet_role_id == 1) {
                            // app.globalData.tabBar = app.globalData.tabBar1
                            wx.redirectTo({
                                url: "../admin/admin"
                            })
                        } else {
                            // app.globalData.tabBar = app.globalData.tabBar2
                            wx.redirectTo({
                                url: "../cruise/acceptance/acceptance"
                            })
                        }
                    } else {
                        if(applet_role_id == 15){
                            // app.globalData.tabBar = app.globalData.tabBarCargo
                            wx.redirectTo({
                                url: "../cargo/index/index"
                            })
                        }else{
                            wx.redirectTo({
                                url: "../operator/operator"
                            })
                        }
                    }
                } else if (res.data.Code == 400) {//提示您还没授权
                    wx.showToast({
                        title: '未授权,请前往授权',
                        icon: 'none',
                        duration: 5000//持续的时间
                    })
                    wx.navigateTo({
                        url: '/pages/login/login',
                    })
                } else {
                    wx.navigateTo({
                        url: "../admin/person/identity/identity?hui=" + sendMessageContent.projectId
                    })
                }
            }
        })
    },
})