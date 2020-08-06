var app = getApp();
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    check_id:'', //整条验收id
    id:'' //单个id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.check_id) {
      this.setData({
        check_id: options.check_id, //展位联系人
      })
    }
  },
  // 通过按钮
  agreeBtn: function(){
    var openId = wx.getStorageSync('openId')
    var list = this.data.accepArray
    var id = list[list.length-1].id
    var that = this;
    wx.request({
      url: url + 'worksite/check/check-pass',
      data: {check_id:that.data.check_id,check_info_id:id},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        if (res.data.Code == 200) {
          wx.showToast({
            title: '成功通过',
            icon: 'none',
            duration: 2000   //持续的时间
          })
        } else {
          wx.showToast({
            title: '通过失败',
            icon: 'none',
            duration: 2000   //持续的时间
          })
        }
      },
      fail: function (err) {
        // 服务异常
      }
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
    var openId = wx.getStorageSync('openId')
    var that = this;
    wx.request({
      url: url + 'worksite/check/clist-details',
      data: {check_id:that.data.check_id},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        if (res.data.Code == 200) {
          that.setData({
            accepArray: res.data.data.data,
            z_guan:res.data.data.info.z_guan,  //展馆号
            zw_hao:res.data.data.info.zw_hao,   //展位号
            phone:res.data.data.info.phone,  //手机号
            contact:res.data.data.info.contact,  //联系人
            
          })
          console.log('id',that.data.accepArray)
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