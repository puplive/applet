const app = getApp()
var url = app.globalData.url;
Page({
    data: {
        car: '',
        scanCodeStop: false
    },
    onLoad() {
        let that = this
        this.ctx = wx.createCameraContext()
        this.cameraFrame()
    },
    onShow() {
        // this.audioPlay()
    },
    back(){
        wx.navigateBack()
    },
    toDetail(){
        let that = this
        wx.request({
            url: url + 'worksite/car-info/car',
            data: {
                projectId: app.globalData.expo.hui_id,
                page: 1,
                limit: 12,
                status: '',
                search: this.data.car,
            },
            success(res) {
                let data = res.data.data
                // console.log(data)
                let list = data.data;
                if(list.length){
                    wx.redirectTo({
                        url: `/pages/cargo/detail/detail?id=${list[0].id}`
                    })
                }else{
                    wx.showModal({
                        content: '车牌无记录',
                        showCancel: false,
                        success (res) {
                            that.start()
                        }
                    })
                }
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },
    refresh(){
        this.start()
    },
    scanCode(res) {
        console.log(res)
        let detail = res.detail
        if(detail.type == 'QR_CODE'){
            this.audioPlay()
            let result = {}
            if (detail.result.indexOf('cargo') > 0) {
                result = JSON.parse(detail.result)
            }
            if (result.from == 'cargo') {
                wx.redirectTo({
                    url: '/pages/cargo/detail/detail?id=' + result.id
                })
            } else {
                wx.showModal({
                    title: '无效信息',
                    content: detail.result,
                    showCancel: false
                })
            }
        }      
    },
    cameraFrame() {
        let plateNumberRegex = /[京津沪渝晋蒙辽吉黑冀豫鲁皖苏浙皖苏浙赣鄂湘粤桂琼川贵云陕甘青藏宁新][A-HJ-NP-Z0-9挂学警港澳]{5}[A-HJ-NP-Z0-9挂学警港澳领使]{1}/;
        let newEnergyPlateNumberRegex = /[京津沪渝晋蒙辽吉黑冀豫鲁皖苏浙皖苏浙赣鄂湘粤桂琼川贵云陕甘青藏宁新][DF][A-HJ-NP-Z0-9]{5}[A-HJ-NP-Z0-9挂学警港澳领使]{1}/;
        let nCounter = 0
        let that = this;
        const session = wx.createVKSession({
            track: {
                OCR: {
                    mode: 2
                }
            },
        })
        session.on('updateAnchors', anchors => {
            let text = "".concat(anchors.map(anchor => anchor.text))
            console.log(text)
            var match = text.match(newEnergyPlateNumberRegex) || text.match(plateNumberRegex);
            console.log(match)
            if(match){
                that.audioPlay()
                that.stop()
                wx.showModal({
                    title: '确认车牌',
                    content: match[0],
                    cancelText: '刷新',
                    success (res) {
                        if (res.confirm) {
                            that.setData({
                                car: match[0]
                            })
                            that.toDetail()
                        } else if (res.cancel) {
                            that.start()
                        }
                    }
                })
            }else{
                that.start()
            }
        })
        session.start(errno => {
            if (errno) {} else {
            }
        })
        this.cameraContext = this.ctx.onCameraFrame((frame) => {
            if (nCounter == 30) {
                
                session.runOCR({
                    frameBuffer: frame.data,
                    width: frame.width,
                    height: frame.height,
                })
            } else if (nCounter >= 60) {
                nCounter = 0
            }
            nCounter++
        })
        that.start()
    },
    start() {
        this.cameraContext.start()
    },
    stop() {
        this.cameraContext.stop()
    },
    audioPlay(){
        const innerAudioContext = wx.createInnerAudioContext({
            useWebAudioImplement: true
        })
        innerAudioContext.src = '/images/scancode.mp3'
        innerAudioContext.onCanplay((res)=>{
            console.log(res)
            innerAudioContext.play() // 播放
        })
        innerAudioContext.onEnded((res)=>{
            console.log(res)
            innerAudioContext.destroy() // 释放音频资源
        })
        
    },

    ocr_data(img) {
        let that = this
        wx.serviceMarket.invokeService({
            service: 'wx79ac3de8be320b71',
            api: 'OcrAllInOne',
            data: {
                // 用 CDN 方法标记要上传并转换成 HTTP URL 的文件
                img_url: new wx.serviceMarket.CDN({
                    type: 'filePath',
                    filePath: img,
                }),
                data_type: 2,
                ocr_type: 10
            },
        }).then(res => {
            console.log('invokeService success', res)
        }).catch(err => {
            console.error('invokeService fail', err)
        })
    },
    error(e) {
        console.log('error-camera', e.detail)
    }
})