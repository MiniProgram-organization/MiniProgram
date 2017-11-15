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

    var line_catrgory = ['上海市政府','复旦大学','计算机楼','长泰广场','汇智'];
    var line_data = [6,4,3,2,1];
    var pieChart = new wxCharts({
      animation: true,
      disablePieStroke: true,
      canvasId: 'pieCanvas',
      type: 'line',
      categories: line_catrgory,

      series: [{
        name: '兴趣点',
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