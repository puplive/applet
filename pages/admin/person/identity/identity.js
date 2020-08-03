// var APP = getApp();
var app = getApp();
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../../../utils/request.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    tel:'',
    pro_name:'',
    proid:'',
    projectindex: 0,      // 项目名称列表默认选中第几行
    projectArray: [],     // 项目名称对象数组
    openId: wx.getStorageSync('openId'),
  },
  // 选择公司名称
  bindProjectChange: function (event) {
    this.setData({
      projectindex: event.detail.value,
      pro_name: this.data.projectArray[event.detail.value].nickname,
      proid:  this.data.projectArray[event.detail.value].const_id,
      // hidden_con: true,
    })
  },
  // 获取值
  telInput: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  save: function (e) {
    var that = this;
    var pro_id = that.data.proid;
    var tel = that.data.tel;
    if (!tel) {
      this.setData({
        focus_tel: true
      })
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000//持续的时间
      })
      return false;
    }
    wx.request({
      url: url + 'worksite/default/identification',
      data: { const_id: pro_id, tel: tel, OpenId: wx.getStorageSync('openId'),ProjectId:sendMessageContent.projectId},
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.Code == 200) {
          wx.showToast({
            title: '认证成功',
            icon: 'none',
            duration: 2000//持续的时间
          })
          var indentityInfo = {
            fr_name: username,
            fr_tel: credit,
            nickname: nickname
          };
          // wx.setStorageSync('hasuser', true)
          setTimeout(function () {
            that.setData({
              isShow: true,
              isShow: wx.getStorageSync('hasuser'),
              indentityInfo: indentityInfo,
            })
          }, 2000)
        } else {
          wx.showToast({
            isShow: wx.getStorageSync('hasuser'),
            title: res.data.msg,
            icon: 'none',
            duration: 2000//持续的时间
          })
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
    var that = this;
    //认证状态初始化
    that.setData({
      // isShow: false,
      isShow: wx.getStorageSync('hasuser'),
      indentityInfo: app.globalData.indentityInfo,

    })
    // 获取用户信息
    wx.getUserInfo({
      success: function (res) {
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl, [nickName]: res.userInfo.nickName,
        })
      }
    })
    // 获取公司名称
    wx.request({
      url: url + 'worksite/default/const-search',
      data: { OpenId:wx.getStorageSync('openId'),ProjectId:sendMessageContent.projectId},
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.Code == 200) {
          var items = [];
          for (let i in res.data.data) {
            items.push(res.data.data[i]);
          }
          that.setData({
            projectArray: items,
            pro_name: items[0].nickname,
            proid:items[0].const_id,
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.request({
      url: url + 'worksite/default/ident-info',   //验证是否认证过
      data: { OpenId: wx.getStorageSync('openId'),ProjectId:sendMessageContent.projectId },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.Code == 200) {
          wx.setStorageSync('hasuser', true)
          that.setData({
            isShow: wx.getStorageSync('hasuser'),
            indentityInfo: res.data.data,
            openId: wx.getStorageSync('openId'),
          })
        } else {
          wx.setStorageSync('hasuser', false)
          that.setData({
            isShow: wx.getStorageSync('hasuser'),
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000//持续的时间
          })
        }
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