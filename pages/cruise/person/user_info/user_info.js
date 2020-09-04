// pages/myself/user_info/user_info.js
var app = getApp()
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    showEmail:false,
    name: '',
    namejiu:'',
    email: '',
    emailjiu: '',
  },
  inputChange: function (e) {
    this.setData({
      namejiu: e.detail.value
    })
  },
  tapinputChange: function (e) {
    this.setData({
      namejiu: e.detail.value
    })
  },
  emailChange: function (e) {
    this.setData({
      emailjiu: e.detail.value
    })
  },
  tapEmailChange: function (e) {
    this.setData({
      emailjiu: e.detail.value
    })
  },
  save: function (e) {
    //console.log(22,this.data);
    var that = this;
    var namejiu = this.data.namejiu;//联系人
    //console.log(name);return false;
    if (!namejiu) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 2000//持续的时间
      })
      return false;
    }
    wx.request({
      url: url + 'worksite/user/user-name',
      data: {name:namejiu,OpenId: wx.getStorageSync('openId')},
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
          that.setData({
            name: namejiu,
            showModal: false
          })

          // wx.navigateTo({
          //   url: '../user_info/user_info',
          // })
        }
      }, 
      fail: function (err) {
        // 服务异常
      }
    })
  },
  saveEmail: function (e) {
    //console.log(22,this.data);
    var that = this;
    var emailjiu = this.data.emailjiu;//联系人
    //console.log(name);return false;
    if (!emailjiu) {
      wx.showToast({
        title: '邮箱不能为空',
        icon: 'none',
        duration: 2000//持续的时间
      })
      return false;
    }
    wx.request({
      url: url + 'worksite/user/user-email',
      data: { email: emailjiu, OpenId: wx.getStorageSync('openId') },
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
          that.setData({
            email: emailjiu,
            showEmail: false
          })
        }
      },
      fail: function (err) {
        // 服务异常
      }
    })
  },
  //授权获取手机号
  getPhoneNumber: function (e) {
    var that = this;
    // console.log(e.detail.errMsg == "getPhoneNumber:ok");
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      var that = this;
      wx.request({
        url: url + 'worksite/user/add-tel', //查询是否
        method: "get",
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          OpenId: wx.getStorageSync('openId'),
          sessionk: wx.getStorageSync('sessionKey'),
        },
        success: function (res) {
          if (res.data.Code == 200) {
            that.setData({
              tel: res.data.data.scalar,
            })
          }
        }
      })
    }
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
    wx.request({
      url: url + '/worksite/user/user-info',
      data: { OpenId: wx.getStorageSync('openId')},
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.Code == 200) {
          that.setData({
            tel: res.data.data.tel,
            name: res.data.data.name,
            namejiu: res.data.data.name,
            email: res.data.data.email,
            emailjiu: res.data.data.email
          })
          // console.log(222,that.data.projectcon);
        } else {

        }
      },
      fail: function (err) {
        // 服务异常
      }
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
  enditName:function(){
    this.setData({
      showModal: true
    })
  },
  enditName: function () {
    this.setData({
      showModal: true
    })
  },
  enditEmail: function () {
    this.setData({
      showEmail: true
    })
  },
   /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
  },
  /**
   * 隐藏模态对话框（邮箱）
   */
  hideEmail: function () {
    this.setData({
      showEmail: false
    });
  },
  /**
   * 对话框取消按钮点击事件（邮箱）
   */
  onEmail: function () {
    this.hideEmail();
  },
  /**
   * 对话框确认按钮点击事件（邮箱）
   */
  onConfirm: function () {
    this.hideEmail();
  }
})