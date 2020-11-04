var app = getApp();
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    proid:'', //问题id
    id:'', //单个id
    img: [],
    imgres: [],
    desc:'',//添加备注
    host:app.globalData.url,
    lock: false,//验证只能提交一次
  },
   //预览图片
   topic_preview: function(e){
    var imgList = e.currentTarget.dataset.list;//获取data-list
    var url = e.currentTarget.dataset.url;
    var previewImgArr = [];
    for (var i in imgList) {
      previewImgArr[i]= this.data.host+imgList[i];
    }
    wx.previewImage({
      current: url,     //当前图片地址
      urls: previewImgArr,               //所有要预览的图片的地址集合 数组形式
    })
  },
  //接单操作
  takeOrder: function (e) {
    var openId = wx.getStorageSync('openId')
    var that = this;
    that.setData({
      id: e.currentTarget.dataset.key,
      //ordertype: e.currentTarget.dataset.type,
    })
    wx.request({
      url: url + 'worksite/default/order-take',
      data: {projectId:sendMessageContent.projectId,OpenId:openId,goods_id:that.data.id,ordertype:2},
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
          wx.navigateTo({
            url: '../operator/operator',
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
      wx.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'],
        sourceType: [type],
        success: function (res) {
          var tempFilePaths = res.tempFilePaths;
          var uploadsimg = [];
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
                img2.push(url + data);
                // console.log(11, imgres2);
                // console.log(22, img2);
                that.setData({
                  // tempFilePath可以作为img标签的src属性显示图片
                  img: img2,
                  imgres: imgres2,
                })
              },
              fail: function (res) {
                console.log('fail');
              },
            })
          }
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
      (that.data.img).splice(e.currentTarget.dataset.value,1);
      (that.data.imgres).splice(e.currentTarget.dataset.value,1);
      console.log(that.data.img,that.data.imgres)
      that.setData({
        img:that.data.img,
        imgres:that.data.imgres
      })
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
    var imgs =that.data.imgres;
    var desc =that.data.desc;
    var pid  =that.data.proid;
    var projectId  =sendMessageContent.projectId;
    var openId = wx.getStorageSync('openId')
    var lock = that.data.lock;
    if(!lock){
      that.setData({
        lock:true,
      })
      wx.request({
        url: url + 'worksite/default/order-finish',
        data: {projectId:projectId,OpenId:openId,goods_id:pid,ordertype:2,solve_beizhu:desc,solve_img:imgs},
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        method: 'POST',
        success(res) {
          if (res.data.Code == 200) {
            wx.showToast({
              title: '完成',
              icon: 'success',
              duration: 2000,//持续的时间
              mask: true,//是否显示透明蒙层，防止触摸穿透，默认：false
              success:function(){
                setTimeout(() => {
                  that.setData({
                    lock:true,
                  })
                  wx.navigateTo({
                    url: '../operator',
                  })
                }, 1000);
              }
            })
          } else if(res.data.Code == 600){
            wx.showToast({
              title: '请上传图片',
              icon: 'none',
              duration: 2000//持续的时间
            });
            that.setData({
              lock:false,
            })
          }else {
            wx.showToast({
              title: '添加失败',
              icon: 'none',
              duration: 2000,//持续的时间
            });
            that.setData({
              lock:false,
            })
          }
        },
        fail: function (err) {
          // 服务异常
        }
      })
    }
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