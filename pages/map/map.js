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
    longitude: '',
    latitude: '',
    category: '',
    logoPath: '',
    imgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */

  getQRCode: function () {
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/QRCode',
      method: 'POST',
      data: {
        "scene": "lsh"
      },
      success: function (e) {
        console.log(e.data);
        app.globalData.qrcodeUrl = e.data.url;
      }
    })
  },

  onLoad: function (options) {
    var that = this;
    console.log(options);
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
    that.getQRCode()
  },


  checkIn: function (e) {
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/CheckIn',
      method: 'POST',
      data: {
        created_by_user: false,
        openid: getApp().globalData.openid,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        POI_id: that.data.POI_id,
      },
      success: function (e) {
        console.log(e);
        var datetime = new Date();
        var time = datetime.toLocaleTimeString();
        var date = datetime.toLocaleDateString();
        var old_history = wx.getStorageSync('history');
        if (!old_history) {
          console.log("咩有缓存");
          wx.setStorage({
            key: 'history',
            data: [{
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

        if (e.data.status == "OK") {
          wx.redirectTo({
            url: '../showpeople/showpeople',
            success: function (e) {
              wx.showToast({
                title: that.data.venue + " 签到成功",
                icon: 'success',
                duration: 2000
              });
            }
          })
        } else {
          wx.redirectTo({
            url: '../showpeople/showpeople',
            success: function (e) {
              wx.showToast({
                title: that.data.venue + " 签到失败",
                icon: 'loading',
                duration: 2000
              });
            }
          })

        }
      },
      fail: function (e) {
        console.log("获取位置网络连接失败");
      }

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