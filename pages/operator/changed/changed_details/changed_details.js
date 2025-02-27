// pages/admin/changed/changed_details/changed_details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,//显示遮罩
    punishnum:1, //处罚方式筛选
    changenum: 1,//整改状态筛选
  },
  // 筛选处罚方式
  screenPunish:function(e){
    this.setData({
      punishnum: e.target.dataset.screenpunishnum
    })
    this.onShow();
  },
  // 筛选整改状态
  screenChange: function (e) {
    this.setData({
      changenum: e.target.dataset.screenchangenum
    })
    this.onShow();
  },
  /**点击筛选 */
  screenBtn: function (data) {
    var that = this;
    that.setData({
      specIndex: data.currentTarget.dataset.itemIndex,
      specParentIndex: data.currentTarget.dataset.parentindex,
    })
    var animation = wx.createAnimation({//动画
      duration: 500,//动画持续时间
      timingFunction: 'linear',//动画的效果 动画从头到尾的速度是相同的
    })
    animation.translateY(0).step()//在Y轴偏移tx，单位px

    this.animation = animation
    that.setData({
      showModalStatus: true,//显示遮罩       
      animationData: animation.export(),
      specNum: 1
    })
    that.setData({//把选中值，放入判断值中
      isHidden: 1,
    })
  },
  /**隐藏筛选 */
  hideModal: function (data) {
    var that = this;
    that.setData({//把选中值，放入判断值中
      showModalStatus: false,//显示遮罩       
      isHidden: 0,
    })
  },
  //点击重置
  resetBtn: function (data) {
    this.setData({
      punishnum: 1, //处罚方式筛选
      changenum: 1,//整改状态筛选
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