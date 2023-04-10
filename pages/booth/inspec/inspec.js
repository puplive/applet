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
        this.getList('1')
        this.getList('2')
    },
    check_tab: function(e){
        this.setData({
            type: e.currentTarget.dataset.type
        })
        this.getList(this.data.type)
    },
    
    go_list: function(e){
        let _e = e.currentTarget.dataset

        app.globalData.inspec_detail = {
            info: _e.info,
            title: _e.title,
            type: _e.type
        }
        wx.navigateTo({
            url: '/pages/booth/inspec-detail/inspec-detail'
        })
    },
    
    getList: function (type) {
        let that = this
        wx.request({
            url: url + '/worksite/inspection/get-inspe-total',
            data: {
                hui_id: this.data.expo.hui_id,
                type: type,
            },
            success(data) {
                let res = data.data,
                    list = {},
                    list_keys = [],
                    count = 0
                if(res.Code == 200){
                    list = res.data.data
                    list_keys = Object.keys(list)
                    count = res.data.count
                }
                if(that.data.type == type){
                    that.setData({
                        list: list,
                        list_keys: list_keys
                    })
                }
                if(type == '1'){
                    that.setData({
                        count1: count
                    })
                }else{
                    that.setData({
                        count2: count
                    })
                }
                
            },
            fail: function (err) {
                console.log(err)
            }
        })
    }
    
})