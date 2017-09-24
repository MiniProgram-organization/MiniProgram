// pages/activity/activity.js
var utils = require('../../utils/utils.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var app = getApp()
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: getApp().globalData.windowWidth,
    windowHeight: getApp().globalData.windowHeight,
    latitude: "",
    longitude: "",
    hidden: false,
    markers: [],
    include_points: [],
    checkins: [],  //原始的历史记录
    classifiedCheckIns: [] //分类之后的历史记录
  },



  /*查看签到的地方，目前作为保留接口*/
  redictDetail: function (e) {
    var target_id = e.currentTarget.id;
    var target_latitude, target_longitude, target_category, target_venue
    for (var index = 0; index < this.data.markers.length; index++) {
      if (this.data.markers[index].POI_id == target_id) {
        target_latitude = this.data.markers[index].latitude;
        target_longitude = this.data.markers[index].longitude;
        target_venue = this.data.markers[index].venue;
        target_category = this.data.markers[index].category;
        break;
      }
    }

    var url = '../map/map?target_id=' + target_id
      + '&target_latitude=' + target_latitude
      + '&target_longitude=' + target_longitude
      + '&target_category=' + target_category
      + '&target_venue=' + target_venue;

    wx.navigateTo({
      url: url
    })
  },

  redirectCheckIn: function () {
    var that = this;
    wx.redirectTo({
      url: '../checkin/checkin?markers='+JSON.stringify(that.data.markers),
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
        console.log(res);
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.setData({
          latitude: latitude,
          longitude: longitude,
        });

        qqmapsdk.reverseGeocoder({
          location:{
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
                iconPath: '../images/dot.jpg',
                logoPath: '../images/' + parseInt(3*Math.random()) + '.jpg',
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

  qqmapsdk = new QQMapWX({
    key: 'A5EBZ-DCPK4-IFSU7-XIQGW-NJKPJ-2NFLM'
  });


  //获取历史数据
  this.setData({
    checkins: wx.getStorageSync('history')
  });


  //  按照日期对签到记录分类
  this.classifyByDate();

  //绘制竖线
  this.drawLine();

  //获取当前数据
  this.fetchData();

},

classifyByDate: function(){
  var tempClassifyByDate = [];
  var that = this;
  var currentDate = '';
  var currentClass = {};
  
  for(var i = 0; i < that.data.checkins.length; i++){
    
    //出现新的日期，则增加新的一个date对象
    if (currentDate != that.data.checkins[i].date){

      //如果上一个对象不为空，则把上一个对象塞入数组中
      if (!currentClass){
        tempClassifyByDate.push(currentClass);
      }

      currentClass = {};
      currentClass.date = that.data.checkins[i].date;
      currentDate = that.data.checkins[i].date;

      currentClass['checkInList'] = [];
    }
    
    //将当前记录塞入
    currentClass['checkInList'].push(that.data.checkins[i]);
  }
  
  //最后一个也需要塞入进去
  tempClassifyByDate.push(currentClass);

  this.setData({
    classifiedCheckIns: tempClassifyByDate
  });

  console.log(this.data.classifiedCheckIns);
},

drawLine: function(){
  console.log(this.data.checkins);
  for (var i = 0; i < this.data.checkins.length; i++){
    var POI_id = this.data.checkins[i].POI_id;
    const ctx = wx.createCanvasContext(POI_id);
    ctx.moveTo(30, 10);
    ctx.setLineWidth(3);
    ctx.setStrokeStyle('yellow');
    ctx.lineTo(30, 100);
    ctx.stroke();
    ctx.draw();
  };
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