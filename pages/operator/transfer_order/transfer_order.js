// pages/operator/transfer_order/transfer_order.js
var app = getApp();
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    change_index:0,
    change_type:[],//转单方式
    change_id:'',
    carbon_index:0,
    carbon_id: [], //抄送人
    carbon_id:'',
    goods_id:'',//订单id
    beizhu:'',//备注
    orderId:'',//订单id
    or_type:'',//订单类型
  },
  //转单对象
  bindProjectChange:function(e){
    this.setData({
      change_index:e.detail.value,
      change_id:this.data.change_type[e.detail.value].id,
    })
  },
   //抄送对象
   bindcarbon:function(e){
    this.setData({
      carbon_index:e.detail.value,
      carbon_id:this.data.change_type[e.detail.value].id,
    })
  },
  // 描述
descInput: function (e) {
  this.setData({
    beizhu: e.detail.value
  })
},
  ChangedBtn:function(){
    var that = this;
    var goods_id= that.data.orderId; //商品id
    var take_user= that.data.change_id;//转单对象
    var take_beizhu = that.data.beizhu; //转单备注
    var cpay_user = that.data.carbon_id; //抄送对象
    var ordertype = that.data.or_type;//订单类型
    console.log('goods_id',goods_id,'take_user',take_user,'take_beizhu',take_beizhu,'cpay_user',cpay_user,'ordertype',ordertype)
    wx.request({
      url: url + 'worksite/default/order-change',
      data: { OpenId: wx.getStorageSync('openId'),projectId:sendMessageContent.projectId,goods_id:goods_id,take_user:take_user,take_beizhu:take_beizhu,cpay_user:cpay_user,ordertype:ordertype},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success(res) {
        if (res.data.Code == 200) {
          wx.showToast({
            title: '已转单',
            icon: 'none',
            duration: 2000//持续的时间
          })
          wx.navigateTo({
            url: '../operator',
          })
        } else {
          wx.showToast({
            title: '添加失败',
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
    var orderid = options.orderid
    var or_type = options.or_type
    this.setData({
      orderId: orderid,
      or_type: or_type,
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var openId = wx.getStorageSync('openId');
  //换单人员
  wx.request({
    url: url + 'worksite/default/cheng-info',
    data: {OpenId:openId,projectId:sendMessageContent.projectId,role_id:sendMessageContent.RoleId},
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
          change_type:items,
          change_id:items[0].id
        })
      } else {

      }
    },
    fail: function (err) {
      // 服务异常
    }
  })
  //抄送人
  wx.request({
    url: url + 'worksite/default/order-carbon',
    data: {OpenId:openId,projectId:sendMessageContent.projectId},
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
          carbon_type:items,
          carbon_id:items[0].id
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