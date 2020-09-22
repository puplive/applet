const app = getApp()
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // hiddenName: true
    show_hui_id: 0,
    name:'',
    discountName:'',
  },
  click: function (e) {
    this.setData({
      // hiddenName: !this.data.hiddenName
      show_hui_id: e.currentTarget.dataset.huiId,
    })

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
    var name = getApp().globalData.name
    var discountName = getApp().globalData.discountName
    if (name || discountName) {
      this.setData({
        name: name,
        discountName: discountName,
      })
    }
    var that = this;
    wx.request({
      url: url + 'field/default/hui-all',
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.Code == 200) {
          that.setData({
            huiinfo: res.data.data,
            huiinfo_len: Object.keys(res.data.data).length,
          })
        } else {

        }
      },
      fail: function (err) {
        // 服务异常
      }
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

  },
  choice_btn: function (e) {//进入项目
    sendMessageContent.projectId = e.target.dataset.key
    var that = this;
    wx.request({
      url: url + 'worksite/default/c-zhui',   //验证是否认证过
      data: { OpenId: wx.getStorageSync('openId'),ProjectId: sendMessageContent.projectId},
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.Code == 200) {
          sendMessageContent.RoleId = res.data.data.applet_role_id;
          if(res.data.data.applet_role_id<3){
            if(res.data.data.applet_role_id==1){
              wx.redirectTo({
                url: "../admin/admin"
              })
            }else{
              wx.redirectTo({
                url: "../cruise/acceptance/acceptance"
              })
            }
          }else{
            wx.redirectTo({
              url: "../operator/operator"
            })
         }
        }else if (res.data.Code == 400) {//提示您还没授权
          wx.showToast({
            title: '未授权,请前往授权',
            icon: 'none',
            duration: 5000//持续的时间
          })
          wx.navigateTo({
             url: '/pages/login/login',
          })
        }else {
          wx.navigateTo({
            url: "../admin/person/identity/identity?hui=" + sendMessageContent.projectId
          })
        }
      }
    })
  },
})