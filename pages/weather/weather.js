var app = getApp();
Page({
  data: {
    // text:"这是一个页面"
    city: '',
    weather: {},
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    day1_weather: {},
    day2_weather: {},
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
    this.getForcastWeather();
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
      
      success: function (res) {
        console.log("status: " + res.data.status);
        console.log("res.data:  " + res.data);
        console.log("city:  " + res.data.city);
        console.log("wether:  " + res.data.now);
        var now = res.data.now;
        var city = res.data.city;
        var day1_weather = {};
        var day2_weather = {};

        day1_weather['category'] = res.data.forecast[1].cond_txt_n;
        day2_weather['category'] = res.data.forecast[2].cond_txt_n;
        day1_weather['high'] = res.data.forecast[1].tmp_max;
        day2_weather['high'] = res.data.forecast[2].tmp_max;
        day1_weather['low'] = res.data.forecast[1].tmp_min;
        day2_weather['low'] = res.data.forecast[2].tmp_min;

        page.setData({
          city: city,
          weather: now,
          day1_weather: day1_weather,
          day2_weather:day2_weather,
          weathericonURL: "../images/weather/" + now.cond_code+".png",
        })
      },
      fail: function (res) {
        console.log("发送天气信息失败" + res);
      }
    });
  }

})