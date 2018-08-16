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
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/Category',
      method: 'POST',
      data: {
        openid: getApp().globalData.openid,
        sessionid: getApp().globalData.sessionid,
      },
      success: function (res) {
        console.log("LLL");
        if (res.data.status == "OK") {
          var categoryList = res.data.categories;
          console.log(categoryList);
          categoryList.sort(that.compare("check_num"));
          console.log(categoryList);
          if (categoryList.length > 5)
          {
            var cnt = 0;
            var tot = 0; var top5 = 0;
            for (var index in categoryList) {
              var serie = {
                name: categoryList[index].category_name,
                data: categoryList[index].check_num
              }
              
              cnt = cnt + 1;
              tot = tot + categoryList[index].check_num;
              if (cnt <= 5)
              {
                series.push(serie);
                top5 = top5 + categoryList[index].check_num;
              }
            }
            series.push({
              name: "其他",
              data: tot-top5
            })
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
        else{
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
      }
    })
  },

  //定义一个比较器
  compare: function(propertyName) {
    return function (object1, object2) {
      var value1 = object1[propertyName];
      var value2 = object2[propertyName];
      if (value2 < value1) {
        return -1;
      } else if (value2 > value1) {
        return 1;
      } else {
        return 0;
      }
    }
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