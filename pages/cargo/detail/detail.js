const app = getApp()
Page({
    data: {
        host: app.globalData.url,
        expo: app.globalData.expo,
        open_id: wx.getStorageSync('openId'),
        id: '',
        detail: {},
    },
    onLoad(op) {
        if (op.id) {
            this.setData({
                id: op.id
            })
        }
        this.getData()
    },
    onReady() {

    },
    onShow() {

    },
    onHide() {

    },
    onShareAppMessage() {

    },
    getData(){
        let that = this
        wx.request({
            url: this.data.host + 'worksite/car-info/detail/'+this.data.id,
            success: function (res) {
                let d = res.data
                if (d.Code == 200) {
                    that.setData({
                        detail: d.data
                    })
                }else{
                    wx.showToast({
                        title: d.msg,
                        icon: 'none',
                    })
                }
                
            },
            fail: function (res) {
                console.log(res)
            },
            complete: function(res){
                // console.log(res)
            }
        })
    },
    up_status:function(e){
        let that = this
        let type = e.currentTarget.dataset.type,
            d = {}
        console.log(type)
        if(type == '0'){
            d = {recibir_status: 1}
        }else if(type == '1'){
            d = {status: 1}
        }else if(type == '2'){
            d = {status: 2}
        }
        wx.request({
            url: this.data.host + 'worksite/car-info/detail/'+this.data.id,
            data: d,
            method: 'PUT',
            success: function (res) {
                let d = res.data
                wx.showToast({
                    title: d.msg,
                    icon: 'none',
                })
                if (d.Code == 200) {
                    that.getData()
                }else{
                    // wx.showToast({
                    //     title: d.msg,
                    //     icon: 'none',
                    // })
                }
                
            },
            fail: function (res) {
                console.log(res)
            },
            complete: function(res){
                // console.log(res)
            }
        })
    },
    topic_preview: function(e){
        var index = e.currentTarget.dataset.index;
        var list = [
            this.data.host+this.data.detail.drive_front,
            this.data.host+this.data.detail.drive_reverse,
        ];
        wx.previewImage({
          current: list[index],
          urls: list,
        })
    },
})