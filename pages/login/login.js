var app = getApp()
var url = app.globalData.url;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    animationData: {},//选择动画
    showModalStatus: false,//显示遮罩
  },
  onGotUserInfo: function (e) {
    var that = this;
    wx.login({
      success: res => {
        var that = this;
        var code = res.code
        wx.getUserInfo({
          success: res => {
            wx.request({
              url: 'http://test.exposaas.cn/worksite/default/index', //跳转首页
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
                wx.navigateTo({
                  url: '../expo/expo',
                })
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

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
      specNum: 1
    })
    that.setData({//把选中值，放入判断值中
      isHidden: 1,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})