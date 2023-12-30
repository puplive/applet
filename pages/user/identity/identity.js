// var APP = getApp();
var app = getApp();
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
// var call = require("../../../../utils/request.js")
Page({
    data: {
        isShow: false,
        tel: '',
        pro_name: '',
        proid: '',
        projectindex: 0,      // 项目名称列表默认选中第几行
        projectArray: [],     // 项目名称对象数组
        openId: wx.getStorageSync('openId'),
    },
    bindProjectChange: function (event) {
        this.setData({
            projectindex: event.detail.value
        })
    },
    telInput: function (e) {
        this.setData({
            tel: e.detail.value
        })
    },
    save: function (e) {
        var that = this;
        var pro_id = that.data.proid;
        var tel = that.data.tel;
        if (!tel) {
            this.setData({
                focus_tel: true
            })
            wx.showToast({
                title: '手机号不能为空',
                icon: 'none',
                duration: 2000//持续的时间
            })
            return false;
        }
        wx.request({
            url: url + 'worksite/default/identification',
            data: { const_id: pro_id, tel: tel, OpenId: wx.getStorageSync('openId'), ProjectId: sendMessageContent.projectId },
            method: 'GET',
            header: {
                'cntent-type': 'application/json' // 默认值
            },
            success(res) {
                if (res.data.Code == 200) {
                    wx.showToast({
                        title: '认证成功',
                        icon: 'none',
                        duration: 50000//持续的时间
                    })
                    wx.navigateTo({
                        url: "../../expo/expo"
                    })
                    // wx.setStorageSync('hasuser', true)
                } else {
                    wx.showToast({
                        isShow: wx.getStorageSync('hasuser'),
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000//持续的时间
                    })
                }
            },
            fail: function (err) {
                // 服务异常
            }
        })
    },
    onLoad: function (options) {
        var that = this;
        //认证状态初始化
        that.setData({
            // isShow: false,
            isShow: wx.getStorageSync('hasuser'),
            indentityInfo: app.globalData.indentityInfo,

        })
        // 获取用户信息
        wx.getUserInfo({
            success: function (res) {
                var avatarUrl = 'userInfo.avatarUrl';
                var nickName = 'userInfo.nickName';
                that.setData({
                    [avatarUrl]: res.userInfo.avatarUrl, [nickName]: res.userInfo.nickName,
                })
            }
        })
        // 获取公司名称
        wx.request({
            url: url + 'worksite/default/const-search',
            data: { OpenId: wx.getStorageSync('openId'), ProjectId: sendMessageContent.projectId },
            method: 'GET',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                if (res.data.Code == 200) {
                    // var items = [];
                    // for (let i in res.data.data) {
                    //   items.push(res.data.data[i]);
                    // }
                    that.setData({
                        //   projectArray: items,
                        pro_name: res.data.data.nickname,
                        proid: res.data.data.const_id,
                        //   proid:items[0].const_id,
                    })
                } else {

                }
            },
            fail: function (err) {
                // 服务异常
            }
        })


    },
    onReady: function () {

    },
    onShow: function () {
        var that = this;
        wx.request({
            url: url + 'worksite/default/ident-info',   //验证是否认证过
            data: { OpenId: wx.getStorageSync('openId'), ProjectId: sendMessageContent.projectId },
            method: 'GET',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                if (res.data.Code == 200) {
                    wx.setStorageSync('hasuser', true)
                    that.setData({
                        isShow: wx.getStorageSync('hasuser'),
                        indentityInfo: res.data.data,
                        openId: wx.getStorageSync('openId'),
                    })
                } else {
                    wx.setStorageSync('hasuser', false)
                    that.setData({
                        isShow: wx.getStorageSync('hasuser'),
                    })
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000//持续的时间
                    })
                }
            }
        })
    },
    onHide: function () {

    },
    onShareAppMessage: function () {

    }
})