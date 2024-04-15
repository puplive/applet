var app = getApp();
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../../../utils/request.js")
Page({
  data: {
    host:app.globalData.url,
    changeedit:[], //获取编辑内容
    change_index:0,
    change_type:[],//整改方式
    punish_index:0,
    punish_method: [], //处罚方式
    startime: '',//整改时限
    endtime:'',
    desc:'',
    img: [],
    imgres: [],
    punish_id:'', //处罚id
    change_id:'',//整改类型id
    changeid:'',//整改记录id
  },
  onLoad: function (options) {
    var changeid = options.changeid
    this.setData({
      changeid: changeid,
    })
  },
  onReady: function () {
    this.getDetail()
  },
  onShow: function () {

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

bindStarTime: function (e) {
  this.setData({
    startime:e.detail.value,
  })
},
bindEndTime: function (e) {
  this.setData({
    endtime:e.detail.value,
  })
  if(this.data.endtime<=this.data.startime){
    wx.showToast({
      title: '请重新选择结束时间',
      icon: 'none',
      duration: 2000//持续的时间
    });
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
        var img2 = that.data.img;
        wx.uploadFile({
          url: url + 'worksite/rectify/imageupload',
          filePath: tempFilePaths[i],
          name: 'img',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          formData: {},
          success: function (res) {
            let data = JSON.parse(res.data)
            // var data = JSON.parse(res.data).info.path;
            // data = data.replace(app.globalData.mainServer, '');
            imgres2.push(data.info.origin_path);
            img2.push(data.info.path);
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
  let index = e.currentTarget.dataset.value
  // console.log(11,e,e.currentTarget.dataset.value)
  var that = this;
  (that.data.img).splice(index,1);
  (that.data.imgres).splice(index,1);
  // console.log(that.data.img,that.data.imgres)
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
  // var changetime_value = that.data.changetime_value;
  // var changetimeArray=changetime_value.split("-"); //整改时限
  var startime = that.data.startime;
  var endtime = that.data.endtime;
  var content = that.data.desc;
  var rectify_imgs = that.data.img;
  if(endtime<=startime){
    wx.showToast({
      title: '请重新选择结束时间',
      icon: 'none',
      duration: 2000//持续的时间
    });
    return false;
  }
  wx.request({
    url: url + 'worksite/rectify/rectify-edit',
    data: { 
        OpenId: wx.getStorageSync('openId'),
        projectId:sendMessageContent.projectId,
        z_guan:z_guan,
        zw_hao:zw_hao,
        rectify_type:rectify_type,
        punish_type:punish_type,
        rectify_time1: startime,rectify_time2:endtime,
        content:content,
        rectify_imgs:rectify_imgs,
        rectify_id:that.data.changeid
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    method: 'POST',
    success(res) {
      if (res.data.Code == 200) {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000,//持续的时间
          mask: true,//是否显示透明蒙层，防止触摸穿透，默认：false
          success:function(){
            setTimeout(function(){
              wx.navigateBack()
            },1000);
          }
        })
      } else {
        wx.showToast({
          title: '修改失败',
          icon: 'none',
          duration: 2000,//持续的时间
          mask: true,//是否显示透明蒙层，防止触摸穿透，默认：false
        })
      }
    },
    fail: function (err) {
      // 服务异常
    }
  })
},
  
  getDetail: function () {
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
        if (res.data.Code == 200) {
          var rectify_type = res.data.data.rectify_type || ''; //整改方式
          var punish_id = res.data.data.punish_type || ''; //处罚方式
          var changetime1 = res.data.data.rectify_time1 + " - " + res.data.data.rectify_time2; 
          var desc = res.data.data.content || '';   //详情描述
          var rectify_imgs = res.data.data.rectify_imgs || ''; //图片
          that.setData({
            changeedit:res.data.data, //编辑内容
            z_guan:res.data.data.z_guan, //展馆号
            zw_hao:res.data.data.zw_hao, //展位号
            // change_id: rectify_type, //整改类型
            changetype_name: rectify_type,
            punish_id: punish_id, //处罚方式
            desc: desc, //可以购买数量
            // changetime_index:change_index,
            // changetime_value:that.data.changetime_value, //整改时限
            startime: res.data.data.rectify_time1,//整改时限
            endtime:res.data.data.rectify_time2,
            imgres: res.data.data.rectify_imgs.split(","),
            img: res.data.data.rectify_start.split(","),
          })
        } else {

        }
        that.getRectifyType()
        that.getPunish()
      },
      fail: function (err) {
        // 服务异常
      }
    })
  },
  getRectifyType: function () {
    var that = this;
    var openId = wx.getStorageSync('openId');
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
          var items = [],
              name = that.data.changetype_name,
              id = '',
              change_index = 0;
          for (let i in res.data.data) {
            let item = res.data.data[i]
            items.push(item);
            if(item.name == name){
              id = item.id
              change_index = i
            }
          }
          that.setData({
            change_type:items,
            change_id:id || items[0].id,
            change_index: change_index,
            changetype_name:name || items[0].name
          })
        } else {

        }
      },
      fail: function (err) {
        // 服务异常
      }
    })
  },
  getPunish: function () {
    var that = this;
    var openId = wx.getStorageSync('openId');
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
})