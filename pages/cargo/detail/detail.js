const app = getApp()
Page({
    data: {
        host: app.globalData.url,
        expo: app.globalData.expo,
        open_id: wx.getStorageSync('openId'),
        detail: {},
    },
    onLoad(options) {

    },
    onReady() {

    },
    onShow() {

    },
    onHide() {

    },
    onShareAppMessage() {

    },
    sub: function (e) {
        wx.navigateTo({
            url: '/cargo/order/order'
        })
    }
})