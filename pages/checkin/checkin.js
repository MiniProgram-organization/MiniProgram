// checkin.js
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
    markers: [],
    searchPOIVal: "",
    inputShowed: false
  },

  onShareAppMessage: function (res) {
    var that = this;
    console.log(res);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      desc: '分享内容',
      // path: '/pages/checkin/checkin?markers=' + JSON.stringify(that.data.markers),
      path: '/pages/activity/activity',
      success: function (res) {
        console.log(res);
        // 转发成功
      },
      fail: function (res) {
        console.log(res);
        // 转发失败
      }
    }
  },

  redirectToActivity: function(){
    console.log("redirect to activity");
    wx.switchTab({
      url: '../activity/activity',
      success:function(res){
        console.log(res);
      },
      fail: function(res){
        console.log(res);
      }
    })
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      searchPOIVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      searchPOIVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      searchPOIVal: e.detail.value
    });

    this.searchPOI();
  },

  /*进入地图的细节，目前作为保留接口*/
  redictDetail: function (e) {
    var target_id = e.currentTarget.id;
    var target_latitude, target_longitude, target_category, target_venue, target_logoPath;
    for (var index = 0; index < this.data.markers.length; index++) {
      if (this.data.markers[index].POI_id == target_id) {
        target_latitude = this.data.markers[index].latitude;
        target_longitude = this.data.markers[index].longitude;
        target_venue = this.data.markers[index].venue;
        target_category = this.data.markers[index].category;
        target_logoPath = this.data.markers[index].logoPath;
        break;
      }
    }

    var url = '../map/map?target_id=' + target_id
      + '&target_latitude=' + target_latitude
      + '&target_longitude=' + target_longitude
      + '&target_category=' + target_category
      + '&target_logoPath=' + target_logoPath
      + '&target_venue=' + target_venue;

    wx.navigateTo({
      url: url
    })
  },

  

  searchPOI: function () {
    var that = this;
    qqmapsdk.search({
      keyword: that.data.searchPOIVal,
      success: function (res) {
        console.log("搜索");
        console.log(res.data);
        var coordinates = res.data;
        //marker数组
        var tempMarkers = [];
        var tempIncludePoints = [];

        for (var i = 0; i < coordinates.length; i++) {
          var tempLatitude = coordinates[i].location.lat;
          var tempLongitude = coordinates[i].location.lng;
          var category = coordinates[i].category;
          var venue = coordinates[i].title;
          var POI_id = coordinates[i].id;
          

          tempMarkers.push({
            POI_id: POI_id,
            latitude: tempLatitude,
            longitude: tempLongitude,
            iconPath: '../images/dot.jpg',
            logoPath: '../images/' + parseInt(3*Math.random()) +'.jpg',
            category: category,
            venue: venue,
          });
          tempIncludePoints.push({
            latitude: tempLatitude,
            longitude: tempLongitude,
          });
        }
        console.log(tempMarkers);

        that.setData({
          markers: tempMarkers
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.markers);
    this.setData({
      markers: JSON.parse(options.markers)
    })
    qqmapsdk = new QQMapWX({
      key: 'A5EBZ-DCPK4-IFSU7-XIQGW-NJKPJ-2NFLM'
    });
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