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
    fenleinum:0,  //筛选分类
    hiddenhangye: false,  //转单弹窗
    hiddenassign: true,  //指派弹窗
    host:app.globalData.url,
    zhanguannum:0, //展馆号默认索引
    number:[], //展馆号集合
    num:'',//展馆号
    // operatorindex:0,
    // operatorArray:['操作员1','操作员2','操作员3'],//展馆号
    // assignArray: [
    //   { id: 1, value: '租赁-张伟伟'},
    //   { id: 2, value: '水工-胜利大街' },
    // ],
    assignArray:'',
    assignsel:'',//指派成员的id
    applet:'',
    id:'',//订单id
    ordertype:'',//订单还是问题类型
    orderId:'',
    order_id:'',//订单id
    order_num:'',//订单传过来的数量
    order_qqq:'',//区分是什么问题
    role_ids:'',//角色id
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
    var that = this;
    let value = e.detail.value;
    this.setData({
      assignsel : value
    })
  },
  // 指派
  assignBtn:function(e){
    var that = this;
    that.setData({
      id: e.currentTarget.dataset.key,
      ordertype: e.currentTarget.dataset.type,
      orderId:e.currentTarget.dataset.order,
    })
    var zgh = e.currentTarget.dataset.zgh
    var openId = wx.getStorageSync('openId')
      wx.request({
        url: url + 'worksite/default/appoint-info',
        data: {projectId:sendMessageContent.projectId,OpenId:openId,goods_id:that.data.id,zgh:zgh,type:that.data.ordertype},
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        method: 'POST',
        success(res) {
          if (res.data.Code == 200) {
            console.log(8,res.data.data);
            that.setData({
              assignArray:res.data.data,
              data_len: Object.keys(res.data.data).length,
            })
            console.log('单选',that.data.assignArray)
          } else {
            that.setData({
              assignArray:'',
            })
          }
        },
        fail: function (err) {
          // 服务异常
        }
      })
    this.setData({
      hiddenassign: false,
    })
  },
  //接单操作
  takeOrder: function (e) {
    var openId = wx.getStorageSync('openId')
    var that = this;
    var order=e.currentTarget.dataset.order;
    that.setData({
      id: e.currentTarget.dataset.key,
      ordertype: e.currentTarget.dataset.type,
    })
    wx.request({
      url: url + 'worksite/default/order-take',
      data: {projectId:sendMessageContent.projectId,OpenId:openId,goods_id:that.data.id,ordertype:that.data.ordertype,order_id:order},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success(res) {
        if (res.data.Code == 200) {
          console.log(8,res.data.data);
          wx.showToast({
            title: '接单成功',
            icon: 'success',
            duration: 2000//持续的时间
          })
          that.onShow();
        } else {

        }
      },
      fail: function (err) {
        // 服务异常
      }
    })
  },

  // 订单筛选按展馆
  screenZhanguan: function (e) {
    this.setData({
      zhanguannum: e.target.dataset.screennum,
      num: this.data.number[e.target.dataset.screennum].num,
    })
    //this.onShow();
  },
  // 订单筛选排序
  screenSort: function (e) {
    this.setData({
      sortnum: e.target.dataset.screensortnum
    })
    //this.onShow();
  },
  // 订单筛选分类
  screenFenlei: function (e) {
    this.setData({
      fenleinum: e.target.dataset.screenfenleinum
    })
   // this.onShow();
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
      num:that.data.number[that.data.zhanguannum].num,
    })
  },
  //点击重置
  resetBtn:function(data){
    this.setData({
      sortnum: 1, //排序
      fenleinum:0,  //筛选分类
      num:'',//展馆号
      zhanguannum: 0, //展馆号索引
    })
    this.onShow();
  },
  //点击确认
  confirm_btn:function(){
    var that = this;
    that.setData({//把选中值，放入判断值中
      showModalStatus: false,//显示遮罩       
      isHidden: 0,
    })
    that.getList(that);
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
  // 指派取消按钮
  confirmS: function (e) {
    this.setData({
      hiddenassign: true,
    })
    var that = this;
    var openId = wx.getStorageSync('openId')
    wx.request({
      url: url + 'worksite/default/order-appoint',
      data: {projectId:sendMessageContent.projectId,OpenId:openId,goods_id:that.data.id,appoint_id:that.data.assignsel,ordertype:that.data.ordertype,order_id:that.data.orderId},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success(res) {
        if (res.data.Code == 200) {
          wx.showToast({
            title: '指派成功',
            icon: 'success',
            duration: 2000//持续的时间
          })
          that.onShow();
        } else {

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
    var that = this;
    that.setData({
      role_ids:options.roleid,
    })
    app.editTabBar1();
    //展馆
    wx.request({
      url: url + 'worksite/check/number-g',
      data: {projectId:sendMessageContent.projectId},
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
            number:items,
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
    var that = this;
    if(that.data.role_ids){
      var role=that.data.role_ids;
    }else{
      var role=0;
    }
    wx.request({
      url: url + 'worksite/default/order-info',
      data: {projectId:sendMessageContent.projectId,OpenId:openId,type:that.data._num,role_id:sendMessageContent.RoleId,number:this.data.num,fenleinum:this.data.fenleinum,role_ids:role},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success(res) {
        if (res.data.Code == 200) {
          console.log(8,res.data.data);
          that.setData({
            data:res.data.data.all,
            data_len: Object.keys(res.data.data.all).length,
            type: that.data._num,
            AllTake:res.data.data.AllTake,
            AllSolve:res.data.data.AllSolve,
            AllFinish:res.data.data.AllFinish,
          })
        } else {

        }
      },
      fail: function (err) {
        // 服务异常
      }
    })
  },

  //列表中点击完成
  wancBtn:function(e){
    var that=this;
    var ordertype=e.currentTarget.dataset.type;
    var orderqqq=e.currentTarget.dataset.qqq;
    // var projectId  =sendMessageContent.projectId;
    // var openId = wx.getStorageSync('openId')
    that.setData({
      id:e.currentTarget.dataset.key,
      order:e.currentTarget.dataset.order,
      order_num:e.currentTarget.dataset.ortype
    })
    if(ordertype==1){
        wx.navigateTo({
          url: "../ad_order_details/ad_order_details?id="+that.data.id+"&or_type="+that.data.order_num+"&order="+that.data.order
        });
    }else{
        if(orderqqq==3){
          wx.navigateTo({
            url: "../ques_details/ques_details?id="+that.data.id
        });
        }else{
          wx.navigateTo({
            url: "../ques_order_details/ques_order_details?id="+that.data.id+"&order="+that.data.order
        });
        }   
    }
    // wx.request({
    //   url: url + 'worksite/default/order-finish',
    //   data: {projectId:projectId,OpenId:openId,goods_id:that.data.id,order:that.data.order,ordertype:ordertype},
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' // 默认值
    //   },
    //   method: 'POST',
    //   success(res) {
    //     if (res.data.Code == 200) {
    //       wx.showToast({
    //         title: '已完成',
    //         icon: 'none',
    //         duration: 2000//持续的时间
    //       })
    //       that.onShow();
    //     } else {

    //     }
    //   },
    //   fail: function (err) {
    //     // 服务异常
    //   }
    // })
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