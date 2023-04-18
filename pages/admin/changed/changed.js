var app = getApp();
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../../utils/request.js")
Page({
  data: {
    changeArray:[],  //整改列表
    containButtom:'',
    footBottom:'',
    zwh:'',
    isPhoneX: false,
    openId: wx.getStorageSync('openId'),
  },
  onReady: function () {
  }, 
  onLoad: function (options) {
    wx.hideHomeButton()
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
  onShow: function () {
    this.setData({
      openId: wx.getStorageSync('openId'),
    })
    this.getList()
  },
  getList: function(){
    var that = this;
    wx.request({
      url: url + 'worksite/rectify/rectifylist',
      data: {
        projectId:sendMessageContent.projectId,
        OpenId:that.data.openId,
        zwh:that.data.zwh
      },
      method: 'GET',
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
  //整改详情跳转
  zheng_detail:function(e){
    let data = e.currentTarget.dataset.item
    if(getCurrentPages().length>=5){
      wx.redirectTo({
        url: "changed_details/changed_details?zwh="+data.list.zw_hao
      });
    }else{
      wx.navigateTo({
        url: "changed_details/changed_details?zwh="+data.list.zw_hao
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
    // 点击键盘上的搜索
    bindconfirm: function (e) {
      var that = this;
      var discountName = e.detail.value['search - input'] ? e.detail.value['search - input'] : e.detail.value
      getApp().globalData.discountName = discountName;
      console.log('e.detail.value', discountName);
      that.setData({
        zwh: discountName
      })
      this.getList();
    },


})