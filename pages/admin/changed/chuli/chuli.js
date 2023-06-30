var app = getApp();
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../../../utils/request.js")
Page({
  data: {
    host:app.globalData.url,
    changeid: '',
    type: 'chuli',
    detail: {},
    img_list: [],
    zglx_list: [{id: 1,name: '未处理'},{id: 2,name: '已处理'}],
    cljg_list: [{id: 1,name: '扣除押金'},{id: 2,name: '现场缴纳'},{id: 3,name: '其他'}],
    zglx_index: 0,
    cljg_index: 0,
  },
  onLoad(options) {
    this.setData({
      changeid: options.changeid,
      type: options.type
    })
    this.getDetail()
  },
  onReady() {
    // this.getDetail()
  },
  onShow() {

  },
  zglx_change: function(e) {
    // console.log( e)
    this.setData({
      zglx_index: e.detail.value
    })
  },
  cljg_change: function(e) {
    // console.log( e)
    this.setData({
      cljg_index: e.detail.value
    })
  },
  priceInput: function (e) {
    this.setData({
      'detail.publish_amount': e.detail.value
    })
  },
  notesInput: function (e) {
    this.setData({
      'detail.publish_notes': e.detail.value
    })
  },
  sub: function () {
    var that = this;
    wx.request({
      url: url + 'worksite/rectify/handle',
      data: {
        id: that.data.changeid,
        status: that.data.zglx_list[that.data.zglx_index].id,
        result: that.data.detail.punish_type == '6'? that.data.cljg_list[that.data.cljg_index].id : '',
        amount: that.data.detail.punish_type == '6'? that.data.detail.publish_amount : '',
        notes: that.data.detail.publish_notes
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        if (res.data.Code == 200) {
          wx.navigateBack()
        } else {

        }
      },
      fail: function (err) {
        // 服务异常
      }
    })
  },
  getDetail: function () {
    var that = this;
    var openId = wx.getStorageSync('openId');
    wx.request({
      url: url + 'worksite/rectify/rectify-edit',
      data: {rectify_id:that.data.changeid,OpenId:openId},
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.Code == 200) {
          let detail = res.data.data
          that.setData({
            detail: detail,
            img_list: detail.rectify_imgs.split(","),
            zglx_index: detail.status? Number(detail.status)-1 :0,
            cljg_index: detail.punish_result? Number(detail.punish_result)-1: 0,
          })
        } else {

        }
      },
      fail: function (err) {
        // 服务异常
      }
    })
  },
})