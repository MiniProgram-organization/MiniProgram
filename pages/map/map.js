var utils = require('../../utils/utils.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: getApp().globalData.windowWidth,
    windowHeight: getApp().globalData.windowHeight,
    markers: [],
    venue: '',
    POI_id: '',
    longitude: '', //POI经度
    latitude: '', //POI纬度
    category: '',
    logoPath: '',
    imgUrl: '',
    text: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    console.log(app.globalData);
    this.setData({
      POI_id: options.target_id,
      longitude: parseFloat(options.target_longitude),
      latitude: parseFloat(options.target_latitude),
      venue: options.target_venue,
      category: options.target_category,
      logoPath: options.target_logoPath,
      markers: [{
        latitude: options.target_latitude,
        longitude: options.target_longitude,
        iconPath: '../images/' + options.target_category + '.jpg',
      }]
    });
  },

  textChange: function (e) {
    this.setData({
      text: e.detail.value
    });
    console.log(this.data.text);
  },


  checkIn: function (e) {
    var that = this;
    if (that.data.text == "") {
      wx.showToast({
        title: '请输入你的心情',
      })
    } else {
      wx.request({
        url: 'https://40525433.fudan-mini-program.com/cgi-bin/CheckIn',
        method: 'POST',
        data: {
          POI_id: that.data.POI_id,
          POI_info: {
            category: that.data.category,
            venue: that.data.venue,
            latitude: that.data.latitude, //poi所在纬度
            longitude: that.data.longitude, //poi所在经度
            city: "上海",
            country: "中国"
          },
          created_by_user: false,
          openid: app.globalData.openid,
          latitude: app.globalData.latitude,//用户所在纬度
          longitude: app.globalData.longitude,  //用户所在经度
          text: that.data.text
        },
        success: function (e) {
          console.log(e);
          var datetime = new Date();
          var time = datetime.toLocaleTimeString();
          var date = datetime.toLocaleDateString();
          var old_history = wx.getStorageSync('history');

          console.log(that.data.text);

          if (e.data.status == "OK") {

            if (!old_history) {
              console.log("咩有缓存");
              wx.setStorage({
                key: 'history',
                data: [{
                  POI_latitude: that.data.latitude,
                  POI_longitude: that.data.longitude,
                  latitude: app.globalData.latitude,
                  longitude: app.globalData.longitude,
                  POI_id: that.data.POI_id,
                  category: that.data.category,
                  venue: that.data.venue,
                  time: time,
                  date: date,
                  logoPath: that.data.logoPath
                }]
              })
            } else {
              console.log("有历史缓存");

              //插入头部，因为是按照时间倒序排列的
              old_history.unshift({
                POI_latitude: that.data.latitude,
                POI_longitude: that.data.longitude,
                latitude: app.globalData.latitude,
                longitude: app.globalData.longitude,
                POI_id: that.data.POI_id,
                category: that.data.category,
                venue: that.data.venue,
                time: time,
                date: date,
                logoPath: that.data.logoPath
              });
              wx.setStorage({
                key: 'history',
                data: old_history,
              });
            }

            wx.redirectTo({
              url: '../showpeople/showpeople?POI_id=' + that.data.POI_id,
              success: function (e) {
                wx.showToast({
                  title: that.data.venue + " 签到成功",
                  icon: 'success',
                  duration: 2000
                });
              }
            })

          } else {

            wx.showToast({
              title: that.data.venue + " 签到失败",
              icon: 'loading',
              duration: 2000

            });

          }
        },
        fail: function (e) {
          console.log("获取位置网络连接失败");
        }

      });
    }
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