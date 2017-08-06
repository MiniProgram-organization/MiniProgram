var app = getApp()
Page({
  data: {
    // text:"这是一个页面"
    city: '',
    weather: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.loadInfo();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.loadInfo();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  loadInfo: function () {
    var self = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res);

        var openid = app.globalData.openid;
        console.log("获取openid! " + openid);
        var latitude = res.latitude;
        var longitude = res.longitude;
        self.loadWeather(latitude, longitude, openid);
      }
    })
  },
  loadWeather: function (latitude, longitude, openid) {
    var page = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/Weather',
      method: 'POST',
      data: {
        openid:openid,
        latitude:latitude,
        longitude:longitude
      },
      // header: {
      //   // "Content-Type":"application/json"
      // },
      success: function (res) {
        console.log("status: " + res.data.status);
        console.log("res.data:  " + res.data);
        console.log("city:  " + res.data.city);
        var now = res.data.now;
        var city = res.data.city;
        page.setData({
          city: city,
          weather: now
        })
      },
      fail: function (res) {
        console.log("发送天气信息失败" + res);
      }
    });
  }

})