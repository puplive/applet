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
    zwh:'',
    isPhoneX: false
  },

  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function (options) {
    let isPhone = app.globalData.isIphoneX;
    if(isPhone){
      this.setData({
        isPhoneX: true,
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
    let pages = getCurrentPages(); // 页面对象
    let route = ''
    if(pages.length && pages.length >= 2){
      route = pages[pages.length - 2].route //上一个页面路由地址
    }
    if(route == 'pages/admin/changed/add_changed/add_changed'){
      wx.navigateBack({
        delta: 1
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

    // 点击键盘上的搜索
    bindconfirm: function (e) {
      var that = this;
      var discountName = e.detail.value['search - input'] ? e.detail.value['search - input'] : e.detail.value
      getApp().globalData.discountName = discountName;
      console.log('e.detail.value', discountName);
      that.setData({
        zwh: discountName
      })
      this.onShow();
    },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var openId = wx.getStorageSync('openId')
    var that = this;
    wx.request({
      url: url + 'worksite/rectify/rectifylist',
      data: {projectId:sendMessageContent.projectId,OpenId:openId,zwh:that.data.zwh},
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
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
          console.log(res.data.data)
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