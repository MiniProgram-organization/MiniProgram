// pages/mood/mood.js
var app = getApp()

var mood = [
  {
    "icon": "../images/mood/emotion_angry.png",
    "text": "生气"
  },
  {
    "icon": "../images/mood/emotion_fear.png",
    "text": "恐惧"
  },
  {
    "icon": "../images/mood/emotion_neutral.png",
    "text": "平淡"
  },
  {
    "icon": "../images/mood/emotion_happy.png",
    "text": "开心"
  },
  {
    "icon": "../images/mood/emotion_sad.png",
    "text": "悲伤"
  }
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: getApp().globalData.windowWidth,
    windowHeight: getApp().globalData.windowHeight,
    latitude: "",
    longitude: "",
    moodTimes: 0,
    mood:mood
  },
  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      mood: mood,
    })
  },
  goToMoodStatistics: function () {
    var that = this;
    wx.navigateTo({
      url: '../moodstatistics/moodstatistics'
    })
  },
  recordMood: function() {
    var that = this;
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