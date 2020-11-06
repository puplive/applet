var app = getApp();
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    changeArray:[],  //整改列表
    containButtom:'',
    footBottom:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function (options) {
    let isPhone = app.globalData.isIphoneX;
    if(isPhone){
      this.setData({
        containButtom:"188rpx",
        footBottom:'168rpx',
      })
    }
    app.editTabBar1();
  },
  //整改详情跳转
  zheng_detail:function(e){
    console.log(9999,e)
    if(getCurrentPages().length>=5){
      wx.redirectTo({
        url: "changed_details/changed_details?zwh="+e.currentTarget.dataset.key
      });
    }else{
      wx.navigateTo({
        url: "changed_details/changed_details?zwh="+e.currentTarget.dataset.key
      });
    }
  },
  //整改通知
  zheng_gai:function(e){
    console.log(888888,getCurrentPages().length);
    if(getCurrentPages().length>=5){
      wx.redirectTo({
        url: "add_changed/add_changed"
      });
    }else{
      wx.navigateTo({
        url: "add_changed/add_changed"
      });
    }
   
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
      url: url + 'worksite/rectify/rectifylist',
      data: {projectId:sendMessageContent.projectId,OpenId:openId},
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(8,res);
        var list = res.data.data; 
        for (var i in list) { 
          list[i] = {
            list: list[i]  //整改详细列表
          }
        }
        if (res.data.Code == 200) {
          that.setData({
            changeArray: res.data.data
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

  }
})