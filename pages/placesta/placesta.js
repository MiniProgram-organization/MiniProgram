// pages/placesta/placesta.js
var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMostPlace();
  },
  showLine: function (line_catrgory, line_data){
    var that = this;
    var pieChart = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas',
      type: 'column',
      categories: line_catrgory,

      series: [{
        name: 'POI',
        data: line_data,
        format: function (val) {
          return val.toFixed(0);
        }
      }],
      yAxis: {
        title: '签到次数',
        format: function (val) {
          return val;
        },
        min: 0
      },
      width: that.data.windowWidth,
      height: 350,
      dataLabel: true,
    });
  },
  getMostPlace: function (){
    var line_catrgory = [];
    var line_data = [];
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/FrequentPOIs',
      method: 'POST',
      data: {
        place_num:5,
        openid: getApp().globalData.openid,
      },
      success: function (res) {
        console.log(res.data)
        console.log(res.data.places.length)
        for (var i = 0; i < res.data.places.length; i++){
          line_catrgory.push(res.data.places[i].venue)
          line_data.push(res.data.places[i].check_num)
        }
        if (res.data.places.length == 0){
          wx.showToast({
            title: '无签到记录!',
            icon:'loading'
          })
        }
        else that.showLine(line_catrgory, line_data)
      },
      fail: function(res){
      }
    })
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