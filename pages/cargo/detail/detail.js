const app = getApp()
Page({
    data: {
        host: app.globalData.url,
        expo: app.globalData.expo,
        open_id: wx.getStorageSync('openId'),
        id: '',
        detail: {},
        lq: '0',
        rc: '0',
        picker_show: false,
        refund: {}
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
    getData() {
        let that = this
        wx.request({
            url: this.data.host + 'worksite/car-info/detail/' + this.data.id,
            success: function (res) {
                let d = res.data
                if (d.Code == 200) {
                    if(d.data.refund_status == '1'){
                        wx.showToast({
                            title: '已退款',
                            icon: 'error',
                            duration: '2000'
                        })
                    }
                    that.setData({
                        detail: d.data,
                        lq: d.data.recibir_status,
                        rc: d.data.status
                    })
                } else {
                    wx.showToast({
                        title: d.msg,
                        icon: 'none',
                    })
                }

            },
            fail: function (res) {
                console.log(res)
            },
            complete: function (res) {
                // console.log(res)
            }
        })
    },
    change_lq: function(){
        if(this.data.detail.recibir_status == '0'){
            let lq = this.data.lq == '1'? '0': '1'
            this.setData({
                lq: lq,
                rc: lq == '0'? '0' :this.data.rc
            })
        }
    },
    change_rc: function(){
        if(this.data.detail.status == '0'){
            let rc = this.data.rc == '0'? '1': '0'
            this.setData({
                rc: rc,
                lq: rc == '1'? '1': this.data.lq
            })
        }
    },
    change_cc: function(){
        if(this.data.detail.status != '2'){
            let rc = this.data.rc != '2'? '2': '1'
            this.setData({
                rc: rc,
                lq: rc == '2'? '1': this.data.lq
            })
            if(rc == '2'){
                this.refund_before()
            }
        }
    },
    close_refund: function(){
        if(this.data.detail.status != '2'){
            let rc = '1'
            this.setData({
                rc: rc,
                lq: this.data.lq
            })
        }
    },
    refund_before: function(){
        let that = this
        wx.request({
            url: that.data.host + 'worksite/car-info/refund-before/' + that.data.id,
            method: 'GET',
            success: function (res) {
                let d = res.data
                if (d.Code == 200) {
                    that.setData({
                        refund: d.data,
                        picker_show: true
                    })
                } else {
                    wx.showToast({
                        title: d.msg,
                        icon: 'none',
                    })
                }
            },
            fail: function (res) {
                console.log(res)
            }
        })
    },
    sub_cc: function(){
        let d = {
                openid: this.data.open_id,
                before_time: this.data.refund.end_time
            };
        if(this.data.lq != this.data.detail.recibir_status){
            d.recibir_status = this.data.lq
        }
        if(this.data.rc != this.data.detail.status){
            d.status = this.data.rc
        }
        this.sub(d)
    },
    sub: function(data){
        let that = this
        wx.request({
            url: that.data.host + 'worksite/car-info/detail/' + that.data.id,
            data: data,
            method: 'PUT',
            success: function (res) {
                let d = res.data
                wx.showToast({
                    title: d.msg,
                    icon: 'none',
                })
                if (d.Code == 200) {
                    setTimeout(() => {
                        wx.navigateBack()
                    }, 1500);
                    
                } else {
                    that.getData()
                }

            },
            fail: function (res) {
                that.getData()
                console.log(res)
            }
        })
    },
    up_status: function (e) {
        let that = this
        if(that.data.lq == that.data.detail.recibir_status && that.data.rc == that.data.detail.status){
            return
        }
        let type = e.currentTarget.dataset.type,
            d = {
                openid: that.data.open_id,
                // recibir_status: that.data.lq,
                // status: that.data.rc
            },
            msg = '确定修改？';
        if(that.data.lq != that.data.detail.recibir_status){
            d.recibir_status = that.data.lq
        }
        if(that.data.rc != that.data.detail.status){
            d.status = that.data.rc
        }
        // if (type == '0') {
        //     msg = '确定领取？'
        //     d.recibir_status = 1
        // } else if (type == '1') {
        //     msg = '确定入场？'
        //     d.status = 1
        // } else if (type == '2') {
        //     msg = '确定出场？'
        //     d.status = 2
        // }
        wx.showModal({
            // title: '提示',
            content: msg,
            success(res) {
                if (res.confirm) {
                    that.sub(d)
                } else if (res.cancel) {
                    // console.log('用户点击取消')
                }
            }
        })

    },
    topic_preview: function (e) {
        var index = e.currentTarget.dataset.index;
        var list = [
            this.data.host + this.data.detail.drive_front,
            this.data.host + this.data.detail.drive_reverse,
        ];
        wx.previewImage({
            current: list[index],
            urls: list,
        })
    },
})