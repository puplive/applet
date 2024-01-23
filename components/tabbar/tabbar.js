// components/tabbar/tabbar.js
const app = getApp()
Component({
    properties: {

    },
    data: {
        tabBar: app.globalData.tabBar
    },
    pageLifetimes: {
        show: function () {
            let userRole = app.globalData.userRole,
                tabBar = {}
            if (userRole < 3) {
                if (userRole == 1) {
                    tabBar = app.globalData.tabBar1
                } else {
                    tabBar = app.globalData.tabBar2
                }
            } else {
                if(userRole == 15){
                    tabBar = app.globalData.tabBarCargo
                }else{
                    tabBar = app.globalData.tabBar
                }
            }
            var curPageArr = getCurrentPages();
            var curPage = curPageArr[curPageArr.length - 1];
            var pagePath = curPage.route;
            if (pagePath.indexOf('/') != 0) {
                pagePath = '/' + pagePath;
            }

            for (var i = 0; i < tabBar.list.length; i++) {
                if (tabBar.list[i].pagePath == pagePath) {
                    tabBar.list[i].active = true;
                } else {
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
            wx.navigateTo({
                url: '/pages/cargo/scan/scan'
            })
            // wx.scanCode({
            //     success(res) {
            //         console.log(res)
            //         let result = {}
            //         if(res.result.indexOf('cargo')>0){
            //             result = JSON.parse(res.result)
            //         }
            //         if(result.from == 'cargo'){
            //             wx.navigateTo({
            //                 url: '/pages/cargo/detail/detail?id='+result.id
            //             })
            //         }else{
            //             wx.showModal({
            //                 title: '无效信息',
            //                 content: res.result,
            //                 showCancel: false
            //             })
            //         } 
            //     }
            // })
        }
    }
})