var app = getApp()
var url = app.globalData.url;
Page({
    data: {
        animationData: {},//选择动画
        showModalStatus: false,//显示遮罩
    },
    onLoad: function (options) {

    },
    onShow() {
        var that = this;
        var animation = wx.createAnimation({//动画
            duration: 500,//动画持续时间
            timingFunction: 'linear',//动画的效果 动画从头到尾的速度是相同的
        })
        animation.translateY(0).step()//在Y轴偏移tx，单位px

        this.animation = animation
        that.setData({
            showModalStatus: true,//显示遮罩       
            animationData: animation.export(),
            isHidden: 1
        })
    },
    getUserProfile(){
        var that = this;
        // return
        wx.getUserProfile({
          desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            console.log('getUserProfile',res)
            that.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
            })
            wx.login({
              success: (open) => {
                var code = open.code
                wx.request({
                    url: url + 'worksite/default/index',//跳转首页
                    data: {
                        code: code,
                        encryptedData: res.encryptedData,
                        iv: res.iv
                    },
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success(res) {
                        console.log('login',res)
                        wx.setStorageSync('openId', res.data.data.openId)
                        wx.setStorageSync('sessionKey', res.data.data.sessionKey)
                        wx.navigateBack()
                    }
                })
        

              }
            })
          }
        })
      },
    //获取用户信息
    // getUserInfo: function (cb) {
    //     var that = this
    //     if (this.globalData.personInfo) {
    //         typeof cb == "function" && cb(this.globalData.personInfo)
    //     } else {
    //         //调用登录接口
    //         wx.login({
    //             success: function () {
    //                 wx.getUserInfo({
    //                     success: function (res) {
    //                         that.globalData.personInfo = res.userInfo
    //                         typeof cb == "function" && cb(that.globalData.personInfo)
    //                     }
    //                 })
    //             }
    //         })
    //     }
    // },
    onGotUserInfo: function (e) {
        var that = this;
        wx.login({
            success(res) {
                var code = res.code
                wx.getUserInfo({
                    success: res => {
                        wx.request({
                            url: url + 'worksite/default/index',//跳转首页
                            data: {
                                code: code,
                                encryptedData: res.encryptedData,
                                iv: res.iv
                            },
                            header: {
                                'content-type': 'application/json' // 默认值
                            },
                            success(res) {
                                that.setData({
                                    userInfo: e.detail.userInfo,
                                    hasUserInfo: true
                                })
                                wx.setStorageSync('openId', res.data.data.openId)
                                wx.setStorageSync('sessionKey', res.data.data.sessionKey)
                                wx.navigateBack()
                            }
                        })
                    }
                })
            }
        })
    },
    /**隐藏选择规格区块 */
    hideModal: function (data) {

        var that = this;
        that.setData({//把选中值，放入判断值中
            showModalStatus: false,//显示遮罩       
            isHidden: 0,
        })
        wx.navigateBack()

    },

})