// pages/admin/changed/add_changed/add_changed.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: '../../../images/shigongzheng.png',
    imgres: '',
  },
  // 点击上传图片
  chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths[0]);
        wx.uploadFile({
          url: url + 'field/work/imageupload', //此处换上你的接口地址
          filePath: tempFilePaths[0],
          name: 'img',
          header: {
            'Content-type': 'application/json'
          },
          formData: {},
          success: function (res) {
            var data = JSON.parse(res.data).info.path;
            data = data.replace(app.globalData.mainServer, '');
            console.log(111, data);
            that.setData({
              // tempFilePath可以作为img标签的src属性显示图片
              img: url + data,
              imgres: data,
            })
          },
          fail: function (res) {
            console.log('fail');
          },
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