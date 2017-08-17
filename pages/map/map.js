var utils = require('../../utils/utils.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: getApp().globalData.windowWidth,
    windowHeight: getApp().globalData.windowHeight,
    markers: [],
    venue:'',
    POI_id:'',
    longitude: '',
    latitude: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options){
    var that = this;
    console.log(options);
    this.setData({
      POI_id: options.POI_id,
      longitude: options.target_longitude,
      latitude: options.target_latitude,
      venue: options.target_venue,
      markers: [{
        latitude: options.target_latitude,
        longitude: options.target_longitude,
        iconPath: '../images/' + options.target_category + '.jpg',
      }]
    });
    
  },

  checkIn: function(e){
    var that = this;

    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/CheckIn',
      method: 'POST',
      data: {
        created_by_user: false,
        openid: getApp().globalData.openid,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        POI_id: that.data.POI_id
      },
      success: function (e) {
        if (e.data.status == "OK") {
          wx.showToast({
            title: that.data.venue + " checked",
            icon: 'loading',
            duration: 500
          });
        }
      },
      fail: function (e) {
        console.log("签到失败");
        console.log(e);
      }

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