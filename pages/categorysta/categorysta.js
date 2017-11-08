// pages/categorysta/categorysta.js
var wxCharts = require('../../utils/wxcharts.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var chart = new Charts({
      canvasId: 'columnCanvas',
      type: 'column',
      categories: ['2016-08', '2016-09', '2016-10', '2016-11', '2016-12', '2017'],
      series: [{
        name: '成交量1',
        data: [15, 20, 45, 37, 4, 80]
      }, {
        name: '成交量2',
        data: [70, 40, 65, 100, 34, 18]
      }, {
        name: '成交量3',
        data: [70, 40, 65, 100, 34, 18]
      }, {
        name: '成交量4',
        data: [70, 40, 65, 100, 34, 18]
      }],
      yAxis: {
        format: function (val) {
          return val + '万';
        }
      },
      width: 640,
      height: 400,
      dataLabel: false
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