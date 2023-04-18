// pages/admin/changed/add_changed/add_changed.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    change_index:0,
    change_type: ['未经允许，私自接电接水', '未经允许，动用明火作业', '阻塞公共通道或展馆设施', '无证从事电气施工', '展台结构未刷防火涂料', '使用可燃、易燃、易爆材料', '使用高温灯具', '现场调漆、喷漆、刷漆', '大面积使用涂料', '搭建过程中，出现火花现象', '向展览馆地沟或地井内倾倒废弃物', '相靠展台结构背部未做白色遮盖', '未按展馆要求悬挂吊点', '野蛮拆卸、推倒展台', '施工垃圾未清理干净', '未佩带安全帽', '闭馆后未关闭展位电源', '闭馆后未关闭展位电源', '电箱放在储藏间内', '闭馆后仍进行施工', '高空作业无人看护', '对展馆和主场服务商工作不予配合', '假花假草未喷洒阻燃剂', '地毯未喷洒阻燃剂', '未配备灭火器或数量不够', '展位不能形成封闭空间，至少开放70%', '展台总高度超高', '结构连接不稳固或支撑尺寸不达标','结构跨度过大'],//整改方式
    punish_index:0,
    punish_method: ['一次警告', '二次警告', '一次整改', '二次整改', '未整改','直接处罚'], //处罚方式
    changetime_index:0,
    change_time: ['9:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00','20:00 - 21:00', '21:00 - 22:00', '22:00 - 23:00','23:00 - 24:00'], //整改时限
    img: '../../../../images/camera.png',
    imgres: '',
    zs_name: '',
  },
  // 点击整改类型
  bindChange: function (e) {
    this.setData({
      change_index: e.detail.value
    })
  },
  // 点击处罚方式
  bindPunish: function (e) {
    this.setData({
      punish_index: e.detail.value
    })
  },
  // 点击整改时限
  bindChangeTime: function (e) {
    this.setData({
      changetime_index: e.detail.value
    })
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