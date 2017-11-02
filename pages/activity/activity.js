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


  fetchData: function () {
    var that = this;
    console.log("获取openid" + app.globalData.openid);
    this.setData({
      windowWidth: app.globalData.windowWidth,
      windowHeight: app.globalData.windowHeight
    });
    console.log('当前宽度' + this.data.windowWidth);
    console.log('当前高度' + this.data.windowHeight);

    wx.getLocation({
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        app.globalData.latitude = res.latitude;
        app.globalData.longitude = res.longitude;

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
                // logoPath: '../images/' + parseInt(3 * Math.random()) + '.jpg',
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
            console.log('发送位置失败');
          }
        });
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
    //获取历史数据
    var history = wx.getStorageSync('history');
    var that = this;
    
    if(history!=""){
      console.log("自身获得缓存");
      this.setData({
        checkins: history
      });
    }else{
      console.log("向lsh请求历史");
      wx.request({
        url: 'https://40525433.fudan-mini-program.com/cgi-bin/History',
        openid: app.globalData.openid,
        success: function(res){
          console.log("lsh返回的历史");
          console.log(res);
          that.setData({
            checkins: res.data.checkins
          });
          wx.setStorageSync('history', res.data.checkins);
        }
      })
    }



    //  按照日期对签到记录分类
    this.classifyByDate();

    //绘制竖线
    //this.drawLine();

    //获取当前数据
    this.fetchData();

  },

  classifyByDate: function () {
    var tempClassifyByDate = [];
    var that = this;
    var currentDate = '';
    var currentClass = {};


    //用字典的方法来统计签到的地点数和种类数
    var categoryDic = {};
    var placeDic = {};
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
      if (!categoryDic[that.data.checkins[i].category]) {
        console.log("LLL");
        checkInCategories += 1;
        categoryDic[that.data.checkins[i].category] = true;
      }

      if (!placeDic[that.data.checkins[i].POI_id]) {
        checkInPlaces += 1;
        placeDic[that.data.checkins[i].POI_id] = true;
      }


      currentClass['checkInList'].push(that.data.checkins[i]);
    }

    //最后一个也需要塞入进去
    tempClassifyByDate.push(currentClass);

    this.setData({
      classifiedCheckIns: tempClassifyByDate,
      checkInTimes: checkInTimes,
      checkInPlaces: checkInPlaces,
      checkInCategories: checkInCategories
    });

    console.log(this.data.classifiedCheckIns);

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