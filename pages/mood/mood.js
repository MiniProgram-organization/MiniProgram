// pages/mood/mood.js
var app = getApp()

var mood =[
  {
    "icon": "../images/mood/7.png",
    "text": "狂喜"
  },
  {
    "icon": "../images/mood/6.png",
    "text": "开心"
  },
  {
    "icon": "../images/mood/5.png",
    "text": "放松"
  },
  {
    "icon": "../images/mood/4.png",
    "text": "平静"
  },
  {
    "icon": "../images/mood/3.png",
    "text": "低落"
  },
  {
    "icon": "../images/mood/2.png",
    "text": "焦虑"
  },
  {
    "icon": "../images/mood/1.png",
    "text": "生气"
  },
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
    mood:mood,
    moodId: 0,
  },
  bindChange: function (e) {
    this.moodId = e.detail.value;
    this.setData({
      mood: mood,
    })
  },
  goToMoodStatistics: function () {
    wx.navigateTo({
      url: '../moodstatistics/moodstatistics'
    })
  },
  goToRecordMood: function(){
    wx.navigateTo({
      url: '../recordmood/recordmood?moodId='+this.moodId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.moodId = 0;
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