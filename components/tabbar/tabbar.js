// components/tabbar/tabbar.js
const app = getApp()
Component({
    properties: {

    },
    data: {
        tabBar: app.globalData.tabBar3
    },
    pageLifetimes: {
        show: function () {
            var curPageArr = getCurrentPages();
            var curPage = curPageArr[curPageArr.length - 1];
            var pagePath = curPage.route;
            if (pagePath.indexOf('/') != 0) {
                pagePath = '/' + pagePath;
            }
            var tabBar = app.globalData.tabBar3;
            for (var i = 0; i < tabBar.list.length; i++) {
                if (tabBar.list[i].pagePath == pagePath) {
                    tabBar.list[i].active = true;
                }else{
                    tabBar.list[i].active = false;
                }
            }
            this.setData({
                tabBar: tabBar
            });
        },
    },
    methods: {
        scanCode: function (e) {
            wx.scanCode({
                success (res) {
                  console.log(res)
                }
            })
        }
    }
})