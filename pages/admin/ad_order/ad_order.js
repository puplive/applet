const app = getApp()
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _num: 1,//默认分类选中全部
    projectcon: '',
    projectcon_len: 1,
    showModalStatus: false,//显示遮罩
    zhanguannum:1, //展馆号
    sortnum:1, //排序 
    fenleinum:1,  //筛选分类
    hiddenhangye: false,  //转单弹窗
    hiddenassign: true,  //指派弹窗
    host:app.globalData.url,
    // operatorindex:0,
    // operatorArray:['操作员1','操作员2','操作员3'],//展馆号
    assignArray: [
      { id: 1, value: '租赁-张伟伟'},
      { id: 2, value: '水工-胜利大街' },
    ],
    assignsel:'',
  },
  // 订单分类
  switchFenlei: function (e) {
    this.setData({
      _num: e.target.dataset.num
    })
    this.onShow();
  },
  // 人员选择单选
  radioChange: function (e) {
    let value = e.detail.value;
    this.setData({
      assignsel : value
    })
    console.log("选中的value：",this.data.assignsel)
  },
  // 指派
  assignBtn:function(e){
    




    this.setData({
      hiddenassign: false,
    })
  },


  // 订单筛选按展馆
  screenZhanguan: function (e) {
    this.setData({
      zhanguannum: e.target.dataset.screennum
    })
    this.onShow();
  },
  // 订单筛选排序
  screenSort: function (e) {
    this.setData({
      sortnum: e.target.dataset.screensortnum
    })
    this.onShow();
  },
  // 订单筛选分类
  screenFenlei: function (e) {
    this.setData({
      fenleinum: e.target.dataset.screenfenleinum
    })
    this.onShow();
  },
  /**点击显示筛选 */
  screenBtn: function (data) {
    var that = this;
    // that.setData({
    //   specIndex: data.currentTarget.dataset.itemIndex,
    //   specParentIndex: data.currentTarget.dataset.parentindex,
    // })
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
  resetBtn:function(data){
    this.setData({
      zhanguannum: 1, //展馆号
      sortnum: 1, //排序
      fenleinum: 1,  //筛选分类
    })
  },
  // 转单确认按钮
  cancelM: function (e) {
    this.setData({
      hiddenhangye: true,
    })
  },
  // 转单取消按钮
  confirmM: function (e) {
    this.setData({
      hiddenhangye: true,
    })
  },
  // 指派确认按钮
  cancelS: function (e) {
    this.setData({
      hiddenassign: true,
    })
  },
  // 转单取消按钮
  confirmS: function (e) {
    this.setData({
      hiddenassign: true,
    })
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
    console.log(2)
    var openId = wx.getStorageSync('openId')
    var that = this;
    wx.request({
      url: url + 'worksite/default/order-info',
      data: {projectId:sendMessageContent.projectId,OpenId:openId,type:that.data._num,role_id:sendMessageContent.RoleId},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success(res) {
        if (res.data.Code == 200) {
          console.log(8,res.data.data);
          that.setData({
            data:res.data.data,
            data_len: Object.keys(res.data.data).length,
            type: that.data._num,
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