const app = getApp()
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _num: 1,//默认分类选中全部
    projectcon: '',
    projectcon_len: 1,
    showModalStatus: false,//显示遮罩
    zhanguannum: 1, //展馆号
    sortnum: 1, //排序
    fenleinum: 0,  //筛选分类
    hiddentransfer: true,  //转单内容弹窗
    hiddenassign: true,  //转单人员弹窗
    host:app.globalData.url,
    assignArray:'',
    assignsel:'',//转单成员的id
    id:'',//订单id
    ordertype:'',//订单还是问题类型
    change_id:'',//转单信息id
    host:app.globalData.url,
    num:'',//展馆号
  },
  // 订单分类
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
    //this.onShow();
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
  //接单操作
  takeOrder: function (e) {
    var openId = wx.getStorageSync('openId')
    var that = this;
    that.setData({
      id: e.currentTarget.dataset.key,
      ordertype: e.currentTarget.dataset.type,
    })
    wx.request({
      url: url + 'worksite/default/order-take',
      data: {projectId:sendMessageContent.projectId,OpenId:openId,goods_id:that.data.id,ordertype:that.data.ordertype},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success(res) {
        if (res.data.Code == 200) {
          console.log(8,res.data.data);
          wx.showToast({
            title: '接单成功',
            icon: 'none',
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
   //转单内容弹窗
  // transferOrder: function () {
  //   this.setData({
  //     hiddentransfer: false,
  //   })
  // },
   //订单确认转单
  confirmOrder: function (e) {
    var that = this;
    this.setData({
      hiddenassign: true,
    })
    var openId = wx.getStorageSync('openId')
    wx.request({
      url: url + 'worksite/default/change-ok',
      data: {OpenId:openId,chang_id:that.data.change_id},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success(res) {
        if (res.data.Code == 200) {
          wx.showToast({
            title: '成功',
            icon: 'none',
            duration: 2000//持续的时间
          })
        } else {}
        that.onShow();
      },
      fail: function (err) {
        // 服务异常
      }
    })
  },
   //订单拒绝转单
  cancelOrder: function (e) {
    var that = this;
    this.setData({
      hiddenassign: true,
    })
    var openId = wx.getStorageSync('openId')
    wx.request({
      url: url + 'worksite/default/change-no',
      data: {OpenId:openId,chang_id:that.data.change_id},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success(res) {
        if (res.data.Code == 200) {
          wx.showToast({
            title: '成功',
            icon: 'none',
            duration: 2000//持续的时间
          })
        } else {}
        that.onShow();
      },
      fail: function (err) {
        // 服务异常
      }
    })
  },
  // 问题拒绝转单
  cancelPro: function (e) {
    var that = this;
    this.setData({
      hiddentransfer: true,
    })
    var openId = wx.getStorageSync('openId')
    wx.request({
      url: url + 'worksite/default/change-no',
      data: {OpenId:openId,chang_id:that.data.change_id},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success(res) {
        if (res.data.Code == 200) {
          wx.showToast({
            title: '成功',
            icon: 'none',
            duration: 2000//持续的时间
          })
        } else {}
        that.onShow();
      },
      fail: function (err) {
        // 服务异常
      }
    })
  },
  // 问题确认按钮
  confirmPro: function (e) {
      var that = this;
      this.setData({
        hiddentransfer: true,
      })
      var openId = wx.getStorageSync('openId')
      wx.request({
        url: url + 'worksite/default/change-ok',
        data: {OpenId:openId,chang_id:that.data.change_id},
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        method: 'POST',
        success(res) {
          if (res.data.Code == 200) {
            wx.showToast({
              title: '成功',
              icon: 'none',
              duration: 2000//持续的时间
            })
          } else {}
          that.onShow();
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
    app.editTabBar();
     //展馆
     var that = this;
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
//列表中点击完成
wancBtn:function(e){
  var that=this;
  var ordertype=e.currentTarget.dataset.type;
  var projectId  =sendMessageContent.projectId;
  var openId = wx.getStorageSync('openId')
  that.setData({
    id:e.currentTarget.dataset.key
  })
  wx.request({
    url: url + 'worksite/default/order-finish',
    data: {projectId:projectId,OpenId:openId,goods_id:that.data.id,ordertype:ordertype},
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    method: 'POST',
    success(res) {
      if (res.data.Code == 200) {
        wx.showToast({
          title: '已完成',
          icon: 'none',
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
    wx.request({
      url: url + 'worksite/default/order-info',
      data: {projectId:sendMessageContent.projectId,OpenId:openId,type:that.data._num,role_id:sendMessageContent.RoleId,number:this.data.num,fenleinum:this.data.fenleinum},
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
    wx.request({
      url: url + 'worksite/default/change-info',
      data: {projectId:sendMessageContent.projectId,OpenId:openId},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success(res) {
        if (res.data.Code == 200) {
          console.log(99999,res.data.data);
          if(res.data.data.type==1){
            that.setData({
              hiddenassign: false,
              orderinfo:res.data.data,
              change_id:res.data.data.change_id
            })   
          }else{
            that.setData({
              hiddentransfer: false,
              proinfo:res.data.data,
              change_id:res.data.data.change_id
            })
          }
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