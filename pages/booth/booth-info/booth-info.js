const app = getApp()
var url = app.globalData.url;
Page({
    data: {
        expo: app.globalData.expo,
        msg_show: false,
        picker_show: false,
        picker_show_zg: false,
        picker_show_zw: false,
        picker_show_zs: false,
        list_zg: [],
        list_zw: [],
        list_zs: [],
        value_zg: '',
        value_zw: '',
        value_zs: '',
        index_zg: [0],
        index_zw: [0],
        index_zs: [0],
        // key_zg: '',
        key_zw: '',
        // key_zs: '',
        list_zg_all: [],
        list_zw_all: [],
        list_zs_all: [],

        detail:{
            // data:[]
        }
    },
    // onShareAppMessage: function(){},
    onLoad: function () {

    },
    onShow: function () {
        this.setData({
            expo: app.globalData.expo
        })
        this.getList({type: 1})
    },
    go_detail: function(e){
        let _info = e.currentTarget.dataset.info
        let d = this.data.detail
        d._info = _info
        app.globalData.booth_info = d
        wx.navigateTo({
            url: '/pages/booth/detail/detail'
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
                value_zg: value_zg,
                // value_zw: '',
                // value_zs: '',
                // index_zw: [0],
                // index_zs: [0],
            })
            this.getList({
                value_zg: value_zg,
                value_zw: this.data.value_zw,
                value_zs: this.data.value_zs
            })
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
                value_zw: value_zw,
                value_zs: '',
                index_zs: [0],
            })
            this.getList({
                value_zg: this.data.value_zg,
                value_zw: value_zw,
                value_zs: this.data.value_zs
            })

            this.getDetail()
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
            value_zw: e.detail.value,
            value_zs: this.data.value_zs
        })
    },
    input_change: function (e) {
        // let key = e.currentTarget.dataset.name
        this.setData({
            value_zs: e.detail.value
        })
    },
    change_zs: function(e){
        this.setData({
            index_zs: e.detail.value
        })
    },
    select_zs: function(){
        let value_zs = this.data.list_zs[this.data.index_zs[0]]
        // console.log(value_zs)
        value_zs = value_zs=='无'? '' :value_zs
        if(value_zs != this.data.value_zs){
            this.setData({
                value_zs: value_zs
            })
        }
        this.getList({
            value_zg: this.data.value_zg,
            value_zw: this.data.value_zw,
            value_zs: value_zs
        })
        this.close_picker()
    },
    getList: function (d) {
        let that = this
        wx.request({
            url: url + '/worksite/check/search-list',
            data: {
                hui_id: this.data.expo.hui_id,
                zguan: d.value_zg || '',
                search: d.value_zw || '',
                name: d.value_zs || ''
            },
            success(data) {
                let res = data.data,
                    list_zg = ['无'],
                    list_zw = ['无'],
                    list_zs = ['无']

                // console.log(res)
                if(res.Code == 200){
                    list_zg.push(...res.data.czs_zguan)
                    list_zw.push(...res.data.czs_number)
                    list_zs.push(...res.data.czs_nickname)
                }
                // type 1初始  2模糊展位 3模糊展商
                if(!d.value_zg && !d.value_zw && !d.value_zs){
                    that.setData({
                        list_zg: list_zg,
                        list_zw: list_zw,
                        list_zs: list_zs,
                        list_zg_all: list_zg,
                        list_zw_all: list_zw,
                        list_zs_all: list_zs
                    })
                }else if(!d.value_zg && !d.value_zw){
                    that.setData({
                        list_zg: list_zg,
                        list_zw: list_zw,
                        list_zs: that.data.list_zs_all
                    })
                }else if(!d.value_zg && !d.value_zs){
                    that.setData({
                        list_zg: list_zg,
                        list_zw: that.data.list_zw_all,
                        list_zs: list_zs
                    })
                }else if(!d.value_zw && !d.value_zs){
                    that.setData({
                        list_zg: that.data.list_zg_all,
                        list_zw: list_zw,
                        list_zs: list_zs
                    })
                }else{
                    that.setData({
                        list_zg: list_zg,
                        list_zw: list_zw,
                        list_zs: list_zs
                    })
                }
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },
    getDetail: function () {
        let that = this
        wx.request({
            url: url + '/worksite/check/booth-detail',
            data: {
                hui_id: this.data.expo.hui_id,
                booth: this.data.value_zw
            },
            success(data) {
                let res = data.data,
                    detail = {}
                if(res.Code == 200){
                    detail = res.data
                }
                that.setData({
                    detail: detail
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
            msg_show: false,
            picker_show_zg: false,
            picker_show_zw: false,
            picker_show_zs: false
        })
    },
    show_msg: function(){
        this.setData({
            picker_show: true,
            msg_show: true,
            picker_show_zg: false,
            picker_show_zw: false,
            picker_show_zs: false
        })
    },
    show_picker_zg: function(){
        this.setData({
            picker_show: true,
            msg_show: false,
            picker_show_zg: true,
            picker_show_zw: false,
            picker_show_zs: false
        })
    },
    show_picker_zw: function(){
        this.setData({
            picker_show: true,
            msg_show: false,
            picker_show_zg: false,
            picker_show_zw: true,
            picker_show_zs: false
        })
        
    },
    show_picker_zs: function(){
        this.getList({
            value_zg: this.data.value_zg,
            value_zw: this.data.value_zw,
            value_zs: this.data.value_zs
        })
        this.setData({
            picker_show: true,
            msg_show: false,
            picker_show_zg: false,
            picker_show_zw: false,
            picker_show_zs: true
        })
    },
    
})