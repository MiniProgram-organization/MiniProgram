// pages/weather_new/weather_new.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    location_url: '../images/weather_new/ic_place_white_18dp.png',
    set_url: '../images/weather_new/ic_view_headline_white_18dp.png',
    share_url: '../images/weather_new/ic_open_in_new_white_18dp.png',
    wind_url:'../images/weather_new/ic_settings_input_antenna_white_18dp.png',
    atmosphere_url:'../images/weather_new/ic_network_wifi_white_18dp.png',
    tem_url:'../images/weather_new/ic_brightness_4_white_18dp.png',
    award_text_1:'已经连续查看天气',
    con_day:0,
    award_text_2:'天,继续以获得更多积分奖励吧~'
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
    app.editTabBar(); 
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