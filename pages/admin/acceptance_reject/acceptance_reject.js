var app = getApp();
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: [],
    imgres: [],
  },
  //获取驳回理由
  reasonsText:function(){ 
    this.setData({
      reasons: e.detail.value
    })
  },
  // 点击上传图片
  chooseWxImage: function (type) {
    var that = this;    
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var uploadsimg = [];
        for (let i in tempFilePaths) {
          var imgres2 = that.data.imgres;
          var img2 = [];
          wx.uploadFile({
            url: url + 'worksite/rectify/imageupload', //此处换上你的接口地址
            filePath: tempFilePaths[i],
            name: 'img',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            formData: {},
            success: function (res) {
              var data = JSON.parse(res.data).info.path;
              data = data.replace(app.globalData.mainServer, '');
              imgres2.push(data);
              img2.push(url + data);
              // console.log(11, imgres2);
              // console.log(22, img2);
              that.setData({
                // tempFilePath可以作为img标签的src属性显示图片
                img: img2,
                imgres: imgres2,
              })
            },
            fail: function (res) {
              console.log('fail');
            },
          })
        }
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
    (that.data.img).splice(e.currentTarget.dataset.value,1);
    (that.data.imgres).splice(e.currentTarget.dataset.value,1);
    console.log(that.data.img,that.data.imgres)
    that.setData({
      img:that.data.img,
      imgres:that.data.imgres
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.check_id) {
      this.setData({
        check_id: options.check_id, //展位联系人
      })
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