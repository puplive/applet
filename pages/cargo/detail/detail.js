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
                        detail: d.data
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
    up_status: function (e) {
        let that = this
        let type = e.currentTarget.dataset.type,
            d = {
                openid: that.data.open_id
            },
            msg = '';
        if (type == '0') {
            msg = '确定领取？'
            d.recibir_status = 1
        } else if (type == '1') {
            msg = '确定入场？'
            d.status = 1
        } else if (type == '2') {
            msg = '确定出场？'
            d.status = 2
        }
        wx.showModal({
            // title: '提示',
            content: msg,
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: that.data.host + 'worksite/car-info/detail/' + that.data.id,
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
                            } else {}

                        },
                        fail: function (res) {
                            console.log(res)
                        }
                    })
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