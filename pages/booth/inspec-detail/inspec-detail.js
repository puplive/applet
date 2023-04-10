const app = getApp()
var url = app.globalData.url;
Page({
    data: {
        expo: app.globalData.expo,
        detail: {}
    },
    // onShareAppMessage: function(){},
    onLoad: function () {

    },
    onShow: function () {
        this.setData({
            expo: app.globalData.expo,
            detail: app.globalData.inspec_detail
        })
        console.log(this.data.detail)
    },
    
    go_edit: function(e){
        let _e = e.currentTarget.dataset

        app.globalData.inspec_detail = {
            info: _e.info,
            title: _e.title,
            type: _e.type
        }
        wx.navigateTo({
            url: '/pages/booth/inspec_detail/inspec_detail'
        })
    }
    
})