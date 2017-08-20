// history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkins: [
      {
        "POI_id": 1,
        "venue": "Fudan University",
        "datetime": "2017-07-01 08:08:08",
        "category": "school",
        "latitude": 23.123,
        "longitude": 123.123
      },
      {
        "POI_id": 5,
        "venue": "Peking University",
        "datetime": "2017-07-02 08:08:08",
        "category": "school",
        "latitude": 43.123,
        "longitude": 123.123
      },
      {
        "POI_id": 5,
        "venue": "Peking University",
        "datetime": "2017-08-16 10:10:10",
        "category": "school",
        "latitude": 43.123,
        "longitude": 123.123
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchHistory();
  },

  fetchHistory: function(){
    var that = this;
    wx.request({
      method: "POST",
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/History',
      data: {
        openid: getApp().globalData.openid
      },
      success: function (res) {
        if (res.data.status == "OK") {
          that.setData({
            // checkins: res.data.checkins
          });
        } else {
          console.log("获取用户信息失败");
        }
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