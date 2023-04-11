const app = getApp()
var url = app.globalData.url;
Page({
    data: {
        expo: app.globalData.expo,
        detail: {},
        value_zg: '',
        picker_show: false,
        list_zg: [],
        index_zg: [0],
    },
    // onShareAppMessage: function(){},
    onLoad: function () {

    },
    onShow: function () {
        this.setData({
            expo: app.globalData.expo,
            detail: app.globalData.inspec_detail
        })
        let list_zg = []
        this.data.detail.forEach(element => {
            let zg = element.zg_hao
            if(list_zg.indexOf(zg)<0){
                list_zg.push(zg)
            }
        });
        this.setData({
            list_zg: list_zg
        })
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
    close_picker: function(){
        this.setData({
            picker_show: false
        })
    },
    
})