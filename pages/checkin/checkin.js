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

  checkIn: function (e) {
    var that = this;
    var target_id = parseInt(e.currentTarget.id); 
    console.log("target_id" + target_id);
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
    console.log(target_latitude, target_longitude, target_id);
    console.log(getApp().globalData.openid);
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
        var datetime = new Date();
        var time=datetime.toLocaleTimeString();
        var date=datetime.toLocaleDateString();
        var old_history = wx.getStorageSync('history');
        if (!old_history) {
          console.log("咩有缓存");
          wx.setStorage({
            key: 'history',
            data: [{
              POI_id: target_id,
              category: target_category,
              venue: target_venue,
              time: time,
              date: date,
              logoPath: target_logoPath
            }]
          })
        } else {
          console.log("有历史缓存");

          //插入头部，因为是按照时间倒序排列的
          old_history.unshift({
            POI_id: target_id,
            category: target_category,
            venue: target_venue,
            time: time,
            date: date,
            logoPath: target_logoPath
          });
          wx.setStorage({
            key: 'history',
            data: old_history,
          });
        }

        if (e.data.status == "OK") {
          wx.showToast({
            title: target_venue + " 签到成功",
            icon: 'loading',
            duration: 3000 
          });
        }else{
          wx.showToast({
            title: target_venue + " 签到失败",
            icon: 'loading',
            duration: 3000
          });
        }
        
      },
      fail: function (e) {
        console.log("获取位置网络连接失败");
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