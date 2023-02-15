//获取应用实例
const app = getApp()
var url = app.globalData.url;
// var call = require("../../utils/request.js") 
Page({
    data: {
        expo: app.globalData.expo,
        title: '',
        content: '',
        type: '',
        id: '',
        editorHeight: 300,
        keyboardHeight: 0,
        keyboardHeight2: 0,
        isIOS: false
    },
    // onShareAppMessage: function(){},
    onLoad: function (options) {
        this.setData({
            expo: app.globalData.expo,
            id: options.id,
            type: options.type
        })

        this.editor_init()
    },
    onShow: function () {
        if (this.data.type == 'edit') {
            this.getData()
        }

    },

    input_change: function (e) {
        let key = e.currentTarget.dataset.name
        this.setData({
            [key]: e.detail.value
        })
    },
    onEditorReady: function () {
        let that = this
        wx.createSelectorQuery().select('#editor').context(function (res) {
            that.editorCtx = res.context


        }).exec()
    },
    setContent: function (content) {
        let that = this
        if (this.editorCtx) {
            this.editorCtx.setContents({
                html: content
            })
        } else {
            setTimeout(() => {
                that.setContent(content)
            }, 200);
        }
    },
    getData: function () {
        let that = this
        wx.request({
            url: url + '/field/notice/home-notice',
            data: {
                hui_id: this.data.expo.hui_id
            },
            success(data) {
                let res = data.data
                if (res.Code == 200) {
                    let list = res.data
                    for (const key in list) {
                        if (list[key].id == that.data.id) {
                            that.setData({
                                detail: list[key],
                                title: list[key].bname
                            })
                            break
                        }
                    }
                    that.setContent(that.data.detail.content)
                }
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },
    btnAdd: function () {
        let that = this
        this.editorCtx.getContents({
            success: function (res) {
                console.log(res)
                that.add(res.html)
            }
        })
    },
    btnEdit: function () {
        let that = this
        this.editorCtx.getContents({
            success: function (res) {
                console.log(res)
                that.edit(res.html)
            }
        })
    },
    add: function (content) {
        let that = this
        wx.request({
            url: url + 'field/notice/set-notice',
            data: {
                hui_id: this.data.expo.hui_id,
                title: this.data.title,
                content: content
            },
            success(data) {
                let res = data.data
                console.log(2, data)
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000//持续的时间
                })

                if (res.Code == 200) {
                    setTimeout(() => {
                        wx.navigateBack()
                    }, 1500)
                }
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },
    edit: function (content) {
        let that = this
        wx.request({
            url: url + 'field/notice/edit-notice',
            data: {
                notice_id: that.data.id,
                title: that.data.title,
                content: content
            },
            success(data) {
                console.log(1, data)
                let res = data.data
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000//持续的时间
                })

                if (res.Code == 200) {
                    setTimeout(() => {
                        wx.navigateBack()
                    }, 1500)
                }
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },

    editor_init() {
        const platform = wx.getSystemInfoSync().platform
        const isIOS = platform === 'ios'
        this.setData({ isIOS })
        const that = this
        this.updatePosition(0)
        let keyboardHeight = 0
        wx.onKeyboardHeightChange(res => {
            if (res.height === keyboardHeight) return
            const duration = res.height > 0 ? res.duration * 1000 : 0
            keyboardHeight = res.height
            let keyboardHeight2 = res.height
            this.setData({ keyboardHeight2 })
            setTimeout(() => {
                wx.pageScrollTo({
                    scrollTop: 0,
                    success() {
                        that.updatePosition(keyboardHeight)
                        that.editorCtx.scrollIntoView()
                    }
                })
            }, duration)

        })
    },
    onPageScroll(data) {
        console.log(data.scrollTop)
        let keyboardHeight = this.data.keyboardHeight2 - data.scrollTop
        this.setData({ keyboardHeight })
    },
    updatePosition(keyboardHeight) {
        const toolbarHeight = 50
        const { windowHeight, platform } = wx.getSystemInfoSync()
        let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
        this.setData({ editorHeight, keyboardHeight })
    },
    calNavigationBarAndStatusBar() {
        const systemInfo = wx.getSystemInfoSync()
        const { statusBarHeight, platform } = systemInfo
        const isIOS = platform === 'ios'
        const navigationBarHeight = isIOS ? 44 : 48
        return statusBarHeight + navigationBarHeight
    },
    blur() {
        this.editorCtx.blur()
    },

    format(e) {
        let { name, value } = e.target.dataset
        if (!name) return
        // console.log('format', name, value)
        this.editorCtx.format(name, value)

    },
    onStatusChange(e) {
        const formats = e.detail
        this.setData({ formats })
    },
    insertDivider() {
        this.editorCtx.insertDivider({
            success: function () {
                console.log('insert divider success')
            }
        })
    },
    clear() {
        this.editorCtx.clear({
            success: function (res) {
                console.log("clear success")
            }
        })
    },
    removeFormat() {
        this.editorCtx.removeFormat()
    },
    insertDate() {
        const date = new Date()
        const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        this.editorCtx.insertText({
            text: formatDate
        })
    },
    insertImage() {
        const that = this
        wx.chooseMedia({
              count: 1,
            mediaType: ['image'],
            success: function (res) {
                console.log(res)
                wx.showLoading({
                    title: '加载中',
                })
                wx.uploadFile({
                    url: url + 'field/notice/upload-img', //仅为示例，非真实的接口地址
                    filePath: res.tempFiles[0].tempFilePath,
                    name: 'file',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    // formData: {
                    //     'user': 'test'
                    // },
                    success(res) {
                        let data = JSON.parse(res.data)
                        console.log(data)
                        if(data.Code==200){
                            that.editorCtx.insertImage({
                                src: url + data.data.scalar,
                                data: {
                                    id: 'abcd',
                                    role: 'god'
                                },
                                width: '80%',
                                success: function () {
                                    console.log('insert image success')
                                },
                                complete: function () {
                                    wx.hideLoading()
                                }
                            })
                        }
                        
                    }
                })

            }
        })
    }
})
