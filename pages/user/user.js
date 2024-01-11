const app = getApp()
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
Page({
    data: {
        expo: app.globalData.expo
    },
    onLoad: function (options) {
        wx.hideHomeButton()
        this.setData({
            expo: app.globalData.expo
        })
        var that = this;
        wx.request({
            url: url + 'worksite/default/c-zhui', 
            data: { OpenId: wx.getStorageSync('openId'), ProjectId: sendMessageContent.projectId },
            method: 'GET',
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data.Code == 200) {

                } else if (res.data.Code == 400) {
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
                        url: "identity/identity?hui=" + sendMessageContent.projectId
                    })
                }
            }
        })
    },
    onReady: function () {
    },
    onShow: function () {
        var that = this;
        // 获取用户信息
        wx.getUserInfo({
            success: function (res) {
                var avatarUrl = 'userInfo.avatarUrl';
                var nickName = 'userInfo.nickName';
                var tel = 'userInfo.tel';
                that.setData({
                    [avatarUrl]: res.userInfo.avatarUrl, [nickName]: res.userInfo.nickName, [tel]: res.userInfo.tel,
                })
            }
        })
        wx.request({
            url: url + '/worksite/user/user-content',
            data: { OpenId: wx.getStorageSync('openId'), role_id: sendMessageContent.RoleId },
            method: 'GET',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                if (res.data.Code == 200) {
                    that.setData({
                        tel: res.data.data.tel,
                        role_name: res.data.data.role_name,
                    })
                    // console.log(222,that.data.projectcon);
                } else {

                }
            },
            fail: function (err) {
                // 服务异常
            }
        })
    },
    onHide: function () {

    },
    onShareAppMessage: function () {

    }
})