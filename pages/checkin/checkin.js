

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
    title_list:[],
    inChina: 0
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
      location: {
        latitude: that.data.latitude,
        longitude: that.data.longitude
      },
      success: function (res) {
        var coordinates = res.data;
        //marker数组
        var tempMarkers = [];
        var tempIncludePoints = [];
        var poi_list = [];
        for (var i = 0; i < coordinates.length; i++) {
          var tempLatitude = coordinates[i].location.lat;
          var tempLongitude = coordinates[i].location.lng;
          var category = coordinates[i].category;
          var venue = coordinates[i].title;
          var POI_id = coordinates[i].id;
          poi_list.push(coordinates[i].id);
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
            ownerName: '暂无',
            title: venue,
            price: 20,
            second_title: ''
          });
          tempIncludePoints.push({
            latitude: tempLatitude,
            longitude: tempLongitude,
          });
        }


        console.log(tempMarkers);

        // 这里要加上搜索冠名的部分
        that.getPOItitle(poi_list, tempMarkers);

      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  
  onLoad: function (options) {
    this.setData({
      qqmapsdk: new QQMapWX({
        key: 'A5EBZ-DCPK4-IFSU7-XIQGW-NJKPJ-2NFLM'
      })
    })
  },

  onShow: function () {
    this.fetchData();
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
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        console.log(res);
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.setData({
          latitude: latitude,
          longitude: longitude,
        });
        var inChina = wx.getStorageSync('inChina');
        that.setData({
          inChina: inChina
        })
        if (inChina == 1)
          that.getChinaPOI(latitude, longitude);
        else
          that.getForeignPOI(latitude, longitude);
      }
    });
  },

  getChinaPOI: function (latitude, longitude ){
    var that = this;
    //如果查询经纬度成功，则开始搜索附近POI
    app.globalData.qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude,
      },
      get_poi: 1,
      success: function (res) {
        console.log("附近POI");
        console.log(res.result.pois);
        var coordinates = res.result.pois;
        //marker数组
        var tempMarkers = [];
        var tempIncludePoints = [];
        var poi_list = [];
        for (var i = 0; i < coordinates.length; i++) {
          var tempLatitude = coordinates[i].location.lat;
          var tempLongitude = coordinates[i].location.lng;
          var category = coordinates[i].category
          var venue = coordinates[i].title;
          var POI_id = coordinates[i].id;
          poi_list.push(POI_id);
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
            ownerName: '暂无',
            title: venue,
            price: 20,
            second_title:''
          });
          tempIncludePoints.push({
            latitude: tempLatitude,
            longitude: tempLongitude,
          });
        } 

        that.getPOItitle(poi_list,tempMarkers);


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
          markers: tempMarkers
        });

      }
    })
  },

  getPOItitle: function (poi_list, tempMarkers){
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/POITitle',
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        sessionid: app.globalData.sessionid,
        POI_ids: poi_list
      },
      success: function (res) {
        console.log("LLLLLL");
        console.log(res);

        for (var i = 0; i < tempMarkers.length; i++) {
          for (var j = 0; j < res.data.POIs.length; j++) {
            if (res.data.POIs[j].POI_id == tempMarkers[i].POI_id) {
              tempMarkers[i].title = res.data.POIs[j].title;
              tempMarkers[i].price = res.data.POIs[j].price;
              tempMarkers[i].ownerName = res.data.POIs[j].ownerName;
            }
          }
        }


        for (var i = 0; i < tempMarkers.length; i++) {
          if (tempMarkers[i].ownerName == '暂无') {
            tempMarkers[i].second_title = '';
          }
          else {
            tempMarkers[i].second_title = tempMarkers[i].title + ' - ' + tempMarkers[i].ownerName;
          }
        }

        that.setData({
          markers: tempMarkers
        });
      }
    })

  }


})