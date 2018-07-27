// pages/account/account.js
var app = getApp();
var accountObj = {

  data: {
    avatarUrl: '',
    nickName: '',
    gender: '',
    province: '',
    city: '',
    qrcodeUrl: '',
    scores:0,
  },

  previewImg: function (e) {
    console.log("[Account] previewImg");
    
    wx.previewImage({
      urls: [this.data.avatarUrl],
    })
  },

  redirectToQRCode: function () {
    
    // 因为加载太慢了，很影响用户体验，所以略去
    //this.getQRCode();
  },

  getQRCode: function () {
    console.log("[Account] getQRCode");

    var that = this;
    wx.showLoading({
      title: '正在生成分享图片',
      mask:true,
    });
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
        that.setData({
          qrcodeUrl: e.data.url
        });
        wx.hideLoading();
        wx.navigateTo({
          url: '../qrcode/qrcode?qrcodeUrl='+that.data.qrcodeUrl,
        })
      }
    })
  },

  goToPrivacy: function () {
    console.log("[Account] goToPrivacy");

    var that = this;
    wx.navigateTo({
      url: '../privacy/privacy'
    })
  },

  goToAboutUs: function(){
    console.log("[Account] goToAboutUs");

    var that = this;
    wx.navigateTo({
      url: '../aboutus/aboutus'
    })
  },

  onShow: function () {
    console.log("[Account] onShow");

    var that = this;
    var nickName = "";
    var gender = "";
    var province = "";
    var country = "";
    var genderChoose = ['未知', '男', '女']

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
      avatarUrl: app.globalData.rawData.avatarUrl,
      gender: gender,
      province: province,
      country: country,
      scores: scores,
    });
  },

};

Page(accountObj);

export default accountObj;