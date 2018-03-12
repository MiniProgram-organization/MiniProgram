
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    location_url: '../images/weather/ic_place_white_18dp.png',
    set_url: '../images/weather/ic_view_headline_white_18dp.png',
    share_url: '../images/weather/ic_open_in_new_white_18dp.png',
    wind_url:'../images/weather/ic_settings_input_antenna_white_18dp.png',
    atmosphere_url:'../images/weather/ic_network_wifi_white_18dp.png',
    tem_url:'../images/weather/ic_brightness_4_white_18dp.png',
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
    forecast: {},
    background_color:'#DAA520',
    lifestyle_font_size:12,
    weather_detail_font_size:12,
    forecast_cat_text_font_size:15,
    forecast_other_text_font_size:13,
    air_text_font_size:12,
    now_cat_font_size:13,
    inChina:1,
    detail_1_name:'',
    detail_2_name:'',
    detail_3_name:'',
    detail_1_unit:'',
    detail_2_unit:'',
    detail_3_unit:'',
    lifestyle_height:0,
    lifestyle_text:'',
    qrcodeUrl:'',
    map_weather_to_pic: {
      "100": "100",
      "101": "101",
      "102": "101",
      "103": "103",
      "104": "104",
      "200": "200",
      "201": "201",
      "202": "200",
      "203": "200",
      "204": "200",
      "205": "205",
      "206": "205",
      "207": "205",
      "208": "205",
      "209": "209",
      "210": "209",
      "211": "209",
      "212": "209",
      "213": "209",
      "300": "300",
      "301": "301",
      "302": "302",
      "303": "303",
      "304": "304",
      "305": "305",
      "306": "306",
      "307": "307",
      "308": "307",
      "309": "309",
      "310": "307",
      "311": "311",
      "312": "312",
      "313": "313",
      "400": "400",
      "401": "401",
      "402": "402",
      "403": "401",
      "404": "404",
      "405": "405",
      "406": "406",
      "407": "407",
      "500": "500",
      "501": "501",
      "502": "502",
      "503": "503",
      "504": "504",
      "507": "507",
      "508": "508",
      "900": "900",
      "901": "901"
    },
    generatePicSuccess:false,
    downloadPicSuccess:false,
    canvasHidden:true
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
    this.shareDialog = this.selectComponent("#shareDialog");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.editTabBar(); 
    var inChina = wx.getStorageSync('inChina');
    this.setData({
      inChina:inChina
    })
   // app.editTabBar(); 
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
    console.log("send message generate program");
  },

  //分享弹窗下载事件
  _downloadEvent() {
    var that = this;
    wx.showLoading({
      title: '保存中',
      mask: true,
    });
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
  
      //生成图片保留本地
      wx.canvasToTempFilePath({
        canvasId: 'sharePicCanvas',
        success: function (res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (res) {
              console.log(res);
              wx.hideLoading();
              wx.showModal({
                title: '已成功保存到相册',
                content: '可以发到朋友圈或转发给朋友啦！',
                showCancel: false,
                confirmText: "好哒"
              });
            },
            fail: function (res) {
              wx.hideLoading();
              console.log(res)
              wx.showModal({
                title: '提示',
                content: '保存分享图片失败！',
              });
            }
          })
        },
        fail: function (res) {
          wx.hideLoading();
          console.log(res);
          wx.showModal({
            title: '提示',
            content: '保存分享图片失败！',
          })
        }
      });
    
  },


  _saveToAlbum() {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.qrcodeUrl,
      success: function (res) {
        wx.showModal({
          title: '已成功保存到相册',
          content: '可以发到朋友圈或转发给朋友啦！',
          showCancel: false,
          confirmText:"好哒"
        });
      },
      fail: function (res) {
        wx.openSetting({
          success: function (settingdata) {
            console.log(settingdata)
            if (settingdata.authSetting['scope.writePhotosAlbum']) {
              console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
            }
            else {
              console.log('获取权限失败，给出不给权限就无法正常使用的提示')
            }
          }
        });
      }
    });
  },
  //分享事件
  _shareEvent() {
    var that = this;
    this.onShareAppMessage();


  },
  //关闭对话框事件
  _cancelEvent(){
    this.setData({
      canvasHidden:true
    })
    this.shareDialog.hideDialog();

  },

  getQRCodeWeather: function(){
    this.setData({
      canvasHidden:false
    })
    var that = this;
    if(that.data.generatePicSuccess){
      that.shareDialog.showDialog(that.data.qrcodeUrl);
    }else{
      wx.showModal({
        title: '提示',
        content: '服务器繁忙，请稍后再试',
        showCancel: false
      });
      
    }
    
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
        if (that.data.weatherCity == "" && that.data.inChina == 0 )
          that.loadWeather_inForeign(latitude, longitude, openid, sessionid);
        else that.loadWeather_hefeng(latitude, longitude, openid, sessionid);
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
            if (that.data.weatherCity == "" && that.data.inChina == 0)
              that.loadWeather_inForeign(latitude, longitude, openid, sessionid);
            else that.loadWeather_hefeng(latitude, longitude, openid, sessionid);
          }
        }
      }
    })
  },
  /**
   * 这一步把信息传给服务器，让服务器生成图片，获取url
   * 将url对应的图片下载到本地，加快加载速度
   * 
   * 注意：这一步只有在loadWeather_inXXX成功回调之后才使用
   */
  generate_sharePic:function(e){
    var that = this;
    var data = {
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      openid: getApp().globalData.openid,
      sessionid: getApp().globalData.sessionid,
      in_china: this.data.inChina,
      weather: {
        city: this.data.city,
        today: this.data.weather,
        day0_weather: this.data.day0_weather,
        day1_weather: this.data.day1_weather,
        day2_weather: this.data.day2_weather
      }
    }
    console.log("[WEATHER]generate_sharePic:data sent to server");
    console.log(data);

    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/WeatherImg.py',
      method: 'POST',
      data: data,
      success: function (e) {
        if (e.data.status == "OK") {
          console.log(e.data)
          //得到了生成图片的网络地址，在页面数据中记录generatePicSuccess为true
          that.setData({
            qrcodeUrl: e.data.url,
            generatePicSuccess:true
          });
          //得到了生成的图片的网络地址，调用download接口把图片暂时存储到本地，仅此次启动可以使用
          wx.downloadFile({
            url: e.data.url,
            success: function (res) {
              console.log("[WEATHER]generate_sharePic:download weather share message");
              console.log(res);
              if(res.statusCode==200){
                //成功缓存了图片，使用本地缓存地址
                that.setData({
                  qrcodeUrl:res.tempFilePath,
                  downloadPicSuccess:true
                });
              }
              //如果没有成功缓存图片，则还是使用网络地址
              that._drawCanvas();
            },
            fail:function(){
              that._drawCanvas();
            }
          });
          

        }
        else {
          //如果没有成功生成图片，则在页面数据中记录这个结果(默认false不用修改)
        }
      },
      fail: function (e) {
        //如果没有成功生成图片，则在页面数据中记录这个结果（默认false不用修改）
      }
    });
    
  },

  _drawCanvas(){
    var that = this;
    var context = wx.createCanvasContext('sharePicCanvas');
    context.setFillStyle("#ffffff");
    context.fillRect(0, 0, 900, 1023);
    //画两张图，一张分享图，一张小程序码
    context.drawImage(that.data.qrcodeUrl, 30, 30, 840, 672);
    context.drawImage("../images/miniProgram.jpeg", 30, 750, 267, 237);
    //写一行字，“/* 卿云Go */”
    context.setFontSize(40);
    context.setFillStyle("#0b5782");
    context.fillText("/* 卿云Go */", 572, 880);
    context.stroke();
    context.draw();
  },

  loadWeather_inForeign: function (latitude, longitude, openid, sessionid){
    console.log('国外')
    var that = this;
    var data = {};
    if (this.data.weatherCity == "") {
      data = {
        openid: openid,
        sessionid: sessionid,
       // latitude: 35.710934,
       // longitude: 139.729699,
        latitude: latitude,
        longitude: longitude,
      }
    }
    else {
      data = {
        openid: openid,
        sessionid: sessionid,
        //latitude: 35.710934,
        //longitude: 139.729699,
        latitude: latitude,
        longitude: longitude,
        location: this.data.weatherCity,
        parent: this.data.parent
      }
    }
    
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/Weather_World',
      method: 'POST',
      data: data,
      success: function (res) {
        console.log(res.data)
        if (res.data.status != 'OK') {
          wx.showToast({
            title: '服务器功能未启用',
            icon: 'loading'
          })
          return;
        }
        var city = res.data.weatherWorld.channel.location.city;
        var now = {}
        var item = res.data.weatherWorld.channel.item;
        now['tmp'] = item.condition.temp;
        now['cond_txt'] = item.condition.text;
        now['cond_code'] = item.forecast[0].code;

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
        var mp = {}
        mp['Jan'] = "01"; mp['Feb'] = "02"; mp['Mar'] = "03"; mp['Apr'] = "04";
        mp['Jun'] = "06"; mp['Jul'] = "07"; mp['Aug'] = "08"; mp['Sept'] = "09";
        mp['Oct'] = "10"; mp['Nov'] = "11"; mp['Dec'] = "12";
        var day0 = item.forecast[0].date.split(" ")
        var day1 = item.forecast[1].date.split(" ")
        var day2 = item.forecast[2].date.split(" ")
        day0_weather['date'] = mp[day0[1]] + '-' + day0[0]
        day1_weather['date'] = mp[day1[1]] + '-' + day1[0]
        day2_weather['date'] = mp[day2[1]] + '-' + day2[0]

        day0_weather['category'] = item.forecast[0].text;
        day1_weather['category'] = item.forecast[1].text;
        day2_weather['category'] = item.forecast[2].text;
        day0_weather['high'] = item.forecast[0].high;
        day1_weather['high'] = item.forecast[1].high;
        day2_weather['high'] = item.forecast[2].high;
        day0_weather['low'] = item.forecast[0].low;
        day1_weather['low'] = item.forecast[1].low;
        day2_weather['low'] = item.forecast[2].low;
        day0_weather['icon'] = "../images/weather/" + item.forecast[0].code + ".png"
        day1_weather['icon'] = "../images/weather/" + item.forecast[1].code + ".png"
        day2_weather['icon'] = "../images/weather/" + item.forecast[2].code + ".png"

        var day2_xq = new Date(""+String.valueOf(day2[2] + "-" + day2[0] + "-" + mp[day2[1]])).getDay();
        if (day2_xq == 1) day2_weather['xq'] = '星期一'
        if (day2_xq == 2) day2_weather['xq'] = '星期二'
        if (day2_xq == 3) day2_weather['xq'] = '星期三'
        if (day2_xq == 4) day2_weather['xq'] = '星期四'
        if (day2_xq == 5) day2_weather['xq'] = '星期五'
        if (day2_xq == 6) day2_weather['xq'] = '星期六'
        if (day2_xq == 0) day2_weather['xq'] = '星期日'

        that.setData({
          city: city,
          air: { aqi: '暂无', qlty: '暂无' },
          weather: now,
          day0_weather: day0_weather,
          day1_weather: day1_weather,
          day2_weather: day2_weather,
          weathericonURL: "../images/weather/" + now.cond_code + ".png",
          detail_1_name:'空气湿度',
          detail_2_name:'风速 km/h',
          detail_3_name:'气压 mb',
          detail_1_unit: res.data.weatherWorld.channel.atmosphere.humidity+'%',
          detail_2_unit: res.data.weatherWorld.channel.wind.speed,
          detail_3_unit: parseInt(res.data.weatherWorld.channel.atmosphere.pressure),
          lifestyle_font_size:0,
        })
        console.log(that.data.weather)

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
        //得到具体数据成功，向服务器发送请求生成分享图片
        that.generate_sharePic();
      },
      fail: function(res){

      }
    })

  },
  loadWeather_hefeng: function (latitude, longitude, openid, sessionid) {

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
        location: this.data.weatherCity.replace(' ','%20'),
        parent: this.data.parent.replace(' ', '%20')
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
        var forecast = res.data.forecast;
        var city = res.data.basic.location.replace('%20',' ');
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
        day0_weather['icon'] = "../images/weather/" + that.data.map_weather_to_pic[res.data.forecast[0].cond_code_d] + ".png" 
        day1_weather['icon'] = "../images/weather/" + that.data.map_weather_to_pic[res.data.forecast[1].cond_code_d] + ".png" 
        day2_weather['icon'] = "../images/weather/" + that.data.map_weather_to_pic[res.data.forecast[2].cond_code_d] + ".png" 
        console.log(res.data.forecast)
        var day2_xq = new Date(res.data.forecast[2].date).getDay();
        
        console.log(day2_xq)
        if (day2_xq == 1) day2_weather['xq'] = '星期一'
        if (day2_xq == 2) day2_weather['xq'] = '星期二'
        if (day2_xq == 3) day2_weather['xq'] = '星期三'
        if (day2_xq == 4) day2_weather['xq'] = '星期四'
        if (day2_xq == 5) day2_weather['xq'] = '星期五'
        if (day2_xq == 6) day2_weather['xq'] = '星期六'
        if (day2_xq == 0) day2_weather['xq'] = '星期日'
        
        if (res.data.Lifestyle == "" || res.data.Lifestyle == true) {
          
          that.setData({
            lifestyle_height: 0,
            lifestyle_text:"",
          })
        }
        else {
          that.setData({
            lifestyle_height: that.data.windowHeight*0.05,
            lifestyle_text:res.data.Lifestyle.txt,
          })
        }
        console.log(that.data.lifestyle_height)

        if (res.data.air.qlty == "") {
          that.setData({
            city: city,
            air: { aqi: '暂无', qlty: '暂无' },
            weather: now,
            forecast: forecast,
            day0_weather: day0_weather,
            day1_weather: day1_weather,
            day2_weather: day2_weather,
            detail_1_name: '体感温度',
            detail_2_name: now.wind_dir,
            detail_3_name: '气压',
            detail_1_unit: now.fl +'℃',
            detail_2_unit: '级别:'+now.wind_sc,
            detail_3_unit: now.pres+' hPa',
            weathericonURL: "../images/weather/" + that.data.map_weather_to_pic[now.cond_code] + ".png",
          })
        }
        else {
          that.setData({
            city: city,
            air: air,
            weather: now,
            forecast: forecast,
            day0_weather: day0_weather,
            day1_weather: day1_weather,
            day2_weather: day2_weather,
            detail_1_name: '体感温度',
            detail_2_name: now.wind_dir ,
            detail_3_name: '气压',
            detail_1_unit: now.fl + '℃',
            detail_2_unit: '级别:' + now.wind_sc,
            detail_3_unit: now.pres + ' hPa',
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
        //得到具体数据成功，向服务器发送请求生成分享图片
        that.generate_sharePic();
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
    var that = this;
    return {
      title: '卿云Go 伴你走过一年四季~',
      path: '/pages/weather/weather',
      imageUrl:that.data.qrcodeUrl,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})