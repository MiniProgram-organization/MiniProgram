// pages/moodstatistics/moodstatistics.js
var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();

var timeslot = ['今日','本周','本月','今年','全部']

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    timeslot:timeslot,
    index: 0,
    angernum: 0,
    fearnum: 0,
    neutralnum: 0,
    happynum: 0,
    sadnum:0
  },
  
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  textChange: function (e) {
    this.setData({
      text: e.detail.value
    });
    console.log(this.data.text);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pieChart = new wxCharts({
      animation: true,
      disablePieStroke: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [{
        name: '生气 ',
        data: 15,
      }, {
        name: '焦虑 ',
        data: 5,
        color:'#CDBA96',
      }, {
        name: '低落 ',
        data: 4,
      }, {
        name: '平静 ',
        data:5,
      }, {
        name: '放松 ',
        data: 3,
      }, {
        name: '开心 ',
        data: 2,
      }, {
        name: '狂喜 ',
        data: 1,
      }],
      
      width: app.globalData.windowWidth*0.8,
      height: 300,
      dataLabel: true,
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