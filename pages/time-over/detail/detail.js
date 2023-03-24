const app = getApp()
var url = app.globalData.url;
Page({
    data:{
        expo: app.globalData.expo,
        id: '',
        zw_info: {},
        list: []
    },
    onLoad: function (op) {
        this.setData({
            id: op.id
        })
    },
    onShow: function () {
        this.setData({
            expo: app.globalData.expo,
            zw_info: app.globalData.time_over_zw
        })
        console.log(expo)
        this.getList()
    },
    getList: function () {
        let that = this
        wx.request({
            url: url + '/worksite/check/mi-time-out-details',
            data: {
                project_id: this.data.expo.hui_id,
                number: this.data.id
            },
            success(data) {
                let res = data.data,
                    list = []
                if(res.Code == 200){
                    let d = res.data
                    list = Object.values(d)
                    // for (const key in d) {
                    //     let item = d[key].detail
                    //     // item.forEach(element => {
                    //         list.push(...item)
                    //     // });
                    // }
                    
                }
                this.setData({
                    list: list
                })
            },
            fail: function (err) {
                console.log(err)
            }
        })
    }
})