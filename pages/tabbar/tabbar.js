// pages/tabbar/tabbar.js
Component({
    data: {
    },
    ready: function () { },
    lifetimes: {
        attached: function () {
            // this.init()
        },
    },
    pageLifetimes: {
        show: function () {
            // this.init()
        },
    },
    methods: {
        go_page: function (e) {
            let i = e.currentTarget.dataset.item
            console.log(i)
        }
    }
})