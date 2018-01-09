// pages/activity/activity.js
var utils = require('../../utils/utils.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    latitude: "",
    longitude: "",
    hidden: false,
    markers: [],
    include_points: [],
    checkins: [],  //原始的历史记录
    classifiedCheckIns: [], //分类之后的历史记录
    checkInTimes: 0,
    checkInPlaces: 0,
    checkInCategories: 0,
    con_day:0,
    less_day:7,
    object_day:7,
    award_text_1:"",
    award_text_2:"",
  },
  redirectCheckIn: function () {
    
    var that = this;
    wx.navigateTo({
      url: '../checkin/checkin?markers='
    })
  },
  setDuration: function (duration){
    console.log('duration')
    console.log(duration)
    if(duration == 0){
      this.setData({
        con_day: duration,
        object_day: object_day,
        less_day: object_day - duration,
        award_text_1: "已连续签到",
        award_text_2: "天了！还差" + 7 + "天就能获得额外积分奖励喔，加油~"
      })
    }
    else{
      if ((duration % 7 == 0) && ((duration % 28) != 0)) {
        if ((duration / 7) % 4 == 1) {
          this.setData({
            con_day: duration,
            award_text_1: "连续签到",
            award_text_2: "天了，真棒！\n又获得额外积分奖励啦~"
          })
        }
        else if ((duration / 7) % 4 == 2) {
          this.setData({
            con_day: duration,
            award_text_1: "连续签到",
            award_text_2: "天了，exciting！\n又获得额外积分奖励啦~"
          })
        }
        else if ((duration / 7) % 4 == 3) {
          this.setData({
            con_day: duration,
            award_text_1: "连续签到",
            award_text_2: "天了，amazing！\n又获得额外积分奖励啦~"
          })
        }
      }
      else if (duration % 28 == 0) {
        this.setData({
          con_day: duration,
          award_text_1: "连续签到",
          award_text_2: "天了，天啦噜！一份超值额外积分大礼砸中了你~"
        })
      }
      else if (duration % 7 != 0) {
        var object_day = (parseInt(duration / 7) + 1) * 7;
        console.log(object_day)
        if (object_day % 28 == 0) {
          this.setData({
            con_day: duration,
            object_day: object_day,
            less_day: object_day - duration,
            award_text_1: "已连续签到",
            award_text_2: "天了！还差" + (object_day - duration) + "天就能获得连续28天超值额外积分奖励喔，加油~"
          })
        }
        else {
          this.setData({
            con_day: duration,
            object_day: object_day,
            less_day: object_day - duration,
            award_text_1: "已连续签到",
            award_text_2: "天了！还差" + (object_day - duration) + "天就能获得额外积分奖励喔，加油~"
          })
        }
      }
    }
  },
  Todistrictsta: function () {
    var that = this;
    wx.navigateTo({
      url: '../districtsta/districtsta'
    })
  },
  Tocategorysta: function () {
    var that = this;
    wx.navigateTo({
      url: '../categorysta/categorysta'
    })
  },
  Toplacesta: function () {
    var that = this;
    wx.navigateTo({
      url: '../placesta/placesta'
    })
  },
  fetchData: function (cnt) {
    var that = this;
    this.setData({
      windowWidth: app.globalData.windowWidth,
      windowHeight: app.globalData.windowHeight
    });

    var oldDatetmp = wx.getStorageSync('timestamp_duration');
    var oldDate = 0;
    var nowDate = (Date.parse(new Date()) / 1000);
    if (oldDatetmp == "") oldDate = 0;
    else oldDate = oldDatetmp;

    console.log(nowDate)
    console.log(oldDate)
    var duration = wx.getStorageSync('duration_checkin');
    console.log(duration.data)
    console.log(nowDate-oldDate)
    console.log(duration == "")
    if (duration != "" && ((nowDate - oldDate) < 86400)){
      console.log('用缓存')
      this.setDuration(duration.data)
    }
    else{
      //如果没有缓存
      wx.request({
        url: 'https://40525433.fudan-mini-program.com/cgi-bin/Scores',
        method: 'POST',
        data: {
          openid: getApp().globalData.openid,
          sessionid: getApp().globalData.sessionid,
        },
        success: function (res) {
          console.log(res)
          if(res.data.status == "ERROR"){
            wx.showToast({
              title: '获取连续天数失败！',
              icon:'loading'
            })
          }
          else{
            wx.setStorageSync('timestamp_duration', (Date.parse(new Date()) / 1000));
            wx.setStorageSync('duration_checkin', 
            {
              data:res.data.duration_checkin
            });
            wx.setStorageSync('duration_weather', res.data.duration_weather);
            wx.setStorageSync('duration_mood', res.data.duration_mood);
            wx.setStorageSync('scores', res.data.scores);
            that.setDuration(res.data.duration_checkin)
          }
        },
        fail: function(res){

        }
      })
    }

    
    wx.getLocation({
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        cnt = cnt + 1
        app.globalData.latitude = res.latitude;
        app.globalData.longitude = res.longitude; 
        //存储一个缓存的经纬度,用于定位失败时使用
        wx.setStorageSync('latitude', res.latitude);
        wx.setStorageSync('longitude', res.longitude);

        wx.request({
          url: 'https://40525433.fudan-mini-program.com/cgi-bin/GetNation',
          method:'POST',
          data: {

            latitude: res.latitude,
            longitude: res.longitude,
            openid: getApp().globalData.openid,
            sessionid: getApp().globalData.sessionid,
            
          },
          success: function (res) {
            console.log('nation...')
            console.log(res)
            if (res.data.status == 'OK'){
              if (res.data.nation == '中国'){
                wx.setStorageSync('inChina', 1)
              }
              else{
                wx.showToast({
                  title: '抱歉，卿云Go签到功能对国外用户暂未开放!',
                  icon: 'loading'
                })
                wx.setStorageSync('inChina', 0)
              }
            }
            else{
              wx.showToast({
                title: '获取经纬度国家信息失败！请检查定位设置',
              })
            }
          },
          fail: function(res){
            wx.showToast({
              title: '获取经纬度国家信息失败！请检查定位设置',
            })
          }

        })
        app.globalData.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
          },
          get_poi: 1,
          success: function (res) {
            if(res.result.pois == undefined){
              /*
              wx.showToast({
                title: '抱歉，您目前不在卿云Go的服务区!',
                icon:'loading'
              })
              wx.setStorageSync('inChina', 0)*/
              return;
            }
            //wx.setStorageSync('inChina', 1)
            var coordinates = res.result.pois;
            //marker数组
            var tempMarkers = [];
            var tempIncludePoints = [];

            for (var i = 0; i < coordinates.length; i++) {
              var tempLatitude = coordinates[i].location.lat;
              var tempLongitude = coordinates[i].location.lng;
              var category = coordinates[i].category
              var venue = coordinates[i].title;
              var POI_id = coordinates[i].id;
              tempMarkers.push({
                POI_id: POI_id,
                latitude: tempLatitude,
                longitude: tempLongitude,
                iconPath: '../images/map/dot.jpg',
                category: category,
                venue: venue

              });
              tempIncludePoints.push({
                latitude: tempLatitude,
                longitude: tempLongitude,
              });
            }
            console.log(tempMarkers);
            that.setData({
              markers: tempMarkers,
              include_points: tempIncludePoints
            });

          },
          fail: function () {
            
          }
        });
      },
      fail: function(){
        cnt = cnt + 1
        if (cnt < 10) that.fetchData(cnt)
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
            //使用缓存定位
            app.globalData.latitude = latitude;
            app.globalData.longitude = longitude;
            app.globalData.qqmapsdk.reverseGeocoder({
              location: {
                latitude: latitude,
                longitude: longitude
              },
              get_poi: 1,
              success: function (res) {
                console.log("附近POI");
                console.log(res.result.pois);
                var coordinates = res.result.pois;
                //marker数组
                var tempMarkers = [];
                var tempIncludePoints = [];

                for (var i = 0; i < coordinates.length; i++) {
                  var tempLatitude = coordinates[i].location.lat;
                  var tempLongitude = coordinates[i].location.lng;
                  var category = coordinates[i].category
                  var venue = coordinates[i].title;
                  var POI_id = coordinates[i].id;

                  tempMarkers.push({
                    POI_id: POI_id,
                    latitude: tempLatitude,
                    longitude: tempLongitude,
                    iconPath: '../images/map/dot.jpg',
                    category: category,
                    venue: venue
                  });
                  tempIncludePoints.push({
                    latitude: tempLatitude,
                    longitude: tempLongitude,
                  });
                }
                console.log(tempMarkers);
                that.setData({
                  markers: tempMarkers,
                  include_points: tempIncludePoints
                });

              },
              fail: function () {

              }
            });


          }
        }
      }
    });
    setTimeout(function () {
      that.setData({
        hidden: true
      })
    }, 300)
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  getOpenId: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.getUserInfo({
          lang: 'zh_CN',
          success: function (res) {
            getApp().globalData.rawData = JSON.parse(res.rawData);
            var iv = res.iv;
            console.log(res)
            wx.request({
              url: 'https://40525433.fudan-mini-program.com/cgi-bin/Login',
              method: 'POST',
              data: {
                code: code,
                rawData: getApp().globalData.rawData,
                latitude: getApp().globalData.latitude,
                longitude: getApp().globalData.longitude,
              },
              success: function (res) {
                console.log(res)
                if (res.data.status == "ERROR") {
                  console.log(res.data.message);
                  wx.redirectTo({
                    url: '/pages/error/error',
                  })
                  return;
                }
                getApp().globalData.openid = res.data.openid;
                getApp().globalData.sessionid = res.data.sessionid;
                that.getCheckIns();
              }
            })
          }
        });
      }
    });
  },
  // drawLine: function () {
  //   console.log(this.data.checkins);
    
  //   for (var i = 0; i < this.data.checkins.length; i++) {
  //     var POI_id = this.data.checkins[i].POI_id;
  //     const ctx = wx.createCanvasContext(POI_id);
  //     ctx.moveTo(30, 20);
  //     ctx.setLineWidth(8);
  //     ctx.setStrokeStyle('yellow');
  //     ctx.lineTo(30, 100);
  //     ctx.stroke();
  //     ctx.draw();
  //     console.log("ok!!");
  //   };
  // },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    var ver_stor = wx.getStorageSync('first_tabbar')
    console.log('first_tabbar')
    console.log(ver_stor)
    if (ver_stor != 'yes'){
      app.editTabBar(); 
      wx.setStorageSync('first_tabbar', 'yes')
      wx.redirectTo({
        url: '../activity/activity',
        success: function(){
          console.log('跳转成功')
        },
        fail:function(e){
          console.log('跳转失败')
          console.log(e)
        }
      })
    }
    else{
    app.editTabBar(); 
    if (app.globalData.openid == "") {
      this.getOpenId();
    }
    else {
      this.getCheckIns();
    }
    console.log('activity........!!!!!!!!!!!!!')
    console.log(this.data.checkins);
    console.log(this.data.classifiedCheckIns); 
    }
  },
 getPlaces: function(){
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/FrequentPOIs',
      method: 'POST',
      data: {
        openid: getApp().globalData.openid,
        place_num: 5,
        sessionid: getApp().globalData.sessionid,
      },
      success: function(res){
        if(res.data.status == "OK"){
          getApp().globalData.placeList = res.data.places
        }
      }
    })
 },


  getCheckIns: function(){
    //获取历史数据
    var checkins = wx.getStorageSync('checkins');
    var oldDatetmp = wx.getStorageSync('timestamp_checkins');
    var oldDate = 0;
    var nowDate = (Date.parse(new Date())/1000);
    if (oldDatetmp == "") oldDate = 0; 
    else oldDate = oldDatetmp;
    
    var that = this; 
    if (checkins != "" && ((nowDate - oldDate) < 86400) ){
      console.log('时间差')
      console.log(nowDate - oldDate)
      console.log('...签到缓存')
      console.log(checkins)
      this.setData({
        checkins: checkins
      });
      that.classifyByDate();
    } else {
      console.log("向lsh请求历史");
      console.log(getApp().globalData.openid);
      wx.request({
        url: 'https://40525433.fudan-mini-program.com/cgi-bin/History',
        data: {
          openid: getApp().globalData.openid,
          sessionid: getApp().globalData.sessionid,
        },
        method: 'POST',
        success: function (res) {
          if(res.data.status == "ERROR"){
            wx.showToast({
              title: '获取历史签到失败',
              icon:'loading'
            })
          }
          else{
            console.log("lsh返回的历史");
            console.log(res);
            wx.setStorageSync('timestamp_checkins', (Date.parse(new Date()) / 1000));
            for (var i = 0; i < res.data.checkins.length; i++) {
              res.data.checkins[i].date = res.data.checkins[i]['datetime'].split(" ")[0];
              res.data.checkins[i].time = res.data.checkins[i]['datetime'].split(" ")[1];
              //需要自行设置logoPath
              var category = res.data.checkins[i].category;
              res.data.checkins[i].logoPath = '../images/location/' + app.globalData.locationMap[category.split(":")[0]] + '.png';
              if(res.data.checkins[i].text != ""){
                res.data.checkins[i]['height_p'] = 80;
              }
              else res.data.checkins[i]['height_p'] = 65;
            }

            that.setData({
              checkins: res.data.checkins
            });
            console.log(that.data.checkins)
            wx.setStorageSync('checkins', res.data.checkins);
            that.classifyByDate();
          }
        }
      })
      
    }
  },

  classifyByDate: function () {
    var tempClassifyByDate = [];
    var that = this;
    var currentDate = '';
    var currentClass = {};


    //用字典的方法来统计签到的地点数和种类数
    var categoryDic = {};
    var placeDic = {};
    var districtDic ={};
    var checkInTimes = 0;
    var checkInCategories = 0;
    var checkInPlaces = 0;

    for (var i = 0; i < that.data.checkins.length; i++) {

      //出现新的日期，则增加新的一个date对象
      if (currentDate != that.data.checkins[i].date) {

        //如果上一个对象不为空(排除第一个的情况)，则把上一个对象塞入数组中
        if (currentClass.date) {
          tempClassifyByDate.push(currentClass);
        }
        currentClass = {};
        currentClass.date = that.data.checkins[i].date;
        currentDate = that.data.checkins[i].date;

        currentClass['checkInList'] = [];
      }

      //统计签到地点数，种类数，并将当前签到记录塞入
      checkInTimes += 1;
      if (!categoryDic[that.data.checkins[i].category.split(":")[0]]) {
        console.log("LLL");
        checkInCategories += 1;
        categoryDic[that.data.checkins[i].category.split(":")[0]] = 1;
      }else{
        categoryDic[that.data.checkins[i].category.split(":")[0]] += 1;
      }

      if(!that.data.checkins[i].district||that.data.checkins[i].district == ""){
        that.data.checkins[i].district = "未知";
      }
      if (!districtDic[that.data.checkins[i].district]){
        districtDic[that.data.checkins[i].district] = 1;
      }else{
        districtDic[that.data.checkins[i].district] += 1;
      }

      if (!placeDic[that.data.checkins[i].POI_id]) {
        checkInPlaces += 1;
        placeDic[that.data.checkins[i].POI_id] = true;
      }
      currentClass['checkInList'].push(that.data.checkins[i]);
    }

    getApp().globalData.categoryDic = categoryDic;
    getApp().globalData.placeDic = placeDic;
    getApp().globalData.districtDic = districtDic;

    //最后一个也需要塞入进去
    tempClassifyByDate.push(currentClass);

    this.setData({
      classifiedCheckIns: tempClassifyByDate,
      checkInTimes: checkInTimes,
      checkInPlaces: checkInPlaces,
      checkInCategories: checkInCategories
    });

    this.fetchData(1);

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