// pages/moodstatistics/moodstatistics.js
var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var timeslot = ['本周趋势(默认)','今日','本周','本月','今年','全部']
var all_name = ['狂喜', '开心', '放松', '平静', '低落', '焦虑', '生气','其他']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    timeslot:timeslot,
    categoryres:{},
    hint_text:"请选择时间",
    index:0,
    display_pie:'inline'
  },
  
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
    if (e.detail.value == 0){
      this.week_mood_sta()
    }
    else{
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/MoodCategory',
      data: {
        openid: app.globalData.openid,
        time_type: parseInt(that.data.index),
        sessionid: app.globalData.sessionid,
      },
      method: 'POST',
      success: function (res) {
        console.log("返回的心情分类");
        console.log(res);
        that.setData({
          categoryres: res.data
        });
        if(res.data.mood_id_num == 0)
        {
          //显示此时间段无心情记录
          that.setData({
            hint_text: timeslot[e.detail.value]+'无记录',
            display_pie:'none'
          })
        }
        else {
          var total_num = 0
          for (var i = 0; i < res.data.moods.length; i++) {
            total_num = total_num + res.data.moods[i].check_num
          }
          that.setData({
            hint_text: timeslot[e.detail.value] + '您记录了' + total_num+'条心情',
            display_pie: 'inline'
          })
          that.showCategory();
        }
      },
      fail: function(res){
      }
    })
    }
  },
  showCategoryLine: function(e){

    var total_moodrecord = 0;
    var category_list = this.data.categoryres.moods;
    var category_table = [];
    var line_data = []
    var line_category = []
    for (var i = 0; i < category_list.length; i++) {
      line_data.push(category_list[i].check_num);
      line_category.push(all_name[category_list[i].mood_id]);
      console.log(category_list[i].check_num)
      category_table.push({
        name: all_name[category_list[i].mood_id],
        data: category_list[i].check_num
      })
    }
    console.log(category_table)
    var pieChart = new wxCharts({
      animation: true,
      disablePieStroke: true,
      canvasId: 'pieCanvas',
      type: 'column',
      categories: line_category,
      
      series: [{
        name: '心情',
        data: line_data,
        format: function (val) {
          return val.toFixed(0);
        }
      }],
      yAxis: {
        title: '记录次数',
        format: function (val) {
          return val;
        },
        min: 0
      },
      width: app.globalData.windowWidth * 0.8,
      height: 300,
      dataLabel: true,
    });
  },
  showCategory: function(e){
    var total_moodrecord = 0;
    var category_list = this.data.categoryres.moods;
    var category_table = [];
    for(var i = 0; i < category_list.length; i++)
    {
      //console.log(category_list[i].check_num)
      category_table.push({
        name: all_name[category_list[i].mood_id],
        data: category_list[i].check_num
      })
    }
    //console.log(category_table)
    var pieChart = new wxCharts({
      animation: true,
      disablePieStroke: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: category_table,
      width: app.globalData.windowWidth * 0.8,
      height: 300,
      dataLabel: true,
    });
  },
  textChange: function (e) {
    this.setData({
      text: e.detail.value
    });
    console.log(this.data.text);
  },
  week_mood_sta: function(e){
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/MoodCategory',
      data: {
        openid: app.globalData.openid,
        time_type: 2,
        sessionid: app.globalData.sessionid,
      },
      method: 'POST',
      success: function (res) {
        console.log("返回的心情分类");
        console.log(res);
        that.setData({
          categoryres: res.data
        });
        if (res.data.mood_id_num == 0) {
          that.setData({
            hint_text: '本周无记录',
            display_pie: 'none'
          })
        }
        else {
          var total_num = 0
          for (var i = 0; i < res.data.moods.length; i++) {
            total_num = total_num + res.data.moods[i].check_num
          }
          that.setData({
            hint_text: '本周心情趋势:' + total_num+'条记录',
            display_pie: 'inline'
          })
          that.showCategoryLine();
        }
      },
      fail: function (res) {
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/MoodCategory',
      data: {
        openid: app.globalData.openid,
        time_type: parseInt(that.data.index),
        sessionid: app.globalData.sessionid,
      },
      method: 'POST',
      success: function (res) {
        console.log("返回的心情分类");
        console.log(res);
        that.setData({
          categoryres: res.data
        });
        if(res.data.mood_id_num == 0)
        {
          //显示此时间段无心情记录
          that.setData({
            hint_text: timeslot[e.detail.value]+'无记录',
            display_pie: 'none'
          })
        }
        else {
          var total_num = 0
          for (var i = 0; i < res.data.moods.length; i++) {
            total_num = total_num + res.data.moods[i].check_num
          }
          that.setData({
            hint_text: timeslot[e.detail.value] + '您记录了' + total_num+'条心情',
            display_pie: 'inline'
          })
          that.showCategory();
        }
      },
      fail: function(res){
      }
    })
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
    this.week_mood_sta();
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