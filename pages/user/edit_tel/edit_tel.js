// pages/myself/edit_tel/edit_tel.js
const app = getApp()
var url = app.globalData.url;
const phoneRexp = /^1[3-9]\d{9}$/;
Page({
  data: {
    sendTime: '获取验证码',
    snsMsgWait: 60,
    data_phone: '',
    data_code: '',
  },
  getInputKey: function (e) {
    this.setData({
      data_phone: e.detail.value
    })
  },
  getInputCode: function (e) {
    this.setData({
      data_code: e.detail.value
    })
  },
  save: function (e) {
    var that = this;
    var data_phone = this.data.data_phone;//手机号
    if (!data_phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000//持续的时间
      })
      return false;
    }
    if (!phoneRexp.test(data_phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 2000//持续的时间
      })
      return false;
    }
    wx.request({
      url: url + '/field/user/send-tel',
      data: { tel: data_phone },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        if (res.data.Code == 200) {
          wx.showToast({
            title: '发送成功',
            icon: 'none',
            duration: 2000//持续的时间
          })
        }
        var inter = setInterval(function () {
          that.setData({
            smsFlag: true,
            sendTime: that.data.snsMsgWait + 's后重发',
            snsMsgWait: that.data.snsMsgWait - 1
          });
          if (that.data.snsMsgWait < 0) {
            clearInterval(inter)
            that.setData({
              sendTime: '获取验证码',
              snsMsgWait: 60,
              smsFlag: false
            });
          }
        }.bind(that), 1000);


      },
      fail: function (err) {
        // 服务异常
      }
    })
  },
  savebtn: function (e) {
    //console.log(22,this.data);
    var that = this;
    var data_phone = this.data.data_phone;//手机号
    var data_code = this.data.data_code;//验证码
    if (!data_phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000//持续的时间
      })
      return false;
    }
    if (!data_code) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000//持续的时间
      })
      return false;
    }
    wx.request({
      url: url + '/field/user/user-tel',
      data: { tel: data_phone, code: data_code, open_id: wx.getStorageSync('openId') },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        if (res.data.Code == 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 2000//持续的时间
          })
          wx.navigateTo()
        }
      },
      fail: function (err) {
        // 服务异常
      }
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