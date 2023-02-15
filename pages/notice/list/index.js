//获取应用实例
const app = getApp()
var url = app.globalData.url;
// var call = require("../../utils/request.js") 
Page({
    data: {
        expo: app.globalData.expo,
        list: []
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
    getList: function () {
        let that = this
        wx.request({
            url: url + '/field/notice/home-notice',
            data: {
                hui_id: this.data.expo.hui_id
            },
            success(data) {
                let res = data.data
                console.log(res)
                if(res.Code == 200){
                    let list = res.data,
                        list2 = {}

                    for (const key in list) {
                        let item = list[key],
                            time = item.create_time.split(' ');
                        item.time = time[1]
                        if (list2[time[0]]) {
                            list2[time[0]].push(item)
                        }else{
                            list2[time[0]]=[item]
                        }
                    }
                    that.setData({
                        list: list2
                    })
                }
                
            },
            fail: function (err) {
                console.log(err)
            }
        })
    }
})
