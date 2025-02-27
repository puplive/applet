var app = getApp();
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../../utils/request.js")
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    host:app.globalData.url,
    proid:'', //问题id
    id:'', //单个id
    img: [],
    imgres: [],
    tempFilePaths:[],
    desc:'',//添加备注
    hiddenassign: true,  //指派弹窗
    assignArray:'',
    assignsel:'',//指派成员的id
  },
 // 指派
 assignBtn:function(e){
  var that = this;
  that.setData({
    id: e.currentTarget.dataset.key,
    ordertype: e.currentTarget.dataset.type,
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
    data: {projectId:sendMessageContent.projectId,OpenId:openId,goods_id:that.data.id,appoint_id:that.data.assignsel,ordertype:that.data.ordertype},
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    method: 'POST',
    success(res) {
      if (res.data.Code == 200) {
        wx.showToast({
          title: '指派成功',
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        proid: options.id, //问题id
      })
    }
},
// 点击上传图片
chooseWxImage: function (type) {
  var that = this;  
  console.log(11,that.data.tempFilePaths )
  wx.chooseImage({
    count: 9,
    sizeType: ['original', 'compressed'],
    sourceType: [type],
    success: function (res) {
      var a = res.tempFilePaths
      var b = that.data.tempFilePaths
      a.push.apply(a,b);
      var tempFilePaths = res.tempFilePaths == undefined ? '' :  a ;
      that.setData({
        tempFilePaths: tempFilePaths,
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
// 删除图片
imgDel: function(e){
  console.log(11,e,e.currentTarget.dataset.value)
  var that = this;
  (that.data.tempFilePaths).splice(e.currentTarget.dataset.value,1);
  that.setData({
    tempFilePaths:that.data.tempFilePaths
  })
  console.log(11,that.data.tempFilePaths)
},
/**
  * 生命周期函数--监听页面加载
*/
onLoad: function (options) {
  if (options.id) {
    this.setData({
      proid: options.id, //问题id
    })
  }
},
  // 详细描述
  reasonsText: function (e) {
    this.setData({
      desc: e.detail.value
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
    var openId = wx.getStorageSync('openId')
    var that = this;
    var id = that.data.proid
    call.request('worksite/default/order-details', {goods_id:id,projectId:sendMessageContent.projectId,OpenId:openId,ordertype:2},
      function (res) {
        if (res.Code == 200) {
          console.log(res.data)
          that.setData({
              info:res.data
          })
        } else {
        }
      },
      function () { });
  },
//完成操作
addWanC:function(){
    var that = this;
    var tempFilePaths = that.data.tempFilePaths;
    if(tempFilePaths.length>0){
       for (let i in tempFilePaths) {
        var imgres2 = that.data.imgres;
        var img2 = [];
        wx.uploadFile({
          url: url + 'worksite/default/imageupload', //此处换上你的接口地址
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
          img2.push(data);
          // console.log(11, imgres2);
          // console.log(22, img2);
          that.setData({
              // tempFilePath可以作为img标签的src属性显示图片
              img: img2,
              imgres: imgres2,
          })
          if(i==(tempFilePaths.length-1)){//最后一张图片上传完并延时0.1秒在执行保存数据
              setTimeout(function(){
              that.saveData();},100)
              }
          },
          fail: function (res) {
            console.log('fail');
          },
      })
    }
  }else{
    that.saveData();
  }
},
saveData: function(){
    var that=this;
    var imgs =that.data.imgres;
    var desc =that.data.desc;
    var orderId  =that.data.orderId;
    var projectId  =sendMessageContent.projectId;
    var openId = wx.getStorageSync('openId')
    wx.request({
      url: url + 'worksite/default/order-finish',
      data: {projectId:projectId,OpenId:openId,goods_id:orderId,ordertype:1,solve_beizhu:desc,solve_img:imgs},
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
          // wx.navigateTo({
          //   url: '../ad_order',
          // })
        } else {}
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