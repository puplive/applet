const app = getApp()
var url = app.globalData.url;
Page({
    data: {
        expo: app.globalData.expo,
        type: '1',
        count1: 0,
        count2: 0,
        list: {},
        list_keys: []
    },
    // onShareAppMessage: function(){},
    onLoad: function () {

    },
    onShow: function () {
        this.setData({
            expo: app.globalData.expo
        })
        this.getList()
    },
    check_tab: function(e){
        this.setData({
            type: e.currentTarget.dataset.type
        })
        this.getList()
    },
    
    go_list: function(e){
        let _e = e.currentTarget.dataset

        app.globalData.inspec_detail = {
            status: _e.status,
            title: _e.title,
            type: _e.type
        }
        wx.navigateTo({
            url: '/pages/booth/inspec-detail/inspec-detail'
        })
    },
    
    getList: function () {
        let that = this
        wx.request({
            url: url + '/worksite/inspection/get-inspe-total',
            data: {
                hui_id: this.data.expo.hui_id,
                type: this.data.type,
            },
            success(data) {
                let res = data.data,
                    list = {},
                    list_keys = [],
                    count1 = 0,
                    count2 = 0
                if(res.Code == 200){
                    list = res.data.data
                    list_keys = Object.keys(list)
                    count1 = res.data.count.guang
                    count2 = res.data.count.biao
                }

                that.setData({
                    list: list,
                    list_keys: list_keys,
                    count1: count1,
                    count2: count2
                })
                
                
            },
            fail: function (err) {
                console.log(err)
            }
        })
    }
    
})