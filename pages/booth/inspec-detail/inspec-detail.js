const app = getApp()
var url = app.globalData.url;
Page({
    data: {
        expo: app.globalData.expo,
        detail: {},
        info: {zwh:[], count:0},
        value_zg: '',
        picker_show: false,
        list_zg: ['无'],
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
        this.getList()
        
    },
    getList: function () {
        let that = this
        wx.request({
            url: url + '/worksite/inspection/get-inspe-total',
            data: {
                hui_id: this.data.expo.hui_id,
                type: this.data.detail.type,
            },
            success(data) {
                let res = data.data;
                if(res.Code == 200){
                    let list = res.data.data
                    that.setData({
                        info: list[that.data.detail.title][that.data.detail.status]
                    })

                    let list_zg = ['无']
                    that.data.info.zwh.forEach(element => {
                        let zg = element.zg_hao
                        if(list_zg.indexOf(zg)<0){
                            list_zg.push(zg)
                        }
                    });

                    that.setData({
                        list_zg: list_zg
                    })
                }
                
                
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },

    show_picker_zg: function(){
        this.setData({
            picker_show: true
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
                })
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