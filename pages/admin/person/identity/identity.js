// var APP = getApp();
var app = getApp();
var url = app.globalData.url;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    focus_cynickname: false,
    focus_username: false,
    focus_credit: false,
    openId: wx.getStorageSync('openId'),
  },
  cyInput: function (e) {
    this.setData({
      cynickname: e.detail.value
    })
  },
  userNameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  creditInput: function (e) {
    this.setData({
      credit: e.detail.value
    })
  },
  save: function (e) {
    var that = this;
    var nickname = this.data.cynickname;
    var username = this.data.username;
    var credit = this.data.credit;
    if (!nickname) {
      this.setData({
        focus_cynickname: true
      })
      wx.showToast({
        title: '公司名称不能为空',
        icon: 'none',
        duration: 2000//持续的时间
      })
      return false;
    }
    if (!username) {
      this.setData({
        focus_username: true
      })
      wx.showToast({
        title: '法人代表不能为空',
        icon: 'none',
        duration: 2000//持续的时间
      })
      return false;
    }
    if (!credit) {
      this.setData({
        focus_credit: true
      })
      wx.showToast({
        title: '信用代码不能为空',
        icon: 'none',
        duration: 2000//持续的时间
      })
      return false;
    }
    wx.request({
      url: url + '/api/user/identification',
      data: { nickname: nickname, username: username, credit: credit, openId: wx.getStorageSync('openId') },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
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
          wx.setStorageSync('hasuser', true)
          // wx.setStorageSync('indentityInfo', res.data.data)
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
      data: { openId: wx.getStorageSync('openId') },
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
            pro_name: items[0].hui_nickname
          })
          // console.log(that.data.projectArray);
          // console.log(that.data.fenleiArray);
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
      url: url + 'api/user/company',   //验证是否认证过
      data: { openId: wx.getStorageSync('openId') },
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