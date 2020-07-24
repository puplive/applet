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
          // console.log(111, Object.keys(res.data.data).length);
          that.setData({
            huiinfo: res.data.data,
            huiinfo_len: Object.keys(res.data.data).length,
          })
          // console.log(222,that.data.projectcon);
        } else {

        }
      },
      fail: function (err) {
        console.log(err)
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
  choice_btn: function (e) {//选中商品结算
    sendMessageContent.projectId = e.target.dataset.key
  
    if(name!=''){
      wx.redirectTo({
        url: "../goods/search/search?goods=" + name
      })
    }else if(discountName!=''){
      wx.redirectTo({
        url: "../goods/search/search?goods=" + discountName
      })
    }else{
      wx.navigateTo({
        url: "../admin/person/identity/identity?hui=" + sendMessageContent.projectId
      })
    }
  },
})