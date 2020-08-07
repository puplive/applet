const app = getApp()
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../../utils/request.js");
// const { Console } = require("console");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[],//详情内容
    orderId:'',
    or_type:'', //订单状态
    host:app.globalData.url,
    img: [],
    imgres: [],
    tempFilePaths:[],
  },
// 点击上传图片
chooseWxImage: function (type) {
  var that = this;  
  console.log(11,that.data.tempFilePaths )
  wx.chooseImage({
    count: 9,
    sizeType: ['original', 'compressed'],
    sourceType: [type],
    success: function (res) {
      var a = res.tempFilePaths
      var b = that.data.tempFilePaths
      a.push.apply(a,b);
      var tempFilePaths = res.tempFilePaths == undefined ? '' :  a ;
      that.setData({
        tempFilePaths: tempFilePaths,
      })
    }
  })
},

chooseimage: function () {
  var that = this;
  wx.showActionSheet({
    itemList: ['从相册中选择', '拍照'],
    itemColor: "#a3a2a2",
    success: function (res) {
      if (!res.cancel) {
        if (res.tapIndex == 0) {
          that.chooseWxImage('album')
        } else if (res.tapIndex == 1) {
          that.chooseWxImage('camera')
        }
      }
    }
  })

},
// 删除图片
imgDel: function(e){
  console.log(11,e,e.currentTarget.dataset.value)
  var that = this;
  (that.data.tempFilePaths).splice(e.currentTarget.dataset.value,1);
  that.setData({
    tempFilePaths:that.data.tempFilePaths
  })
  console.log(11,that.data.tempFilePaths)
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var or_type = options.or_type
    this.setData({
      orderId: id,
      or_type: or_type,
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
    var openId = wx.getStorageSync('openId')
    var that = this;
    var id = that.data.orderId
    var type = that.data.or_type
    call.request('worksite/default/order-details', {goods_id:id,projectId:sendMessageContent.projectId,OpenId:openId,ordertype:1,type:type},
      function (res) {
        if (res.Code == 200) {
          console.log(res.data)
          that.setData({
              info:res.data
          })
        } else {
        }
      },
      function () { });
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