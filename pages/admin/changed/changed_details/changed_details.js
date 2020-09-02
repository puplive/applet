var app = getApp();
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host:app.globalData.url,
    zwh:'',
    changedetails:[],  //详情
    showModalStatus: false,//显示遮罩
    punishnum:0, //处罚方式筛选
    changenum:1,//整改状态筛选
    num:'',//处罚方式索引
    punish_method:[]//处罚方式查询
  },
  //预览图片
topic_preview: function(e){
  var src = e.currentTarget.dataset.src;
  var imgList = e.currentTarget.dataset.list;//获取data-list
  var previewImgArr = [];
  for (var i in imgList) {
    previewImgArr[i]= this.data.host+imgList[i];
  }
  wx.previewImage({
    current: src,     //当前图片地址
    urls: previewImgArr,               //所有要预览的图片的地址集合 数组形式
  })
},
  // 筛选处罚方式
  screenPunish:function(e){
    this.setData({
      changenum: e.target.dataset.screenchangenum,
      punishnum: e.target.dataset.screenpunishnum,
      num: this.data.punish_method[e.target.dataset.screenpunishnum].id,
    })
    //this.onShow();
  },
  // 筛选整改状态
  screenChange: function (e) {
    this.setData({
      changenum: e.target.dataset.screenchangenum,
      punishnum: e.target.dataset.screenpunishnum,
      num:this.data.num
    })
    //this.onShow();
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
      num:that.data.num,
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
      punishnum: '', //处罚方式筛选
      changenum: '',//整改状态筛选
      num:'',
    })
    this.onShow();
  },
  //点击完成
  confirm_btn:function(){
    var that = this;
    that.setData({//把选中值，放入判断值中
      showModalStatus: false,//显示遮罩       
      isHidden: 0,
    })
    that.onreadycon(that);
  },
  // 删除按钮
  delBtn: function(e){
    var openId = wx.getStorageSync('openId')
    var that = this;
    wx.request({
      url: url + 'worksite/rectify/rectify-del',
      data: {rectify_id:e.target.dataset.id},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        if (res.data.Code == 200) {
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 2000//持续的时间
          })
          setTimeout(() => {
            wx.redirectTo({
              url: "../changed"
            });
          }, 1000);
        } else {
          wx.showToast({
            title: '删除失败',
            icon: 'none',
            duration: 2000//持续的时间
          })
        }
      },
      fail: function (err) {
        // 服务异常
      }
    })
  },
  // 完成按钮
  endBtn: function(e){
    var openId = wx.getStorageSync('openId')
    var that = this;
    wx.request({
      url: url + 'worksite/rectify/rectify-ok',
      data: {rectify_id:e.target.dataset.id},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        if (res.data.Code == 200) {
          wx.showToast({
            title: '整改完成',
            icon: 'none',
            duration: 2000//持续的时间
          })
          setTimeout(() => {
            wx.redirectTo({
              url: "../changed"
            });
            that.setData({
              zwh: zwh,
            })
          }, 1000);
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'none',
            duration: 2000//持续的时间
          })
        }
      },
      fail: function (err) {
        // 服务异常
      }
    })
  },
  // 页面调取内容方法
  onreadycon: function(e){
    var openId = wx.getStorageSync('openId')
    var that = this;
    wx.request({
      url: url + 'worksite/rectify/rlist-details',
      data: {zw_hao:that.data.zwh,OpenId:openId,punish:this.data.num,change:this.data.changenum},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        if (res.data.Code == 200) {
          console.log(9999,Object.keys(res.data.data).length)
          if(Object.keys(res.data.data).length==0){
            that.setData({
              accepArray_len:0,
              changedetails:' ',
              z_guan:'',  //展馆号
            })
          }else{
            that.setData({
              accepArray_len:Object.keys(res.data.data).length,
              changedetails: res.data.data,
              z_guan:res.data.data[0].z_guan,  //展馆号
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var zwh = options.zwh
    this.setData({
      zwh: zwh,
    })
   //处罚方式
   var openId = wx.getStorageSync('openId')
   wx.request({
    url: url + 'worksite/rectify/punish',
    data: {OpenId:openId},
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
          punish_method:items,
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
    this.onreadycon();
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