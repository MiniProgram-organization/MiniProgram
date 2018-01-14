// pages/weather_new/weather_new.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    location_url: '../images/weather_new/ic_place_white_18dp.png',
    set_url: '../images/weather_new/ic_view_headline_white_18dp.png',
    share_url: '../images/weather_new/ic_open_in_new_white_18dp.png',
    wind_url:'../images/weather_new/ic_settings_input_antenna_white_18dp.png',
    atmosphere_url:'../images/weather_new/ic_network_wifi_white_18dp.png',
    tem_url:'../images/weather_new/ic_brightness_4_white_18dp.png',
    day0_weather: {}, //今日天气
    day1_weather: {}, //今日天气
    day2_weather: {}, //明日天气
    con_day: 0,
    less_day: 7,
    object_day: 7,
    award_text_1: "",
    award_text_2: "",
    air: {},
    weatherCity: "",
    parent: "",
    latitude: 0,
    longitude: 0,
    background_color:'#EE6A50',
    lifestyle_font_size:12,
    weather_detail_font_size:12,
    forecast_cat_text_font_size:15,
    forecast_other_text_font_size:13,
    air_text_font_size:12,
    now_cat_font_size:13,
    inChina:1
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
    var inChina = wx.getStorageSync('inChina');
    this.setData({
      inChina:inChina
    })
    app.editTabBar(); 
    // 页面显示
    // 页面初始化 options为页面跳转所带来的参数
    var tmpWeatherCity = wx.getStorageSync('weatherCity');

    if (tmpWeatherCity == ""){
      console.log('空')
      this.setData({
        weatherCity: "",
        parent: "",
      })
    }
    else{
      this.setData({
        weatherCity: tmpWeatherCity[0],
        parent: tmpWeatherCity[1],
      })
    }
    this.setData({
      lifestyle_font_size:((app.globalData.windowWidth % 32 == 0) ?
        (app.globalData.windowWidth / 32) :
        (parseInt(app.globalData.windowWidth / 32) + 1)),
      weather_detail_font_size: ((app.globalData.windowWidth % 27 == 0) ?
        (app.globalData.windowWidth / 27) :
        (parseInt(app.globalData.windowWidth / 27) + 1)),
      forecast_other_text_font_size: parseInt(app.globalData.windowWidth/24),
      forecast_cat_text_font_size: parseInt(app.globalData.windowWidth / 21),
      air_text_font_size: parseInt(app.globalData.windowWidth / 27),
      now_cat_font_size: parseInt(app.globalData.windowWidth / 24),

    })
    wx.setStorageSync('weatherCity', ["",""])
    this.loadInfo();

  },
  toChooseArea: function (cnt) {
    var that = this;
    wx.navigateTo({
      url: '../chooseArea/chooseArea'
    })
  },
  loadInfo: function () {
    var getSuccess = 0;
    var timer = 0;
    this.getLocationResur(1);
  },
  getLocationResur: function (cnt) {
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
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
        if(that.data.inChina == 1) that.loadWeather_inChina(latitude, longitude, openid, sessionid);
        else that.loadWeather_inForeign(latitude, longitude, openid, sessionid);
      },
      fail: function (res) {
        cnt = cnt + 1
        if (cnt < 10) {
          that.getLocationResur(cnt)
        }
        else {
          var latitude = wx.getStorageSync('latitude')
          var longitude = wx.getStorageSync('longitude')
          var openid = app.globalData.openid;
          var sessionid = app.globalData.sessionid
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
            console.log(latitude)
            console.log(longitude + '....')
            if (that.data.inChina == 1) that.loadWeather_inChina(latitude, longitude, openid, sessionid);
            else that.loadWeather_inForeign(latitude, longitude, openid, sessionid);
          }
        }
      }
    })
  },
  loadWeather_inForeign: function (latitude, longitude, openid, sessionid){
    var that = this;
    var data = {};
    if (this.data.weatherCity == "") {
      data = {
        openid: openid,
        sessionid: sessionid,
        latitude: latitude,
        longitude: longitude
      }
    }
    else {
      data = {
        openid: openid,
        sessionid: sessionid,
        latitude: latitude,
        longitude: longitude,
        location: this.data.weatherCity,
        parent: this.data.parent
      }
    }
    /*
    wx.request({
      url: ,
    })*/

  },
  loadWeather_inChina: function (latitude, longitude, openid, sessionid) {

    var that = this;
    var data = {};
    if (this.data.weatherCity == "") {
      data = {
        openid: openid,
        sessionid: sessionid,
        latitude: latitude,
        longitude: longitude
      }
    }
    else {
      data = {
        openid: openid,
        sessionid: sessionid,
        latitude: latitude,
        longitude: longitude,
        location: this.data.weatherCity,
        parent: this.data.parent
      }
    }
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/Weather',
      method: 'POST',
      data: data,
      success: function (res) {
        console.log(openid)
        console.log(res.data)
        if (res.data.status == "ERROR") {
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
        var day0_weather = {};
        var award = res.data.award.award;
        var scores = res.data.award.scores;
        var duration = res.data.award.duration;
        wx.setStorageSync('scores', scores);
        wx.setStorageSync('duration_weather', duration);
        if (award > 0) {
          wx.showToast({
            title: '查看天气\n' + '+' + award + '分',
          })
        }
        day0_weather['date'] = res.data.forecast[0].date.substring(5, 10); 
        day1_weather['date'] = res.data.forecast[1].date.substring(5,10); 
        day2_weather['date'] = res.data.forecast[2].date.substring(5, 10); 
        day0_weather['category'] = res.data.forecast[0].cond_txt_d;
        day1_weather['category'] = res.data.forecast[1].cond_txt_d;
        day2_weather['category'] = res.data.forecast[2].cond_txt_d;
        day0_weather['high'] = res.data.forecast[0].tmp_max;
        day1_weather['high'] = res.data.forecast[1].tmp_max;
        day2_weather['high'] = res.data.forecast[2].tmp_max;
        day0_weather['low'] = res.data.forecast[0].tmp_min;
        day1_weather['low'] = res.data.forecast[1].tmp_min;
        day2_weather['low'] = res.data.forecast[2].tmp_min;
        day0_weather['icon'] = "../images/weather/" + res.data.forecast[0].cond_code_d + ".png" 
        day1_weather['icon'] = "../images/weather/" + res.data.forecast[1].cond_code_d + ".png" 
        day2_weather['icon'] = "../images/weather/" + res.data.forecast[2].cond_code_d + ".png" 

        var day2_xq = new Date(res.data.forecast[2].date).getDay();
        if (day2_xq = 1) day2_weather['xq'] = '星期一'
        if (day2_xq = 2) day2_weather['xq'] = '星期二'
        if (day2_xq = 3) day2_weather['xq'] = '星期三'
        if (day2_xq = 4) day2_weather['xq'] = '星期四'
        if (day2_xq = 5) day2_weather['xq'] = '星期五'
        if (day2_xq = 6) day2_weather['xq'] = '星期六'
        if (day2_xq = 0) day2_weather['xq'] = '星期日'

        if (res.data.air.qlty == "") {
          that.setData({
            city: city,
            air: { aqi: '暂无', qlty: '暂无' },
            weather: now,
            day0_weather: day0_weather,
            day1_weather: day1_weather,
            day2_weather: day2_weather,
            weathericonURL: "../images/weather/" + now.cond_code + ".png",
          })
        }
        else {
          that.setData({
            city: city,
            air: air,
            weather: now,
            day0_weather: day0_weather,
            day1_weather: day1_weather,
            day2_weather: day2_weather,
            weathericonURL: "../images/weather/" + now.cond_code + ".png",
          })
          
          if (res.data.air.qlty == '中度污染' || res.data.air.qlty == '重度污染'
            || res.data.air.qlty == '严重污染'){
              that.setData({
                background_color: '#EE6A50'
              })
            }
          else if (res.data.air.qlty == '良' || res.data.air.qlty == '轻度污染'){
            that.setData({
              background_color: '#DAA520'
            })
          }
          else{
            that.setData({
              background_color: '#43CD80'
            })
          }
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