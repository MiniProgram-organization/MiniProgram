// pages/districtsta/districtsta.js
var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    series: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.constructCategorySeries();

    var pieChart = new wxCharts({
      animation: true,
      disablePieStroke: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: this.data.series,
      width: app.globalData.windowWidth * 0.8,
      height: 300,
      dataLabel: true,
    });
  },

  constructCategorySeries: function () {
    var tempSeries = []
    for (var key in getApp().globalData.categoryDic) {
      var serie = {
        name: key,
        data: getApp().globalData.categoryDic[key]
      }
      tempSeries.push(serie);
    }
    this.setData({
      series: tempSeries
    });
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