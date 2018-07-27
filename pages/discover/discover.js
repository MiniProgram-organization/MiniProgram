// pages/discover/discover.js
var app = getApp();
var discoverObj = {

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
  },

  goToFriends: function () {
    console.log("[Discover] goToFriends");

    wx.navigateTo({
      url: '../friends/friends'
    })
  },
  findRestaurant: function(){
    console.log("[Discover] findRestaurant");
    wx.navigateTo({
      url: '../discoverPOI/discoverPOI?type_en=restaurant&type_cn=餐饮'
    })
  },
  findSchool: function () {
    console.log("[Discover] findSchool");

    wx.navigateTo({
      url: '../discoverPOI/discoverPOI?type_en=school&type_cn=学校'
    })
  },
  findMall: function () {
    console.log("[Discover] findMall");

    wx.navigateTo({
      url: '../discoverPOI/discoverPOI?type_en=mall&type_cn=商场'
    })
  },
  findToilet: function () {
    console.log("[Discover] findToilet");

    wx.navigateTo({
      url: '../discoverPOI/discoverPOI?type_en=toilet&type_cn=洗手间'
    })
  },
  findSubway: function(){
    console.log("[Discover] findSubway");

    wx.navigateTo({
      url: '../discoverPOI/discoverPOI?type_en=subway&type_cn=地铁站'
    })
  },
  findScenic: function () {
    console.log("[Discover] findScenic");

    wx.navigateTo({
      url: '../discoverPOI/discoverPOI?type_en=scenic&type_cn=景区'
    })
  },
  findATM: function(){
    console.log("[Discover] findATM");

    wx.navigateTo({
      url: '../discoverPOI/discoverPOI?type_en=atm&type_cn=ATM'
    })
  },

  onShow: function () {
    console.log("[Discover] onShow");

    wx.getLocation({
      success: function (res) {
        app.globalData.latitude = res.latitude;
        app.globalData.longitude = res.longitude;
      },
    })
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/DiscoverAll',
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        sessionid: app.globalData.sessionid,
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude,
        poi_type:''
      },
      success: function (res) {
        if (res.data.status != 'OK'){

        }
      }
    })
  },

};

Page(discoverObj);

export default discoverObj;