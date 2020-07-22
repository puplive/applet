var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        id: 'view',
        name: '水工',
        open: false,
        // pages: ['view', 'scroll-view', 'swiper']
        pages: [{ img: '../../images/header_img.png', name: '吊点-王崇峰', tel: '18766669999' }, { img: '../../images/header_img.jpg', name: '升降车-李晓明', tel: '18886669988' }, { img: '../../images/header_img.png', name: '吊点-王崇峰', tel: '18766669999' }, { img: '../../images/header_img.png', name: '吊点-王崇峰', tel: '18766669999' }, { img: '../../images/header_img.png', name: '吊点-王崇峰', tel: '18766669999' }, { img: '../../images/header_img.png', name: '吊点-王崇峰', tel: '18766669999' }, { img: '../../images/header_img.png', name: '吊点-王崇峰', tel: '18766669999' }, { img: '../../images/header_img.png', name: '吊点-王崇峰', tel: '18766669999' }, { img: '../../images/header_img.png', name: '吊点-王崇峰', tel: '18766669999' }, { img: '../../images/header_img.png', name: '吊点-王崇峰', tel: '18766669999' }, { img: '../../images/header_img.png', name: '吊点-王崇峰', tel: '18766669999' }, { img: '../../images/header_img.png', name: '吊点-王崇峰', tel: '18766669999' }]
      }, {
        id: 'content',
        name: '电工',
        open: false,
        pages: [{ img: '123', name: '王崇峰', tel: '18766669999' }]
      }, {
        id: 'form',
        name: '租赁商',
        open: false,
        pages: [{ img: '123', name: '王崇峰', tel: '18766669999' }]
      }, {
        id: 'nav',
        name: '其它',
        open: false,
        pages: [{ img: '123', name: '王崇峰', tel: '18766669999' }]
      }
    ]
  },
  // 
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar1();
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
    console.log(33333,openId);
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