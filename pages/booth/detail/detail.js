const app = getApp()
Page({
    data: {
        url: app.globalData.url,
        expo: app.globalData.expo,
        msg_show: false,
        detail: {},
        file_list: [],
    },
    onLoad: function () {

    },
    onShow: function () {

        this.setData({
            url: app.globalData.url,
            expo: app.globalData.expo,
            detail: app.globalData.booth_info
        })
        // console.log(this.data.detail)
        if(this.data.detail._info.file.length){
            let list = [],
                file = this.data.detail._info.file
            file.forEach(element => {
                if(element.img_type == '0'){
                    list.push(this.data.url+element.img)
                }
                
            });
            this.setData({
                file_list: list
            })
        }
    },
    show_msg: function(){
        this.setData({
            msg_show: true
        })
    },
    telPhone: function(e){
        // console.log(e)
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.tel,
            fail: function(err){
                console.log(err)
            }
        })
    },
    preview: function(e){
        wx.showLoading({
            title: '加载中',
        })
        let file = e.currentTarget.dataset.file
        console.log(file)
        if (file.img_type == '0') {
            wx.previewImage({
                current: this.data.url+file.img,
                urls: this.data.file_list,
                success: function (res) {
                    console.log('打开文档成功')
                },
                complete: function (res) {
                    wx.hideLoading()
                }
            })
        } else {
            // pdf
            wx.downloadFile({
                url: this.data.url+file.img,
                success: function (res) {
                    const filePath = res.tempFilePath
                    wx.openDocument({
                        filePath: filePath,
                        showMenu: true,
                        success: function (res) {
                            console.log('打开文档成功')
                        },
                        complete: function (res) {
                            wx.hideLoading()
                        }
                    })
                }
            })
        }
    },
    close_msg: function(){
        this.setData({
            msg_show: false,
            msg_show_img: false,
        })
    },
    show_picker_zg: function(){
        this.setData({
            picker_show: true,
            msg_show_img: true,
            picker_show_zw: false,
            picker_show_zs: false
        })
    },
    
})