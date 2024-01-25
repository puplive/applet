const app = getApp()
var url = app.globalData.url;
Page({
    data: {
        expo: app.globalData.expo,
        status: '',
        search: '',
        page: 1,
        list: [],
        status_list: ['全部', '未领取', '已领取', '未入场', '已入场', '已出场', '未出场'],
        checked_list: [],
        zg: '',
        zw: ''
    },
    // onShareAppMessage: function(){},
    onLoad: function (op) {
        console.log(op)
        this.setData({
            status: op.status || '',
            zg: op.zg || '',
            zw: op.zw || ''
        })
    },
    onShow: function () {
        this.setData({
            expo: app.globalData.expo,
            list: [],
            checked_list: []
        })
        this.getList()
    },
    statusChange(e) {
        let val = e.detail.value
        this.setData({
            status: val,
            list: [],
            page: 1
        })
        this.getList()
    },
    search_change(e) {
        this.setData({
            search: e.detail.value,
            list: [],
            page: 1
        })
        this.getList()
    },
    checkboxChange(e) {
        // console.log(e.detail.value)

        this.setData({
            checked_list: e.detail.value
        })
    },
    pageAdd: function(){
        this.setData({
            page: this.data.page+1
        })
        this.getList()
    },
    getList: function () {
        let that = this
        wx.request({
            url: url + 'worksite/car-info/car',
            data: {
                projectId: this.data.expo.hui_id,
                page: this.data.page,
                limit: 20,
                status: this.data.status == 0 ? '' : this.data.status,
                search: this.data.search,
                hall_number: this.data.zg
            },
            success(data) {
                let res = data.data,
                    list = [];
                if (res.Code == 200) {
                    list = [...that.data.list, ...res.data.data]
                    console.log(list.length , res.data.count)
                    if(res.data.data.length == 0){
                        that.setData({
                            page: that.data.page-1
                        })
                    }
                }
                that.setData({
                    list: list
                })
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },
    notify: function () {
        let ids = this.data.checked_list.join(',')
        if (!ids) {
            wx.showToast({
                title: '请选择',
                icon: 'none'
            })
            return
        }
        let that = this
        wx.request({
            url: url + 'car/car-info/notify-send',
            method: 'PUT',
            data: {
                id: ids
            },
            success(data) {
                let res = data.data;
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                })
                if (res.Code == 200) {
                    that.setData({
                        page: 1,
                        list: [],
                        checked_list: []
                    })
                    that.getList()
                }

            },
            fail: function (err) {
                console.log(err)
            }
        })
    }

})