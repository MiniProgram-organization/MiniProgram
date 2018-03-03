// pages/discoverLocation/discoverLocation.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    latitude:0.0,
    longitude:0.0,
    title:'',
    address:'',
    POI_lat:0.0,
    POI_lng:0.0,
    markers:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      title: options.title,
      address: options.address,
      id: options.id,
      POI_lat: options.POI_lat,
      POI_lng: options.POI_lng,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      markers:[{
        latitude: options.POI_lat,
        longitude: options.POI_lng,
        iconPath: '../images/map/proximity.jpg',
        title:options.title,
        label:options.title,
        width: 20,
        height: 30,
      },
      {
          latitude: app.globalData.latitude,
          longitude: app.globalData.longitude,
          iconPath: '../images/map/navigation.png',
          width:25,
          height:25,
      }]
    })
    console.log(this.data.markers)
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
    console.log(this.data.longitude)
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