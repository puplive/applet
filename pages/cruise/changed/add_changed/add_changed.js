var app = getApp();
var url = app.globalData.url;
var sendMessageContent = app.globalData.sendMessageContent;
var call = require("../../../../utils/request.js")
Page({
  data: {
    zg_index:0,
    zgArray:[],//展馆号
    z_guan:'',
    zwh_index:0,  
    zwhArray:[],//展位号
    zw_hao:'',
    zs_name: '',
    djs_nickname: '',
    djs_username: '',
    djs_tel: '',
    change_index:0,
    change_type:[],//整改方式
    punish_index:0,
    punish_method: [], //处罚方式
    // changetime_index:0,
    // changetime_value:'',
    // change_time: ['9:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00','20:00 - 21:00', '21:00 - 22:00', '22:00 - 23:00','23:00 - 24:00'], //整改时限
    startime: '18:00',
    endtime:'19:00',
    img: [],//临时路径
    imgres: [],//图片路径
    tempFilePaths:[], //临时路径
    lock: false,//验证只能提交一次
  },
  onShow: function (e) {
    this.setData({
      lock:false,
      imgres:[],
      img:[],
      // tempFilePaths: []
    })
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
            zwh_index: 0,
            zw_hao:zwhitems[0],  //展馆号默认值
          })
          that.get_zs()
          that.get_djs()
        } else {
        }
      },
      fail: function (err) {
        // 服务异常
      }
    })
  },
  
  // 展位号填写
  bindWritezwh:function(e){
    this.setData({
      zw_hao:e.detail.value
    })
    this.get_zs()
    this.get_djs()
  },
  // 展位号
  bindZwh:function(e){
    this.setData({
      zw_hao: this.data.zwhArray[e.detail.value],
      zwh_index:e.detail.value,
    })
    this.get_zs()
    this.get_djs()
    console.log(11,this.data.zw_hao);
  },
  // 展商名称
  get_zs: function(){
    let that = this
    wx.request({
      url: url + 'worksite/rectify/czs-nickname',
      data: {
        projectId:sendMessageContent.projectId,
        zwh: that.data.zw_hao
      },
      method: 'GET',
      success(res) {
        let zs_name = ''
        if (res.data.Code == 200) {
          zs_name = res.data.data.czs_nickname
          
        } else {
        }
        that.setData({
          zs_name: zs_name
        })
      },
      fail: function (err) {
        that.setData({
          zs_name: ''
        })
        // 服务异常
      }
    })
  },
  get_djs: function(){
    let that = this
    wx.request({
      url: url + 'worksite/rectify/get-djs-info',
      data: {
        projectId:sendMessageContent.projectId,
        zwh: that.data.zw_hao
      },
      method: 'GET',
      success(res) {
        let data = res.data.data
        that.setData({
          djs_nickname: data.djs_nickname || '',
          djs_username: data.djs_username || '',
          djs_tel: data.djs_tel || '',
        })
      },
      fail: function (err) {
      }
    })
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
  // bindChangeTime: function (e) {
  //   this.setData({
  //     changetime_index: e.detail.value,
  //     changetime_value:this.data.change_time[e.detail.value],
  //   })
  // },
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
// 详细描述
descInput: function (e) {
  this.setData({
    desc: e.detail.value
  })
},input_change: function (e) {
  let key = e.currentTarget.dataset.name
  this.setData({
    [key]: e.detail.value
  })
},

  // 提交
  addChangedBtn:function(){
    var that = this;
    var tempFilePaths = that.data.tempFilePaths;
    if(tempFilePaths.length>0){
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
  saveData : function(){
    var that = this;
    var z_guan= that.data.z_guan; //展馆号
    var zw_hao= that.data.zw_hao;
    //var rectify_type = that.data.change_id; //整改类型
    var rectify_type = that.data.changetype_name;//整改类型名称
    var punish_type = that.data.punish_id; //处罚方式
    // var changetime_value = that.data.changetime_value;
    // var changetimeArray=changetime_value.split("-"); //整改时限
    var startime = that.data.startime;
    var endtime = that.data.endtime;
    var content = that.data.desc;
    var rectify_imgs =that.data.imgres;
    var lock = that.data.lock;
    // console.log('zgh',z_guan,'zwh',zw_hao,'整改类型',rectify_type,'处罚方式',punish_type,'时间',startime,endtime,'图',rectify_imgs)
    if(endtime<=startime){
      wx.showToast({
        title: '请重新选择结束时间',
        icon: 'none',
        duration: 2000//持续的时间
      });
      that.setData({
        // lock:false,
        imgres:[],
        img:[],
      })
      return false;
    }
    if(!lock){
      that.setData({
        lock:true,
      })
      wx.request({
      url: url + 'worksite/rectify/rectify-add',
      data: { 
        OpenId: wx.getStorageSync('openId'),
        projectId:sendMessageContent.projectId,
        z_guan:z_guan,
        zw_hao:zw_hao,
        rectify_type:rectify_type,
        punish_type:punish_type,
        rectify_time1: startime,
        rectify_time2:endtime,
        content:content,
        rectify_imgs:rectify_imgs,
        djs_nickname: that.data.djs_nickname,
        djs_username: that.data.djs_username,
        djs_tel: that.data.djs_tel
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success(res) {
        if (res.data.Code == 200) {
          wx.showToast({
            title: '提交成功',
            icon:'success',
            duration:1500,
            mask: true,//是否显示透明蒙层，防止触摸穿透，默认：false
            success:function(){
              that.setData({
                lock:true,
              })
              setTimeout(function(){
                wx.navigateTo({
                  url: '../changed',
                })
              },2000);
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,//持续的时间
          });
          that.setData({
            lock:false,
            imgres:[],
            img:[],
          })
        }
      },
      fail: function (err) {
        // 服务异常
      }
      })
    }
  },
  onLoad: function (options) {

  },
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
                that.get_zs()
                that.get_djs()
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
            // changetime_value:that.data.change_time[0], //整改时限默认值
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
            change_type:items,
            change_id:items[0].id,
            changetype_name:items[0].name
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
          for (let i in res.data.data) {
            items.push(res.data.data[i]);
          }
          that.setData({
            punish_method:items,
            punish_id:items[0].id
          })
        } else {

        }
      },
      fail: function (err) {
        // 服务异常
      }
    })
  },
  onUnload: function () {
    // wx.reLaunch({
    //   url: '../changed/changed',
    // })
  },

  onShareAppMessage: function () {

  }
})