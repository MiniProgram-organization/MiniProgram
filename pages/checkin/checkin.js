
// checkin.js
var utils = require('../../utils/utils.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
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
    markers: [],
    searchPOIVal: "",
    inputShowed: false,
    inChina: 0
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
      success: function (e) {
        
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

  redictDetail: function (e) {
    var target_id = e.currentTarget.id;
    var inChina = this.data.inChina;
    var target_latitude, target_longitude, target_category, target_venue, target_logoPath, target_adinfo_province, target_adinfo_city, target_adinfo_district, target_adinfo_country;
    for (var index = 0; index < this.data.markers.length; index++) {
      if (this.data.markers[index].POI_id == target_id) {
        target_latitude = this.data.markers[index].latitude;
        target_longitude = this.data.markers[index].longitude;
        target_venue = this.data.markers[index].venue;
        target_category = this.data.markers[index].category;
        target_logoPath = this.data.markers[index].logoPath;
        if (inChina == 1){
          target_adinfo_province = this.data.markers[index].ad_info.province;
          target_adinfo_country = '中国';
          target_adinfo_district = this.data.markers[index].ad_info.district;
        }
        else if(inChina == 0){
          target_adinfo_province = this.data.markers[index].ad_info.state;
          target_adinfo_country = this.data.markers[index].ad_info.country;
          target_adinfo_district = "";
        }
        target_adinfo_city = this.data.markers[index].ad_info.city;
        break;
      }
    }

    var url = '../map/map?target_id=' + target_id
      + '&target_latitude=' + target_latitude
      + '&target_longitude=' + target_longitude
      + '&target_category=' + target_category
      + '&target_logoPath=' + target_logoPath
      + '&target_venue=' + target_venue
      + '&target_adinfo_province=' + target_adinfo_province
      + '&target_adinfo_city=' + target_adinfo_city
      + '&target_adinfo_district=' + target_adinfo_district
      + '&target_adinfo_country=' + target_adinfo_country 
      + '&in_china=' + inChina ;

    wx.redirectTo({
      url: url
    })
  },
  searchPOI: function () {
    var that = this;
    app.globalData.qqmapsdk.search({
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
          var ad_info = coordinates[i].ad_info;
          // console.log(options.ad_info );
          tempMarkers.push({
            POI_id: POI_id,
            latitude: tempLatitude,
            longitude: tempLongitude,
            logoPath: '../images/location/' + app.globalData.locationMap[category.split(":")[0]] +'.png',
            category: category,
            venue: venue,
            ad_info: ad_info,
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
    this.setData({
      qqmapsdk: new QQMapWX({
        key: 'A5EBZ-DCPK4-IFSU7-XIQGW-NJKPJ-2NFLM'
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   * 每次重新进入或者第一次进入时都会再次搜索一遍附近POI
   */
  onShow: function () {
    this.fetchData();
  },
  getChinaPOI: function (latitude, longitude ){
    var that = this;
    //如果查询经纬度成功，则开始搜索附近POI
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
          var ad_info = coordinates[i].ad_info;

          tempMarkers.push({
            POI_id: POI_id,
            latitude: tempLatitude,
            longitude: tempLongitude,
            iconPath: '../images/map/dot.jpg',
            logoPath: '../images/location/' + app.globalData.locationMap[category.split(":")[0]] + '.png',
            category: category,
            venue: venue,
            ad_info: ad_info,
          });
          tempIncludePoints.push({
            latitude: tempLatitude,
            longitude: tempLongitude,
          });
        }
        that.setData({
          markers: tempMarkers,
          include_points: tempIncludePoints
        });

      },
      fail: function () {
        console.log('发送位置失败');
      }
    });
  },
  getForeignPOI: function (latitude, longitude){
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/SearchPOI',
      method: 'POST',
      data: {
        latitude: latitude,
        longitude: longitude,
        //latitude: 35.710934,
        //longitude: 139.729699,
        openid: app.globalData.openid,
        sessionid: app.globalData.sessionid,
      },
      success: function (res) {
        console.log(res)
        console.log('poi')
        var items = res.data.response.groups[0].items
        console.log(items)
        var tempMarkers = [];
        var tempIncludePoints = [];

        for(var i = 0; i < items.length; i++){
          var tempLatitude = items[i].venue.location.lat;
          var tempLongitude = items[i].venue.location.lng;
          var category = items[i].venue.categories[0].name;
          var venue = items[i].venue.name;
          var POI_id = items[i].venue.id;
          var ad_info = {
            "country":items[i].venue.location.country,
            "city":items[i].venue.location.city,
            "state":items[i].venue.location.state
          };
          var icon_init = items[i].venue.categories[0].icon.prefix.substring(39);
          console.log(icon_init)
          var icon = ""
          for(var cc = 0; cc < icon_init.length; cc++){
            if (icon_init[cc] != "_" && icon_init[cc] != "/"){
              icon = icon + icon_init[cc];
            }
            else break;
          }
          console.log(icon)

          tempMarkers.push({
            POI_id: POI_id,
            latitude: tempLatitude,
            longitude: tempLongitude,
            iconPath: '../images/map/dot.jpg',
            logoPath: '../images/location/' + 
             + '.png',
            category: category,
            venue: venue,
            ad_info: ad_info,
          });
          tempIncludePoints.push({
            latitude: tempLatitude,
            longitude: tempLongitude,
          });
        }
        
        that.setData({
          markers: tempMarkers,
          include_points: tempIncludePoints
        });

      }
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
        var inChina = wx.getStorageSync('inChina');
        //var inChina = 0
        that.setData({
          inChina: inChina
        })
        // if (inChina == 1) 
        //   that.getChinaPOI(latitude, longitude);
        // else
          that.getForeignPOI(latitude, longitude);
      }
    });

    setTimeout(function () {
      that.setData({
        hidden: true
      })
    }, 300)
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