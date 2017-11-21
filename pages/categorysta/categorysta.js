// pages/districtsta/districtsta.js
var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var series = [];
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/Category',
      method: 'POST',
      data: {
        openid: getApp().globalData.openid
      },
      success: function (res) {
        console.log("LLL");
        if (res.data.status == "OK") {
          var categoryList = res.data.categories;
          console.log(categoryList);
          for (var index in categoryList) {
            var serie = {
              name: categoryList[index].category_name,
              data: categoryList[index].check_num
            }
            series.push(serie);
          }
          console.log(series);
          var pieChart = new wxCharts({
            animation: true,
            disablePieStroke: true,
            canvasId: 'pieCanvas',
            type: 'pie',
            series: series,
            width: app.globalData.windowWidth * 0.8,
            height: 300,
            dataLabel: true,
          });
        }
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

    var that = this;
    
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