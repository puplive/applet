var app = getApp();
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: [],
    imgres: [],
    tempFilePaths: [],
    lock: false,//验证只能提交一次
  },
  //获取驳回理由
  reasonsText:function(e){ 
    this.setData({
      reasons: e.detail.value
    })
  },
 // 点击上传图片
  chooseWxImage: function (type) {
    var that = this;  
    // console.log(11,that.data.tempFilePaths )
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        var a = res.tempFilePaths
        var b = that.data.tempFilePaths
        // a.push.apply(a,b);
        // var tempFilePaths = res.tempFilePaths == undefined ? '' :  a ;
        that.setData({
          tempFilePaths: [...b,...a],
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
    // console.log(11,e,e.currentTarget.dataset.value)
    var that = this;
    (that.data.tempFilePaths).splice(e.currentTarget.dataset.value,1);
    that.setData({
      tempFilePaths:that.data.tempFilePaths
    })
    // console.log(11,that.data.tempFilePaths)
  },

  // 确定按钮
  agreeBtn:function(){
    var that = this;
    var tempFilePaths = that.data.tempFilePaths;
    if(tempFilePaths.length>0){
      for (let i in tempFilePaths) {
        var imgres2 = that.data.imgres;
        var img2 = [];
        wx.uploadFile({
          url: url + 'worksite/check/imageupload', //此处换上你的接口地址
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
    var openId = wx.getStorageSync('openId')
    var that = this;
    var check_id = that.data.check_id;
    var reasons = that.data.reasons;
    var check_info_id = that.data.check_info_id;
    var imgres = that.data.imgres;
    var lock = that.data.lock;
    console.log('check_id:',check_id,'reasons:',reasons,'check_info_id:',check_info_id,'imgres',imgres)
    if(!reasons){
      wx.showToast({
        title: '请填写驳回理由',
        icon: 'none',
        duration: 2000//持续的时间
      })
      return
    }
    if(!lock){
      that.setData({
        lock:true,
      })
      wx.request({
        url: url + 'worksite/check/check-bohui',
        data: {check_id:check_id,bohui:reasons,check_info_id:check_info_id,bohui_img:imgres},
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        method: 'POST',
        success(res) {
          if (res.data.Code == 200) {
            wx.showToast({
              title: '驳回成功',
              icon: 'none',
              duration: 2000,//持续的时间
              mask: true,
              success: function(){
                setTimeout(() => {
                  wx.navigateBack()
                  that.setData({
                    check_id: check_id,
                    lock:true,
                  })
                }, 1000);
              }
            })
          } else {
            that.setData({
              lock:false,
            })
          }
        },
        fail: function (err) {
          // 服务异常
          that.setData({
            lock:false,
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.check_id) {
      this.setData({
        check_id: options.check_id, //id
        check_info_id: options.check_info_id, //单条最后状态id
      })
    }
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
    wx.request({
      url: url + '/worksite/check/check-info',
      data: {check_id:that.data.check_id},
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.Code == 200) {
          that.setData({
            z_guan:res.data.data.z_guan,
            zw_hao: res.data.data.zw_hao,
            contact: res.data.data.contact,
            phone:res.data.data.phone,
            id:res.data.data.id,
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