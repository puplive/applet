const app = getApp()
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar2();
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
  // 获取用户信息
  wx.getUserInfo({
    success: function (res) {
      var avatarUrl = 'userInfo.avatarUrl';
      var nickName = 'userInfo.nickName';
      var tel = 'userInfo.tel';
      that.setData({
        [avatarUrl]: res.userInfo.avatarUrl, [nickName]: res.userInfo.nickName,[tel]: res.userInfo.tel,
      })
    }
  })
  wx.request({
    url: url + '/worksite/user/user-content',
    data: { OpenId: wx.getStorageSync('openId'),role_id:sendMessageContent.RoleId},
    method: 'GET',
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      if (res.data.Code == 200) {
        that.setData({
          tel: res.data.data.tel,
          role_name: res.data.data.role_name,
        })
        // console.log(222,that.data.projectcon);
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

  }
})