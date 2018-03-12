// pages/account/account.js
var app = getApp();
var genderChoose = ['未知','男', '女']
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
    ip:'',
    qrcodeUrl: '',
    scores:0,
    latitude_text:'',
    longitude_text:''
  },
    
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  redirectToQRCode: function () {
    this.getQRCode();
  },

  getQRCode: function () {
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/qrcode.py',
      method: 'POST',
      data: {
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        openid: getApp().globalData.openid,
        sessionid: getApp().globalData.sessionid,
      },
      success: function (e) {
        console.log(e.data)
        console.log(that.latitude)
        that.setData({
          qrcodeUrl: e.data.url
        });
        wx.navigateTo({
          url: '../qrcode/qrcode?qrcodeUrl='+that.data.qrcodeUrl,
        })
      }
    })
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
  getLocationResur: function (cnt) {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        cnt = cnt + 1
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.getMyInfo();
      },
      fail: function (res) {
        cnt = cnt + 1
        if (cnt < 10) {
          that.getLocationResur(cnt);
        }
        else {
          var latitude = wx.getStorageSync('latitude')
          var longitude = wx.getStorageSync('longitude')
          if (latitude == "") {
            wx.showToast({
              title: '定位失败!请检查设置!',
              duration: 1000,
              icon: 'loading'
            })
          }
          else {
            wx.showToast({
              title: '定位失败!使用上次位置!',
              duration: 1000,
              icon: 'loading'
            })
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude
            })
            that.getMyInfo();
          }
        }
      }
    })
  },
  onShow: function () {
    app.editTabBar(); 
    var that = this;
    var nickName = "";
    var gender = "";
    var province = "";
    var country = "";
    console.log(app.globalData.rawData)
    console.log('rawData!!!!!!!!!!')
    nickName = app.globalData.rawData.nickName;
    gender = genderChoose[app.globalData.rawData.gender];
    province = app.globalData.rawData.province;
    country = app.globalData.rawData.country;
    if (nickName == "") nickName = " ";
    if (gender == "") gender = " ";
    if (province == "") province = " ";
    if (country == "") country = " ";
    var socresTemp = wx.getStorageSync('scores')
    var scores = 0;
    if (socresTemp != 0) {
      scores = socresTemp;
    }
    this.setData({
      nickName: nickName,
      windowWidth: app.globalData.windowWidth,
      windowHeight: app.globalData.windowHeight,
      avatarUrl: app.globalData.rawData.avatarUrl,
      gender: gender,
      province: province,
      country: country,
      iconUrl: "../images/account/ic_chevron_right_black_48dp.png",
      scores: scores,
    });
    this.getLocationResur(1);
  },
  getMyInfo: function(){
    var that = this;
    var latitude = String(this.data.latitude);
    var longitude = String(this.data.longitude);

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
    this.setData({
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
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