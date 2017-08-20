// pages/activity/activity.js
var utils = require('../../utils/utils.js')
var app = getApp()


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
  },

  redictDetail: function (e) {
    var target_id = e.currentTarget.id;
    var target_latitude, target_longitude, target_category, target_venue
    for (var index = 0; index < this.data.markers.length; index++){
      if(this.data.markers[index].POI_id == target_id){
        target_latitude = this.data.markers[index].latitude;
        target_longitude = this.data.markers[index].longitude;
        target_venue = this.data.markers[index].venue;
        target_category = this.data.markers[index].category;
        break;
      }
    }

    var url = '../map/map?target_id='+target_id
              +'&target_latitude='+target_latitude
              +'&target_longitude='+target_longitude
              +'&target_category='+target_category
              +'&target_venue='+target_venue;

    wx.navigateTo({
      url: url
    })
  },

  checkIn: function (e) {
    var that = this;
    var target_id = parseInt(e.currentTarget.id); 
    console.log("target_id" + target_id);
    var target_latitude, target_longitude, target_category, target_venue;
    for (var index = 0; index < this.data.markers.length; index++) {
      if (this.data.markers[index].POI_id == target_id) {
        target_latitude = this.data.markers[index].latitude;
        target_longitude = this.data.markers[index].longitude;
        target_venue = this.data.markers[index].venue;
        target_category = this.data.markers[index].category;
        break;
      }
    }
    console.log(target_latitude, target_longitude, target_id);
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/CheckIn',
      method: 'POST',
      data: {
        created_by_user: false,
        openid: getApp().globalData.openid,
        latitude: target_latitude,
        longitude: target_longitude,
        POI_id: target_id
      },
      success: function (e) {
        if (e.data.status == "OK") {
          wx.showToast({
            title: target_venue + " checked",
            icon: 'loading',
            duration: 500
          });
        }
      },
      fail: function (e) {
        console.log("签到失败");
        console.log(e);
      }

    });
  },



  fetchData: function(){
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

        wx.request({
          url: 'https://40525433.fudan-mini-program.com/cgi-bin/Search',
          method: 'POST',
          data: {
            latitude: latitude,
            longitude: longitude,
            openid: getApp().globalData.openid
          },
          success: function (res) {
            console.log("hhh"); //DELETE
            var coordinates = res.data.coordinates;  //经纬度坐标数组
            if (coordinates) {
              console.log("位置坐标为:" + coordinates);

              /*tempMarkers作为数据中转*/


              //marker数组
              var tempMarkers = [];
              var tempIncludePoints = [];

              for (var i = 0; i < coordinates.length; i++) {
                var tempLatitude = coordinates[i].latitude;
                var tempLongitude = coordinates[i].longitude;
                var category = coordinates[i].category;
                var venue = coordinates[i].venue;
                var POI_id = coordinates[i].POI_id;

                tempMarkers.push({
                  POI_id: POI_id,
                  latitude: tempLatitude,
                  longitude: tempLongitude,
                  iconPath: '../images/' + category + '.jpg',
                  category: category,
                  venue: venue,
                  checkButton: '../images/checkButton.jpg'
                });
                tempIncludePoints.push({
                  latitude: tempLatitude,
                  longitude: tempLongitude, 
                });
              }
              console.log(tempMarkers);

              that.setData({
                markers:tempMarkers,
                include_points:tempIncludePoints
              });
            } else {
              console.log("未收到青鸟林的附近位置坐标");
            }
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
    this.setData({
      hidden: false
    })
    this.fetchData();
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