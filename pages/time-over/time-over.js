const app = getApp()
var url = app.globalData.url;
Page({
    data: {
        expo: app.globalData.expo,
        msg_show: false,
        picker_show: false,
        picker_show_zg: false,
        picker_show_zw: false,
        picker_show_time: false,
        list_zg: [],
        list_zw: [],
        value_zg: '',
        value_zw: '',
        value_time: '',
        index_zg: [0],
        index_zw: [0],
        key_zw: '',
        list_zg_all: [],
        list_zw_all: [],
        list: []
    },
    // onShareAppMessage: function(){},
    onLoad: function () {

    },
    onShow: function () {
        this.setData({
            expo: app.globalData.expo
        })
        this.getList({})
        this.getSearch()
    },
    go_detail: function(e){
        let item = e.currentTarget.dataset.item
        wx.navigateTo({
            url: '/pages/time-over/detail/detail?id='+item.number_code
        })
    },
    change_zg: function(e){
        this.setData({
            index_zg: e.detail.value
        })
    },
    select_zg: function(){
        let value_zg = this.data.list_zg[this.data.index_zg[0]]
        value_zg = value_zg=='无'? '' :value_zg
        if(value_zg != this.data.value_zg){
            this.setData({
                value_zg: value_zg
            })
            this.getList({
                value_zg: value_zg,
                value_zw: this.data.value_zw,
                value_zs: this.data.value_zs
            })
            // this.getSearch()
        }
        this.close_picker()
    },
    change_zw: function(e){
        this.setData({
            index_zw: e.detail.value
        })
    },
    select_zw: function(){
        let value_zw = this.data.list_zw[this.data.index_zw[0]]
        value_zw = value_zw=='无'? '' :value_zw
        if(value_zw != this.data.value_zw){
            this.setData({
                value_zw: value_zw
            })

            this.getSearch()
        }
        this.close_picker()
    },
    input_zw: function (e) {
        this.setData({
            key_zw: e.detail.value,
            index_zw: [0]
        })
        this.getList({
            value_zg: this.data.value_zg,
            value_zw: e.detail.value
        })
    },
    change_time: function(e) {
        this.setData({
            value_time: e.detail.value
        })
        this.getSearch()
    },
    getList: function (d) {
        let that = this
        wx.request({
            url: url + '/worksite/check/search-list',
            data: {
                hui_id: this.data.expo.hui_id,
                zguan: d.value_zg || '',
                search: d.value_zw || ''
            },
            success(data) {
                let res = data.data,
                    list_zg = ['无'],
                    list_zw = ['无']

                if(res.Code == 200){
                    list_zg.push(...res.data.czs_zguan)
                    list_zw.push(...res.data.czs_number)
                }

                if(!d.value_zg && !d.value_zw ){
                    that.setData({
                        list_zg: list_zg,
                        list_zw: list_zw,
                        list_zg_all: list_zg,
                        list_zw_all: list_zw
                    })
                }else{
                    that.setData({
                        list_zw: list_zw
                    })
                }
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },
    getSearch: function () {
        let that = this
        wx.request({
            url: url + '/worksite/check/mi-time-out',
            data: {
                project_id: this.data.expo.hui_id,
                number: this.data.value_zw,
                date: this.data.value_time
            },
            success(data) {
                let res = data.data,
                    list = []
                if(res.Code == 200){
                    list = Object.values(res.data)
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
    
    close_picker: function(){
        this.setData({
            picker_show: false,
            picker_show_zg: false,
            picker_show_zw: false,
            picker_show_time: false
        })
    },
    show_picker_zg: function(){
        this.setData({
            picker_show: true,
            picker_show_zg: true,
            picker_show_zw: false,
            picker_show_time: false
        })
    },
    show_picker_zw: function(){
        this.setData({
            picker_show: true,
            picker_show_zg: false,
            picker_show_zw: true,
            picker_show_time: false
        })
        
    },
    // show_picker_time: function(){
    //     this.setData({
    //         picker_show: true,
    //         picker_show_zg: false,
    //         picker_show_zw: false,
    //         picker_show_time: true
    //     })
    // },
    
})