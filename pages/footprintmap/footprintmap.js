// pages/main/main.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: "",
    viewHeight: 0,
    viewWidth: 0,
    backgroundcolor:"#bbb",
    provinceCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    var avatarUrl = app.globalData.rawData.avatarUrl;
    var nickname = app.globalData.rawData.nickName;
    this.setData({
      nickname:nickname,
      avatarUrl:avatarUrl
    });
    wx.getSystemInfo({
      success: res => {
        var height = res.windowWidth*27/30;
        this.setData({
          viewHeight: height,
          viewWidth: res.windowWidth,
        })
      }
    });

    // 先查看缓存
    var that = this;
    var valid  = wx.getStorageSync("footprint_valid");
    var num = wx.getStorageSync("province_num");
    this.setData({
      provinceCount:num
    });

    if(valid > 0){
      var url = wx.getStorageSync("footprint_url");
      this.setData({
        imgSrc:url
      });
      wx.hideLoading();
    }else{
      //缓存没有
      wx.request({
        url: 'https://40525433.fudan-mini-program.com/cgi-bin/CheckinImg.py',
        method: 'POST',
        data: {
          openid: getApp().globalData.openid,
          sessionid: getApp().globalData.sessionid,
          latitude: app.globalData.latitude,
          longitude: app.globalData.longitude
        },
        success: function (res) {
          if (res.data.status == "OK") {
            that.setData({
              imgSrc: res.data.url
            });
            wx.hideLoading();
            wx.setStorageSync("footprint_url", res.data.url);
            wx.setStorageSync("footprint_valid", 1);

          }

        }
      })

    }

  },
})