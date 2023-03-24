const app = getApp()
var url = app.globalData.url;

const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i<10?'0'+i:i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i<10?'0'+i:i)
}
Page({
    data: {
        expo: app.globalData.expo,
        picker_show: false,
        picker_show_zg: false,
        picker_show_zw: false,
        picker_show_time: false,
        list_zg: [],
        list_zw: [],
        value_zg: '',
        value_zw: '',
        value_time: '',
        index_zg: [0],
        index_zw: [0],
        key_zw: '',
        list_zg_all: [],
        list_zw_all: [],

        years,
        year: years[years.length-1],
        months,
        month: months[date.getMonth()],
        days,
        day: days[date.getDate()-1],
        value: [years.length-1, date.getMonth(), date.getDate()-1],

        list: []
    },
    // onShareAppMessage: function(){},
    onLoad: function () {

    },
    onShow: function () {
        this.setData({
            expo: app.globalData.expo
        })

        this.getList({})
        this.getTimeOver()
    },
    go_detail: function(e){
        let item = e.currentTarget.dataset.item
        app.globalData.time_over_zw = item
        wx.navigateTo({
            url: '/pages/time-over/detail/detail?id='+item.number_code
        })
    },
    change_zg: function(e){
        this.setData({
            index_zg: e.detail.value
        })
    },
    select_zg: function(){
        let _this = this
        setTimeout(() => {
            let value_zg = _this.data.list_zg[_this.data.index_zg[0]]
            value_zg = value_zg=='无'? '' :value_zg
            if(value_zg != _this.data.value_zg){
                _this.setData({
                    value_zg: value_zg
                })
                _this.getList({
                    value_zg: value_zg,
                    value_zw: _this.data.value_zw,
                    value_zs: _this.data.value_zs
                })
                _this.getTimeOver()
            }
            _this.close_picker()
        }, 400);
    },
    change_zw: function(e){
        this.setData({
            index_zw: e.detail.value
        })
    },
    select_zw: function(){
        let _this = this
        setTimeout(() => {
            let value_zw = _this.data.list_zw[_this.data.index_zw[0]]
            value_zw = value_zw=='无'? '' :value_zw
            if(value_zw != _this.data.value_zw){
                _this.setData({
                    value_zw: value_zw
                })

                _this.getTimeOver()
            }
            _this.close_picker()
        }, 400)
    },
    input_zw: function (e) {
        this.setData({
            key_zw: e.detail.value,
            index_zw: [0]
        })
        this.getList({
            value_zg: this.data.value_zg,
            value_zw: e.detail.value
        })
    },
    change_time: function(e) {
        const val = e.detail.value
        let year = this.data.years[val[0]],
            month = this.data.months[val[1]],
            day = this.data.days[val[2]]
        this.setData({
            year: year,
            month: month,
            day: day,
            value: [val[0],val[1],val[2]],
            // value_time: year+'/'+month+'/'+day
        })
        // this.getTimeOver()
    },
    select_time: function() {
        let _this = this
            setTimeout(() => {
            let year = _this.data.year,
                month = _this.data.month,
                day = _this.data.day
            this.setData({
                value_time: year+'/'+month+'/'+day
            })
            _this.getTimeOver()
            _this.close_picker()
        }, 400)
    },
    set_date: function(){
        let val = [years.length-1, date.getMonth(), date.getDate()-1],
            year = this.data.years[val[0]],
            month = this.data.months[val[1]],
            day = this.data.days[val[2]]
        this.setData({
            year: year,
            month: month,
            day: day,
            value: val,
            value_time: year+'/'+month+'/'+day
        })
        this.getTimeOver()
        this.close_picker()
    },
    getList: function (d) {
        let that = this
        wx.request({
            url: url + '/worksite/check/search-list',
            data: {
                hui_id: this.data.expo.hui_id,
                zguan: d.value_zg || '',
                search: d.value_zw || ''
            },
            success(data) {
                let res = data.data,
                    list_zg = ['无'],
                    list_zw = ['无']

                if(res.Code == 200){
                    list_zg.push(...res.data.czs_zguan)
                    list_zw.push(...res.data.czs_number)
                }

                if(!d.value_zg && !d.value_zw ){
                    that.setData({
                        list_zg: list_zg,
                        list_zw: list_zw,
                        list_zg_all: list_zg,
                        list_zw_all: list_zw
                    })
                }else{
                    that.setData({
                        list_zw: list_zw
                    })
                }
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },
    getTimeOver: function () {
        let that = this
        wx.request({
            url: url + '/worksite/check/mi-time-out',
            data: {
                project_id: this.data.expo.hui_id,
                number: this.data.value_zw,
                date: this.data.value_time.replace(/\//g, '-'),
                halo_nr: this.data.value_zg
            },
            success(data) {
                let res = data.data,
                    list = []
                if(res.Code == 200){
                    list = Object.values(res.data)
                }
                that.setData({
                    list: list
                })
                
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },
    
    close_picker: function(){
        this.setData({
            picker_show: false,
            picker_show_zg: false,
            picker_show_zw: false,
            picker_show_time: false
        })
    },
    show_picker_zg: function(){
        this.setData({
            picker_show: true,
            picker_show_zg: true,
            picker_show_zw: false,
            picker_show_time: false
        })
    },
    show_picker_zw: function(){
        this.setData({
            picker_show: true,
            picker_show_zg: false,
            picker_show_zw: true,
            picker_show_time: false
        })
        
    },
    show_picker_time: function(){
        this.setData({
            picker_show: true,
            picker_show_zg: false,
            picker_show_zw: false,
            picker_show_time: true
        })
    },
    close_picker_time: function(){
        this.setData({
            value_time: '',
        })
        this.getTimeOver()
        this.close_picker()
    }
    
})