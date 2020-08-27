//app.js
//const url = 'https://www.exposaas.com/'
//const url ='http://www.newmoble.com/'
const url ='http://test.exposaas.cn/'

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var openId = wx.getStorageSync('openId')
  // 获取用户信息
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.login({
          success: res => {
            var code = res.code
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                wx.request({
                  url: url + 'worksite/default/index', //仅为示例，并非真实的接口地址
                  data: {
                    code: code,
                    encryptedData: res.encryptedData,
                    iv: res.iv
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success(res) {
                    wx.setStorageSync('openId', res.data.data.openId)
                    wx.setStorageSync('sessionKey', res.data.data.sessionKey)
                  },
                  fail: function (res) {
                  }
                })
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    }
  })
  },
   //获取用户信息
   getUserInfo: function (cb) {
    var that = this
    if (this.globalData.personInfo) {
      typeof cb == "function" && cb(this.globalData.personInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.personInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.personInfo)
            }
          })
        }
      })
    }
  },


  //第一种底部  
  editTabBar: function () {
    //使用getCurrentPages可以获取当前加载中所有的页面对象的一个数组，数组最后一个就是当前页面。

    var curPageArr = getCurrentPages();    //获取加载的页面
    var curPage = curPageArr[curPageArr.length - 1];    //获取当前页面的对象
    var pagePath = curPage.route;    //当前页面url
    if (pagePath.indexOf('/') != 0) {
      pagePath = '/' + pagePath;
    }

    var tabBar = this.globalData.tabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == pagePath) {
        tabBar.list[i].active = true;    //根据页面地址设置当前页面状态    
      }
    }
    curPage.setData({
      tabBar: tabBar
    });
  },
  //第二种底部，原理同上
  editTabBar1: function () {
    var curPageArr = getCurrentPages();
    var curPage = curPageArr[curPageArr.length - 1];
    var pagePath = curPage.route;
    if (pagePath.indexOf('/') != 0) {
      pagePath = '/' + pagePath;
    }
    var tabBar = this.globalData.tabBar1;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == pagePath) {
        tabBar.list[i].active = true;
      }
    }
    curPage.setData({
      tabBar: tabBar
    });
  },
  //第二种底部，原理同上
  editTabBar2: function () {
    var curPageArr = getCurrentPages();
    var curPage = curPageArr[curPageArr.length - 1];
    var pagePath = curPage.route;
    if (pagePath.indexOf('/') != 0) {
      pagePath = '/' + pagePath;
    }
    var tabBar = this.globalData.tabBar2;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == pagePath) {
        tabBar.list[i].active = true;
      }
    }
    curPage.setData({
      tabBar: tabBar
    });
  },
  globalData: {
    userInfo: null,
    hasUserInfo: null,
    url: url,
    sendMessageContent: {
      project_name: '',//项目名称
      projectId:'',//项目ID
      RoleId:'',//角色ID
    },
    //第一种底部导航栏显示(操作员)
    tabBar: {
      "color": "#9E9E9E",
      "selectedColor": "#f00",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "list": [
        {
          "pagePath": "/pages/operator/operator",
          "text": "订单中心",
          "iconPath": "/images/icon_dingdan.svg",
          "selectedIconPath": "/images/icon_dingdan_on.svg",
          "selectedColor": "#303133",
          "clas": "menu-item",
          active: true
        },
        {
          //"pagePath": "/pages/operator/changed/changed",
          //"text": "巡馆整改",
          //"iconPath": "/images/icon_laba.svg",
          "selectedIconPath": "/images/icon_laba_on.svg",
          "selectedColor": "#303133",
          "clas": "menu-item",
          active: true
        },
        {
          "pagePath": "/pages/operator/person/person",
          "text": "我的",
          "iconPath": "/images/icon_wode.svg",
          "selectedIconPath": "/images/icon_wode_on.svg",
          "selectedColor": "#303133",
          "clas": "menu-item",
          active: false
        }
      ],
      "position": "bottom"
    },
    //第二种底部导航栏显示(管理员)
    tabBar1: {
      "color": "#9E9E9E",
      "selectedColor": "#909399",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "list": [
        {
          "pagePath": "/pages/admin/admin",
          "text": "首页",
          "iconPath": "/images/icon_fangzi.svg",
          "selectedIconPath": "/images/icon_fangzi_on.svg",
          "clas": "menu-item1",
          "selectedColor": "#303133",
          active: false
        },
        {
          "pagePath": "/pages/admin/ad_order/ad_order",
          "text": "订单中心",
          "iconPath": "/images/icon_dingdan.svg",
          "selectedIconPath": "/images/icon_dingdan_on.svg",
          "selectedColor": "#303133",
          "clas": "menu-item1",
          active: true
        },
        {
          "pagePath": "/pages/admin/changed/changed",
          "text": "巡馆整改",
          "iconPath": "/images/icon_laba.svg",
          "selectedIconPath": "/images/icon_laba_on.svg",
          "selectedColor": "#303133",
          "clas": "menu-item1",
          active: false
        },
        {
          "pagePath": "/pages/admin/acceptance/acceptance",
          "text": "展位验收",
          "iconPath": "/images/icon_zhanwei.svg",
          "selectedIconPath": "/images/icon_zhanwei_on.svg",
          "selectedColor": "#303133",
          "clas": "menu-item1",
          active: false
        },
        {
          "pagePath": "/pages/admin/person/person",
          "text": "我的",
          "iconPath": "/images/icon_wode.svg",
          "selectedIconPath": "/images/icon_wode_on.svg",
          "selectedColor": "#303133",
          "clas": "menu-item1",
          active: false
        }
      ],
      "position": "bottom"
    },
    //第二种底部导航栏显示(巡馆人员)
    tabBar2: {
      "color": "#9E9E9E",
      "selectedColor": "#909399",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "list": [
        {
          "pagePath": "/pages/cruise/cruise",
          "text": "订单中心",
          "iconPath": "/images/icon_dingdan.svg",
          "selectedIconPath": "/images/icon_dingdan_on.svg",
          "selectedColor": "#303133",
          "clas": "menu-item1",
          active: true
        },
        {
          "pagePath": "/pages/cruise/changed/changed",
          "text": "巡馆整改",
          "iconPath": "/images/icon_laba.svg",
          "selectedIconPath": "/images/icon_laba_on.svg",
          "selectedColor": "#303133",
          "clas": "menu-item1",
          active: false
        },
        {
          "pagePath": "/pages/cruise/acceptance/acceptance",
          "text": "展位验收",
          "iconPath": "/images/icon_zhanwei.svg",
          "selectedIconPath": "/images/icon_zhanwei_on.svg",
          "selectedColor": "#303133",
          "clas": "menu-item1",
          active: false
        },
        {
          "pagePath": "/pages/cruise/person/person",
          "text": "我的",
          "iconPath": "/images/icon_wode.svg",
          "selectedIconPath": "/images/icon_wode_on.svg",
          "selectedColor": "#303133",
          "clas": "menu-item1",
          active: false
        }
      ],
      "position": "bottom"
    }
  }
})