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
    changeedit:[], //获取编辑内容
    change_index:0,
    change_type:[],//整改方式
    punish_index:0,
    punish_method: [], //处罚方式
    changetime_index:0,
    changetime_value:'',
    change_time: ['9:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00','20:00 - 21:00', '21:00 - 22:00', '22:00 - 23:00','23:00 - 24:00'], //整改时限
    desc:'',
    img: [],
    imgres: [],
    punish_id:'', //处罚id
    change_id:'',//整改类型id
    changeid:'',//整改记录id
  },

  // 整改类型填写
  bindChangetype:function(e){
    this.setData({
      changetype_name:e.detail.value
    })
  },
 // 点击整改类型
 bindChange: function (e) {
  this.setData({
    change_index:e.detail.value,
    change_id:this.data.change_type[e.detail.value].id,
    changetype_name:this.data.change_type[e.detail.value].name
  })
},
// 点击处罚方式
bindPunish: function (e) {
  this.setData({
    punish_index:e.detail.value,
    punish_id:this.data.punish_method[e.detail.value].id,
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
      var uploadsimg = [];
      for (let i in tempFilePaths) {
        var imgres2 = that.data.imgres;
        var img2 = [];
        wx.uploadFile({
          url: url + 'worksite/rectify/imageupload', //此处换上你的接口地址
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
descInput: function (e) {
this.setData({
  desc: e.detail.value
})
},

// 提交
editChangedBtn:function(){
  var that = this;
  var z_guan= that.data.z_guan; //展馆号
  var zw_hao= that.data.zw_hao;
  // var rectify_type = that.data.change_id; //整改类型
  var rectify_type = that.data.changetype_name;//整改类型名称
  var punish_type = that.data.punish_id; //处罚方式
  var changetime_value = that.data.changetime_value;
  var changetimeArray=changetime_value.split("-"); //整改时限
  var content = that.data.desc;
  var rectify_imgs =that.data.imgres;
  console.log('zgh',z_guan,'zwh',zw_hao,'整改类型',rectify_type,'处罚方式',punish_type,'时间',changetimeArray[0],changetimeArray[1],'图',rectify_imgs)
  wx.request({
    url: url + 'worksite/rectify/rectify-edit',
    data: { OpenId: wx.getStorageSync('openId'),projectId:sendMessageContent.projectId,z_guan:z_guan,zw_hao:zw_hao,rectify_type:rectify_type,punish_type:punish_type,rectify_time1: changetimeArray[0],rectify_time2:changetimeArray[1],content:content,rectify_imgs:rectify_imgs,rectify_id:that.data.changeid},
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    method: 'POST',
    success(res) {
      if (res.data.Code == 200) {
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 2000//持续的时间
        })
        wx.navigateTo({
          url: '../changed',
        })
      } else {
        wx.showToast({
          title: '修改失败',
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
    var changeid = options.changeid
    this.setData({
      changeid: changeid,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var openId = wx.getStorageSync('openId');
    // 编辑内容
    wx.request({
      url: url + 'worksite/rectify/rectify-edit',
      data: {rectify_id:that.data.changeid,OpenId:openId},
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(111,res);
        if (res.data.Code == 200) {
          var change_id = res.data.data.rectify_type == undefined ? '' : res.data.data.rectify_type; //整改方式
          var punish_id = res.data.data.punish_type == undefined ? '' : res.data.data.punish_type; //处罚方式
          var changetime1 = res.data.data.rectify_time1 + " - " + res.data.data.rectify_time2; 
          console.log('time:',changetime1)
          var changetime_value = changetime1 == undefined ? '' : changetime1; 
          var change_index = that.data.change_time.indexOf(changetime1);
          var desc = res.data.data.content == undefined ? '' : res.data.data.content;   //详情描述
          var rectify_imgs = res.data.data.rectify_imgs == undefined ? '' : res.data.data.rectify_imgs; //图片
          that.setData({
            changeedit:res.data.data, //编辑内容
            z_guan:res.data.data.z_guan, //展馆号
            zw_hao:res.data.data.zw_hao, //展位号
            change_id: change_id, //整改类型
            punish_id: punish_id, //处罚方式
            desc: desc, //可以购买数量
            changetime_index:change_index,
            changetime_value:that.data.changetime_value, //整改时限
            imgres: res.data.data.rectify_imgs.split(","),   //地址省市区
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
          var change_index2='';
          for (let i in res.data.data) {
            items.push(res.data.data[i]);
            if(res.data.data[i].id == that.data.change_id){
              change_index2=i
             }
          }
          that.setData({
            change_type:items,
            change_index:change_index2,
            change_id:items[change_index2].id,
            changetype_name:items[change_index2].name
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
        if (res.data.Code == 200) {
          var items = [];
          var punish_index2='';
          for (let i in res.data.data) {
            items.push(res.data.data[i]);
            if(res.data.data[i].id == that.data.punish_id){
             punish_index2=i
            }
          }
          that.setData({
            punish_method:items,
            punish_index:punish_index2,
            punish_id:items[punish_index2].id
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
    wx.reLaunch({
      url: '../changed/changed',
    })
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