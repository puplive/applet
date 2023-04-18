var app = getApp();
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _num: 1,//默认分类选中全部
    showModalStatus: false,//显示遮罩
    fenleinum:1,  //筛选分类
    zhanguannum:0, //展馆号默认索引
    number:[], //展馆号集合
    num:'',//展馆号
    containButtom:'',
    screenBottom:'',
  },
  // 点击导航分类
  switchFenlei: function (e) {
    this.setData({
      _num: e.target.dataset.num
    })
    this.onShow();
  },
    // 订单筛选按展馆
    screenZhanguan: function (e) {
      this.setData({
        zhanguannum: e.target.dataset.screennum,
        num: this.data.number[e.target.dataset.screennum].num,
      })
     // this.onShow();
    },
   // 订单筛选分类
   screenFenlei: function (e) {
    this.setData({
      fenleinum: e.target.dataset.screenfenleinum
    })
    //this.onShow();
  },
   //点击重置
   resetBtn:function(data){
    this.setData({
      zhanguannum:'', //展馆号
      num: '',
    })
    this.onShow();
  },
  confirm_btn:function(){
    var that = this;
    that.setData({//把选中值，放入判断值中
      showModalStatus: false,//显示遮罩       
      isHidden: 0,
    })
    that.getList(that);
  },
  /**点击筛选 */
  screenBtn: function (data) {
    var that = this;
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
      num: this.data.num
      //num:that.data.number[that.data.zhanguannum].num,
    })
  },
  /**隐藏筛选 */
  hideModal: function (data) {
    var that = this;
    that.setData({//把选中值，放入判断值中
      showModalStatus: false,//显示遮罩       
      isHidden: 0,
      num:'',//展馆号
      zhanguannum: 0, //展馆号索引
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideHomeButton()
    let isPhone = app.globalData.isIphoneX;
    if(isPhone){
      this.setData({
        containButtom:"188rpx",
        screenBottom:'20rpx',
      })
    }
    app.editTabBar1();
    var ProjectId =sendMessageContent.projectId
    var that = this;
    console.log('项目id'+ProjectId)
    call.getData('worksite/check/number-g?projectId='+ProjectId,
    function (data) {
      var items = [];
          for (let i in data.data) {
            items.push(data.data[i]);
          }
        that.setData({
          number:items,
        })
    },function () { });
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
    var that = this;
    that.getList(that);
  },
  getList: function(that){
    var openId = wx.getStorageSync('openId')
    wx.request({
      url: url + 'worksite/check/check-list',
      data: {projectId:sendMessageContent.projectId,OpenId:openId,check_status:that.data._num,number:this.data.num},
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(1,res);
        if (res.data.Code == 200) {
          that.setData({
            accepArray: res.data.data.data,
            accepArray_len: Object.keys(res.data.data.data).length,
            type: that.data._num,
            type:res.data.data.type
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