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
  },

  redirectCheckIn: function () {
    var that = this;
    wx.navigateTo({
      url: '../checkin/checkin?markers='
    })
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

  fetchData: function (cnt) {
    var that = this;
    this.setData({
      windowWidth: app.globalData.windowWidth,
      windowHeight: app.globalData.windowHeight
    });

    wx.getLocation({
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        cnt = cnt + 1
        app.globalData.latitude = res.latitude;
        app.globalData.longitude = res.longitude; 
        //存储一个缓存的经纬度,用于定位失败时使用
        wx.setStorageSync('latitude', res.latitude);
        wx.setStorageSync('longitude', res.longitude);
        app.globalData.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
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
      },
      fail: function(){
        cnt = cnt + 1
        if (cnt < 10) that.fetchData(cnt)
        else {
          var latitude = wx.getStorageSync('latitude')
          var longitude = wx.getStorageSync('longitude')
          if (latitude == "") {
            wx.showToast({
              title: '请开启定位!',
              duration: 1000,
              icon: 'loading'
            })
          }
          else {
            wx.showToast({
              title: '使用上次位置!',
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
    this.getOpenId();
    console.log(this.data.checkins);
    
    console.log(this.data.classifiedCheckIns);
    

  },

  getOpenId: function(){
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;

        wx.getUserInfo({
          success: function (res) {
            
            getApp().globalData.rawData = JSON.parse(res.rawData);
            
            var iv = res.iv;
            
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
                if (res.data.status == "ERROR") {
                  console.log(res.data.message);
                  wx.navigateTo({
                    url: '/pages/error/error',
                  })
                  return;
                }

                
                getApp().globalData.openid = res.data.openid;
                
                that.getCheckIns();
              }
            })
          }
        });
      }
    });
  },

  getCheckIns: function(){
    //获取历史数据
    var checkins = wx.getStorageSync('checkins');
    var that = this;
    if (checkins != "") {
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
          openid: getApp().globalData.openid
        },
        method: 'POST',
        success: function (res) {
          console.log("lsh返回的历史");
          console.log(res);

          for (var i = 0; i < res.data.checkins.length; i++) {
            res.data.checkins[i].date = res.data.checkins[i]['datetime'].split(" ")[0];
            res.data.checkins[i].time = res.data.checkins[i]['datetime'].split(" ")[1];

            //需要自行设置logoPath
            var category = res.data.checkins[i].category;
            res.data.checkins[i].logoPath = '../images/location/' + app.globalData.locationMap[category.split(":")[0]] + '.png';
          }

          that.setData({
            checkins: res.data.checkins
          });
          wx.setStorageSync('checkins', res.data.checkins);



          that.classifyByDate();
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