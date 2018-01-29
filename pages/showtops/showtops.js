// pages/account/showtops.js
var app = getApp();
var genderChoose = ['未知', '男', '女']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    avatarUrl: '',
    iconUrl: '',
    nickName: '',
    gender: '',
    province: '',
    city: '',
    latitude: 0,
    longitude: 0,
    ip: '',
    qrcodeUrl: '',
    scores: 0,
    latitude_text: '',
    longitude_text: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var openid_other = options.target_id;
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/Profile',
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        sessionid: app.globalData.sessionid,
        openid_other: openid_other,
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude
      },
      success: function (res) {
        console.log(res.data);
        var nickName = res.data.nickName;
        var gender = genderChoose[res.data.gender];
        var province = res.data.province;
        var country = res.data.country;
        var score = res.data.score;
        if (nickName == "") nickName = " ";
        if (gender == "") gender = " ";
        if (province == "") province = " ";
        if (country == "") country = " ";
        if (score == "") score = " ";
        that.setData({
          nickName: nickName,
          windowWidth: app.globalData.windowWidth,
          windowHeight: app.globalData.windowHeight,
          avatarUrl: app.globalData.rawData.avatarUrl,
          gender: gender,
          province: province,
          country: country,
          iconUrl: "../images/account/ic_chevron_right_black_48dp.png",
          score: score
        });
      },
      fail: function (res) {

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
  onShow: function (options) {
    //app.editTabBar();
    console.log(options); 
    

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
    //wx.stopPullDownRefresh()
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