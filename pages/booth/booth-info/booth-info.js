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

        list_zg_log: [],
        list_zw_log: [],
        list_zs_log: [],

        detail:{
            // data:[]
        },

        list_type: '1',
        list_inspec: []
    },
    // onShareAppMessage: function(){},
    onLoad: function(options) {
        if(options.zwh){
            this.setData({
                value_zw: options.zwh,
                value_zs: '',
                index_zs: [0],
                list_type: '2'
            })
            this.getList({
                value_zg: this.data.value_zg,
                value_zw: options.zwh,
                value_zs: this.data.value_zs
            }, 'zw')

            this.getDetail()
        }else if(options.type){
            this.setData({
                list_type: options.type
            })
        }
    },
    onShow: function () {
        this.setData({
            expo: app.globalData.expo
        })
        this.getList({}, 'all')
    },
    check_tab: function(e){
        this.setData({
            list_type: e.currentTarget.dataset.type
        })
    },
    set_status_2: function(e){
        let info = e.currentTarget.dataset.info
        let status = info.status != '2'? '2': '1'

        this.set_inspec(info.id, status)
    },
    set_status_3: function(e){
        let info = e.currentTarget.dataset.info
        let status = info.status != '3'? '3': '1'

        this.set_inspec(info.id, status)
    },
    telPhone: function(e){
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.tel,
            fail: function(err){
                console.log(err)
            }
        })
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
        let _this = this
        setTimeout(() => {
            let value_zg = _this.data.list_zg[_this.data.index_zg[0]]
            value_zg = value_zg=='无'? '' :value_zg
            if(value_zg != _this.data.value_zg){
                _this.setData({
                    value_zg: value_zg,
                    // value_zw: '',
                    // value_zs: '',
                    // index_zw: [0],
                    // index_zs: [0],
                })
                _this.getList({
                    value_zg: value_zg,
                    // value_zw: _this.data.value_zw,
                    // value_zs: _this.data.value_zs
                }, 'zg')
            }
            _this.close_picker()
        }, 400);
    },
    change_zw: function(e){
        this.setData({
            index_zw: e.detail.value
        })
    },
    select_zw: function(){
        let _this = this
        setTimeout(() => {
            let value_zw = _this.data.list_zw[_this.data.index_zw[0]]
            value_zw = value_zw=='无'? '' :value_zw
            if(value_zw != _this.data.value_zw){
                _this.setData({
                    value_zw: value_zw,
                    value_zs: '',
                    index_zs: [0],
                })
                _this.getList({
                    value_zg: _this.data.value_zg,
                    value_zw: value_zw,
                    value_zs: _this.data.value_zs
                }, 'zw')

                _this.getDetail()
            }
            _this.close_picker()
        }, 400)
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
        }, 'zw2')
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
        let _this = this
        setTimeout(() => {
            let value_zs = _this.data.list_zs[_this.data.index_zs[0]]
            // console.log(value_zs)
            value_zs = value_zs=='无'? '' :value_zs
            if(value_zs != _this.data.value_zs){
                _this.setData({
                    value_zs: value_zs
                })
            }
            _this.getList({
                value_zg: _this.data.value_zg,
                // value_zw: _this.data.value_zw,
                value_zs: value_zs
            }, 'zs')
            _this.close_picker()
        }, 400)
    },
    getList: function (d,type) {
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

                if(type == 'all'){
                    that.setData({
                        list_zg: list_zg,
                        list_zw: list_zw,
                        list_zs: list_zs,

                        list_zg_all: list_zg,
                        list_zw_all: list_zw,
                        list_zs_all: list_zs,

                        list_zg_log: list_zg,
                        list_zw_log: list_zw,
                        list_zs_log: list_zg,
                    })
                }else if(type == 'zw'){
                    list_zw =  that.data.list_zw_log
                    that.setData({
                        value_zg: list_zg[1],
                        value_zs: list_zs[1],

                        list_zg: list_zg,
                        list_zw: list_zw,
                        list_zs: list_zs,

                        list_zg_log: list_zg,
                        list_zw_log: list_zw,
                        list_zs_log: list_zs,

                    })
                    
                }else if(type == 'zg'){
                    list_zg =  that.data.list_zg_log
                    that.setData({
                        list_zg: list_zg,
                        list_zw: list_zw,
                        list_zs: list_zs,

                        list_zg_log: list_zg,
                        list_zw_log: list_zw,
                        list_zs_log: list_zs,
                    })
                    if(list_zw.length == 2){
                        that.setData({
                            value_zw: list_zw[1]
                        })
                        if(list_zs.length == 2){
                            that.setData({
                                value_zs: list_zs[1]
                            })
                        }
                        that.getDetail()
                    }else{
                        that.setData({
                            value_zw: '',
                            detail: {}
                        })
                    }
                }else if(type == 'zs'){
                    list_zs =  that.data.list_zs_log
                    that.setData({
                        list_zg: list_zg,
                        list_zw: list_zw,
                        list_zs: list_zs,

                        list_zg_log: list_zg,
                        list_zw_log: list_zw,
                        list_zs_log: list_zs,
                    })
                    if(list_zw.length == 2){
                        that.setData({
                            value_zw: list_zw[1]
                        })
                        that.getDetail()
                    }else{
                        that.setData({
                            value_zw: '',
                            detail: {}
                        })
                    }
                }else if(type == 'zw2'){
                    that.setData({
                        list_zw: list_zw,
                        list_zw_log: list_zw,
                    })
                }else if(type == 'zs2'){
                    that.setData({
                        list_zs: list_zs,
                        list_zs_log: list_zs,
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
                that.get_zwh_inspec()
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },

    get_zwh_inspec: function () {

        let that = this
        wx.request({
            url: url + '/worksite/inspection/get-zwh-inspec',
            data: {
                hui_id: this.data.expo.hui_id,
                czs_id: this.data.detail.czs_id,
                type: this.data.detail.czs_type,
            },
            success(data) {
                let res = data.data,
                    list_inspec = []
                if(res.Code == 200){
                    list_inspec = Object.values(res.data)
                }
                that.setData({
                    list_inspec: list_inspec
                })
                
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },
    set_inspec: function (id, status) {

        let that = this
        wx.request({
            url: url + '/worksite/inspection/inspe-operate',
            data: {
                inp_id: id,
                hui_id: this.data.expo.hui_id,
                czs_id: this.data.detail.czs_id,
                status: status
            },
            dataType: 'json',
            success(data) {
                let res = data.data
                if(res.Code == 200){
                    that.get_zwh_inspec()
                }
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
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
        }, 'zs2')
        this.setData({
            picker_show: true,
            msg_show: false,
            picker_show_zg: false,
            picker_show_zw: false,
            picker_show_zs: true
        })
    },

    
})