// pages/discoverPOI/discoverPOI.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    type_cn:'',
    type_en:'',
    POI_list:[],
    count:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type_en: options.type_en,
      type_cn: options.type_cn
    })
    wx.setNavigationBarTitle({
      title: '附近的' + options.type_cn,
      success: function (res) {
      }
    })
  },
  listListener: function(e){
    var title = "";
    var address = "";
    var lat = 0.0;
    var lng = 0.0;
    console.log(e.currentTarget.id)
    for(var i = 0; i < 10; i++){
      if (this.data.POI_list[i].id == e.currentTarget.id){
        title = this.data.POI_list[i].title;
        address = this.data.POI_list[i].address;
        lat = this.data.POI_list[i].location.lat;
        lng = this.data.POI_list[i].location.lng;
        break;
      }
    }
    /*
    wx.navigateTo({
      url: '../discoverLocation/discoverLocation?title='+title
      +'&address='+address
      +'&POI_lat='+lat
      +'&POI_lng=' + lng
      + '&id=' + e.currentTarget.id


    })*/
    wx.openLocation({
      latitude:lat,
      longitude:lng,
      scale: 17,
      name: title,
      address: address
    })  
  
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
    var that = this;
    app.globalData.qqmapsdk.search({
      keyword: this.data.type_cn,
      location:{
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude
      },
      success: function (res) {
        console.log(res);
        that.setData({
          POI_list: res.data,  
          count:res.data.length    
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '查找失败!',
          icon:'loading'
        })
      },
    });
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