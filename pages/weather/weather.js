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
    con_day: 0,
    less_day: 7,
    object_day: 7,
    award_text_1: "",
    award_text_2: "",
    air:{},
    weatherCity:"",
    parent:"",
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    // 页面渲染完成s
  },
  onShow: function () {
    // 页面显示
    // 页面初始化 options为页面跳转所带来的参数
    var tmpWeatherCity = wx.getStorageSync('weatherCity');
   // console.log(tmpWeatherCity)
  //  console.log('??')
    this.setData({
      weatherCity: tmpWeatherCity[0],
      parent: tmpWeatherCity[1],
    })
   // console.log(this.data.weatherCity)
   // console.log(this.data.parent)
    wx.setStorageSync('weatherCity', "")
    this.loadInfo();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  toChooseArea: function(cnt){
    var that = this;
    wx.navigateTo({
      url: '../chooseArea/chooseArea'
    })
  },
  getLocationResur: function(cnt){
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        cnt = cnt + 1
        var openid = app.globalData.openid;
        var sessionid = app.globalData.sessionid
        //如果没有openId 需要加上一个判断
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.loadWeather(latitude, longitude, openid, sessionid);
      },
      fail: function (res) {
        cnt = cnt + 1
        if (cnt < 10){
          that.getLocationResur(cnt)
        }
        else{
          var latitude = wx.getStorageSync('latitude')
          var longitude = wx.getStorageSync('longitude')
          var openid = app.globalData.openid;
          var sessionid = app.globalData.sessionid
          if (latitude == ""){
            wx.showToast({
              title: '定位失败!请检查设置!',
              duration: 1000,
              icon: 'loading'
            })
          }
          else{
            wx.showToast({
              title: '定位失败!使用上次位置!',
              duration: 1000,
              icon: 'loading'
            })
            console.log(latitude)
            console.log(longitude+'....')
            that.loadWeather(latitude, longitude, openid,sessionid);
          }
        }
      }
    })
  },
  loadInfo: function () {
    var getSuccess = 0;
    var timer = 0
    var inChina = wx.getStorageSync('inChina');
    if (inChina == 0){
       wx.showToast({
         title: '抱歉，您目前不在卿云Go的服务区!',
         icon: 'loading'
       })
    }
    this.getLocationResur(1);
  },
  loadWeather: function (latitude, longitude, openid, sessionid) {

    var that = this;
    var data = {};
    if (this.data.weatherCity == ""){
      console.log('????')
      data = {
        openid: openid,
        sessionid: sessionid,
        latitude: latitude,
        longitude: longitude
      }
    }
    else{
      data = {
        openid: openid,
        sessionid: sessionid,
        latitude: latitude,
        longitude: longitude,
        location: this.data.weatherCity ,
        parent: this.data.parent
      }
      console.log(data)
    }
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/Weather',
      method: 'POST',
      data: data,
      success: function (res) {
        console.log(openid)
        console.log(res.data)
        if (res.data.status == "ERROR"){
          wx.showToast({
            title: '服务器功能未启用',
            icon: 'loading'
          })
          return;
        }

        var now = res.data.now;
        var air = res.data.air;
        console.log(air)
        var city = res.data.basic.location;
        var day1_weather = {};
        var day2_weather = {};
        var award = res.data.award.award;
        var scores = res.data.award.scores;
        var duration = res.data.award.duration;
        wx.setStorageSync('scores', scores);
        wx.setStorageSync('duration_weather', duration);
        if (award > 0){
          wx.showToast({
            title: '查看天气\n'+'+'+award+'分',
          })
        }
        day1_weather['category'] = res.data.forecast[1].cond_txt_n;
        day2_weather['category'] = res.data.forecast[2].cond_txt_n;
        day1_weather['high'] = res.data.forecast[1].tmp_max;
        day2_weather['high'] = res.data.forecast[2].tmp_max;
        day1_weather['low'] = res.data.forecast[1].tmp_min;
        day2_weather['low'] = res.data.forecast[2].tmp_min;

        if (res.data.air.aqi == "") {
          that.setData({
            city: city,
            air: {aqi:'暂无', qlty:'暂无'},
            weather: now,
            day1_weather: day1_weather,
            day2_weather: day2_weather,
            weathericonURL: "../images/weather/" + now.cond_code + ".png",
          })
        }
        else
        {
          that.setData({
            city: city,
            air: air,
            weather: now,
            day1_weather: day1_weather,
            day2_weather: day2_weather,
            weathericonURL: "../images/weather/" + now.cond_code + ".png",
          })
        }

        if ((duration % 7 == 0) && ((duration % 28) != 0)) {
          if ((duration / 7) % 4 == 1) {
            that.setData({
              con_day: duration,
              award_text_1: "连续查看天气",
              award_text_2: "天了，真棒！\n又获得额外积分奖励啦~"
            })
          }
          else if ((duration / 7) % 4 == 2) {
            that.setData({
              con_day: duration,
              award_text_1: "连续查看天气",
              award_text_2: "天了，exciting！\n又获得额外积分奖励啦~"
            })
          }
          else if ((duration / 7) % 4 == 3) {
            that.setData({
              con_day: duration,
              award_text_1: "连续查看天气",
              award_text_2: "天了，amazing！\n又获得额外积分奖励啦~"
            })
          }
        }
        else if (duration % 28 == 0) {
          that.setData({
            con_day: duration,
            award_text_1: "连续查看天气",
            award_text_2: "天了，天啦噜！一份超值额外积分大礼砸中了你~"
          })
        }
        else if (duration % 7 != 0) {
          var object_day = (parseInt(duration / 7) + 1) * 7;
          console.log(object_day)
          if (object_day % 28 == 0) {
            that.setData({
              con_day: duration,
              object_day: object_day,
              less_day: object_day - duration,
              award_text_1: "已连续查看天气",
              award_text_2: "天了！还差" + (object_day - duration) + "天就能获得连续28天超值额外积分奖励喔，加油~"
            })
          }
          else {
            that.setData({
              con_day: duration,
              object_day: object_day,
              less_day: object_day - duration,
              award_text_1: "已连续查看天气",
              award_text_2: "天了！还差" + (object_day - duration) + "天就能获得额外积分奖励喔，加油~"
            })
          }
        }
      },
      fail: function (res) {
        //console.log("发送天气信息失败" + res);
      }
    });
  }

})