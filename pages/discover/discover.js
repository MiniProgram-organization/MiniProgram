// pages/discover/discover.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  goToFriends: function () {
    wx.navigateTo({
      url: '../friends/friends'
    })
  },
  findRestaurant: function(){
    wx.navigateTo({
      url: '../discoverPOI/discoverPOI?type_en=restaurant&type_cn=餐饮'
    })
  },
  findSchool: function () {
    wx.navigateTo({
      url: '../discoverPOI/discoverPOI?type_en=school&type_cn=学校'
    })
  },
  findMall: function () {
    wx.navigateTo({
      url: '../discoverPOI/discoverPOI?type_en=mall&type_cn=商场'
    })
  },
  findToilet: function () {
    wx.navigateTo({
      url: '../discoverPOI/discoverPOI?type_en=toilet&type_cn=洗手间'
    })
  },
  findSubway: function(){
    wx.navigateTo({
      url: '../discoverPOI/discoverPOI?type_en=subway&type_cn=地铁站'
    })
  },
  findScenic: function () {
    wx.navigateTo({
      url: '../discoverPOI/discoverPOI?type_en=scenic&type_cn=景区'
    })
  },
  findATM: function(){
    wx.navigateTo({
      url: '../discoverPOI/discoverPOI?type_en=atm&type_cn=ATM'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.editTabBar(); 
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
        console.log(res)
        if (res.data.status != 'OK') console.log('记录log失败')
      }
    })
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