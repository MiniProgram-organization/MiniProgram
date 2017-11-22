// pages/chooseArea/chooseArea.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'城市',
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    showList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var preCityList = wx.getStorageSync('cityList');
      console.log(preCityList)
      var that = this;
      if (preCityList == ""){
        wx.request({
          url: 'https://40525433.fudan-mini-program.com/cgi-bin/City',
          method: 'POST',
          data: {
            level:1
          },
          success: function (res) {
            console.log(res)
            wx.setStorageSync('cityList', res.data.cities)
            that.setData({
              showList: res.data.cities
            })
          },
          fail: function(res){
            console.log(res)
          }
        })
      }
      else{
        console.log(preCityList)
        this.setData({
          showList: preCityList
        })
        console.log(this.showList)
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