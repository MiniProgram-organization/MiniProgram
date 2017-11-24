// pages/account/account.js
var app = getApp();
var genderChoose = ['未知','男', '女']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: '',
    windowHeight: '',
    avatarUrl: '',
    iconUrl: '',
    nickName: '',
    gender: '',
    province: '',
    city: '',
    latitude: '',
    longitude: '',
    ip:'',
    scores:0,
    latitude_text:'',
    longitude_text:''
  },
    
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    
  },
  goToPrivacy: function () {
    var that = this;
    wx.navigateTo({
      url: '../privacy/privacy'
    })
  },

  goToAboutUs: function(){
    var that = this;
    wx.navigateTo({
      url: '../aboutus/aboutus'
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
    var nickName = "";
    var gender = "";
    var province = "";
    var country = "";
    console.log(app.globalData.rawData.gender)
    nickName = app.globalData.rawData.nickName;
    gender = genderChoose[app.globalData.rawData.gender];
    province = app.globalData.rawData.province;
    country = app.globalData.rawData.country;
    var latitude = app.globalData.latitude;
    var longitude = app.globalData.longitude;
    if (nickName == "") nickName = " ";
    if (gender == "") gender = " ";
    if (province == "") provincee = " ";
    if (country == "") country = " ";

    var latitude_text;
    var longitude_text;

    var latitude_d1, latitude_d2, latitude_d3;
    latitude_d1 = parseInt(latitude);
    latitude_d2 = parseInt((latitude - latitude_d1) * 60);
    latitude_d3 = parseInt(((latitude - latitude_d1) * 60 - latitude_d2) * 60);
    latitude_text = latitude_d1 + '°' + latitude_d2 + "'" + latitude_d3 + '"';

    var longitude_d1, longitude_d2, longitude_d3
    longitude_d1 = parseInt(longitude);
    longitude_d2 = parseInt((longitude - longitude_d1) * 60);
    longitude_d3 = parseInt(((longitude - longitude_d1) * 60 - longitude_d2) * 60);
    longitude_text = longitude_d1 + '°' + longitude_d2 + "'" + longitude_d3 + '"';
    if (latitude > 0) latitude_text = latitude_text + 'N';
    else if (latitude < 0) latitude_text = latitude_text + 'S';
    if (longitude > 0) longitude_text = longitude_text + 'E';
    else if (longitude < 0) longitude_text = longitude_text + 'W';

    var socresTemp = wx.getStorageSync('scores')
    var scores = 0;
    if (socresTemp != 0) {
      scores = socresTemp;
    }
    that.setData({
      nickName: nickName,
      windowWidth: app.globalData.windowWidth,
      windowHeight: app.globalData.windowHeight,
      avatarUrl: app.globalData.rawData.avatarUrl,
      gender: gender,
      province: province,
      country: country,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      iconUrl: "../images/account/ic_chevron_right_black_48dp.png",
      scores: scores,
      latitude_text: latitude_text,
      longitude_text: longitude_text,

    });
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