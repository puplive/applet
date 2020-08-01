var app = getApp();
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../../../utils/request.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    zg_index:0,
    zgArray:[],//展馆号
    z_guan:'',
    zwh_index:0,  
    zwhArray:[],//展位号
    zw_hao:'',
    change_index:0,
    change_type:[],//整改方式
    punish_index:0,
    punish_method: [], //处罚方式
    changetime_index:0,
    changetime_value:'',
    change_time: ['9:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00','20:00 - 21:00', '21:00 - 22:00', '22:00 - 23:00','23:00 - 24:00'], //整改时限
    img: '../../../../images/camera.png',
    imgres: '',
  },
  // 展馆号
  bindProjectChange: function(e){
    var that = this;
    this.setData({
      z_guan: that.data.zgArray[e.detail.value],
      zg_index:e.detail.value
    })
    // 展位号
    wx.request({
      url: url + 'worksite/rectify/zhao',
      data: {projectId:sendMessageContent.projectId,z_guan: that.data.zgArray[e.detail.value]},
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.Code == 200) {
          var zwhitems = [];
          for (let i in res.data.data) {
            zwhitems.push(res.data.data[i]);
          }
          that.setData({
            zwhArray:zwhitems,
            zw_hao:zwhitems[0],  //展馆号默认值
          })
        } else {
        }
      },
      fail: function (err) {
        // 服务异常
      }
    })
  },
  // 展位号
  bindZwh:function(e){
    this.setData({
      zw_hao: this.data.zwhArray[e.detail.value],
      zwh_index:e.detail.value
    })
  },
  // 点击整改类型
  bindChange: function (e) {
    this.setData({
      change_index: this.data.change_type[e.detail.value],
      change_id:e.detail.value,
    })
  },
  // 点击处罚方式
  bindPunish: function (e) {
    console.log(13,e)
    this.setData({
      punish_index: e.detail.value,
      punish_id:e.currentTarget.dataset.id,
    })
  },
  // 点击整改时限
  bindChangeTime: function (e) {
    this.setData({
      changetime_index: e.detail.value,
      changetime_value:this.data.change_time[e.detail.value],
    })
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
        wx.uploadFile({
          url: url + 'worksite/rectify/imageupload', //此处换上你的接口地址
          filePath: tempFilePaths[0],
          name: 'img',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          method: 'POST',
          formData: {},
          success: function (res) {
            console.log(12,tempFilePaths[0]);
            var data = JSON.parse(res.data).info.path;
            data = data.replace(app.globalData.mainServer, '');
            console.log(11, data);
            that.setData({
              // tempFilePath可以作为img标签的src属性显示图片
              img: url + data,
              imgres: data,
            })
          },
          fail: function (res) {
            console.log('fail');
          },
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
// 详细地址
descInput: function (e) {
  this.setData({
    desc: e.detail.value
  })
},

  // 提交
  addChangedBtn:function(){
    var that = this;
    var z_guan= that.data.z_guan; //展馆号
    var zw_hao= that.data.zw_hao;
    var rectify_type = that.data.change_id; //整改类型
    var punish_type = that.data.punish_id; //处罚方式
    var changetime_value = that.data.changetime_value;
    var changetimeArray=changetime_value.split("-"); //整改时限
    var content = that.data.desc;
    var rectify_imgs =that.data.imgres;
    console.log('zgh',z_guan,'zwh',zw_hao,'整改类型',rectify_type,'处罚方式',punish_type,'时间',changetimeArray[0],changetimeArray[1])
    return false;
    wx.request({
      url: url + 'worksite/rectify/rectify-add',
      data: { OpenId: wx.getStorageSync('openId'),projectId:sendMessageContent.projectId,z_guan:z_guan,zw_hao:zw_hao,rectify_type:rectify_type,punish_type:punish_type,rectify_time1: changetimeArray[0],rectify_time2:changetimeArray[1],content:content,rectify_imgs:rectify_imgs},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success(res) {
        console.log(1,res)
        if (res.data.Code == 200) {
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            duration: 2000//持续的时间
          })
          wx.switchTab({
            url: '../../../../admin/changed/changed',
          })
        } else {
          wx.showToast({
            title: '添加失败',
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var openId = wx.getStorageSync('openId');
    // 展馆号
    wx.request({
      url: url + 'worksite/rectify/zguan',
      data: {projectId:sendMessageContent.projectId,OpenId:openId},
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
          // 展位号
          wx.request({
            url: url + 'worksite/rectify/zhao',
            data: {projectId:sendMessageContent.projectId,z_guan:items[0]},
            method: 'GET',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              if (res.data.Code == 200) {
                var zwhitems = [];
                for (let i in res.data.data) {
                  zwhitems.push(res.data.data[i]);
                }
                that.setData({
                  zwhArray:zwhitems,
                  zw_hao:zwhitems[0],  //展馆号默认值
                })
              } else {

              }
            },
            fail: function (err) {
              // 服务异常
            }
          })
          that.setData({
            zgArray:items,
            z_guan:items[0],  //展馆号默认值
            changetime_value:that.data.change_time[0], //整改时限默认值
            desc:''
          })
        } else {

        }
      },
      fail: function (err) {
        // 服务异常
      }
    })
    //整改类型
    wx.request({
      url: url + 'worksite/rectify/rectify-type',
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
            change_type:items
          })
        } else {

        }
      },
      fail: function (err) {
        // 服务异常
      }
    })
    //处罚方式
    wx.request({
      url: url + 'worksite/rectify/punish',
      data: {OpenId:openId},
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(0,res)
        if (res.data.Code == 200) {
          var items = [];
          for (let i in res.data.data) {
            items.push(res.data.data[i]);
          }
          
          that.setData({
            punish_method:items
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
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {

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