const app = getApp()
var url = app.globalData.url;
Page({
    data: {
        expo: app.globalData.expo,
        hall_number: '',
        position_number: '',
        page: 1,
        list: [],
        zg_list: [],
        type: '',
        title: [{},{t1: '已申报',t2: '申报时间'},{t1: '领证数量',t2: '领证时间'},{t1: '入场数量',t2: '入场时间'},{t1: '出场数量',t2: '出场时间'},{t1: '馆内数量',t2: ''}]
    },
    // onShareAppMessage: function(){},
    onLoad: function (op) {
        // console.log(op.type)
        this.setData({type: op.type})
    },
    onShow: function () {
        this.setData({
            expo: app.globalData.expo
        })
        this.get_zg_list()
        this.getList()
    },
    zwChange(e) {
        let value = e.detail.value
        this.setData({
            position_number: value,
            list: [],
            page: 1
        })
        this.getList()
    },
    zgChange(e) {
        let val = e.detail.value
        this.setData({
            hall_number: val==0? '': this.data.zg_list[val],
            list: [],
            page: 1
        })
        this.getList()
    },
    get_zg_list: function () {
        let that = this
        wx.request({
            url: url + 'field/order/project/'+that.data.expo.hui_id,
            // header: {
            //     "content-type": "application/json;charset=UTF-8"
            //   },
            success(res) {
                let data = res.data,
                    zg_list = ['全部']
                if (data.Code == 200) {
                    that.setData({
                        // zw_list: data.data.number,
                        zg_list: [...zg_list,...data.data.z_guan]
                    })
 
                } else {

                }
                
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },
    getList: function () {
        let that = this
        wx.request({
            url: url + 'worksite/car-info/group',
            data: {
                projectId: this.data.expo.hui_id,
                hall_number: this.data.hall_number,
                position_number: this.data.position_number,
                page: this.data.page,
                limit: 12
            },
            success(data) {
                let res = data.data,
                    list = [];
                if(res.Code == 200){
                    list = [...that.data.list,...res.data.data]
                }
                that.setData({
                    list: list
                })
            },
            fail: function (err) {
                console.log(err)
            }
        })
    }

})