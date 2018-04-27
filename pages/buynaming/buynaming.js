// pages/buynaming/buynaming.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    venue: '',
    price: 0,
    iconPath: '',
    new_nickname: '',
    new_price: 0,
    new_naming: '',
    POI_id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      venue: options.target_venue,
      iconPath: options.target_logoPath,
      price :options.target_price,
      POI_id: options.target_id
    });

    
    console.log(this.data);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  newNamingtextChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      new_naming: e.detail.value
    });
  },

  newNicknametextChange: function(e){
    console.log(e.detail.value);
    this.setData({
      new_nickname: e.detail.value
    });
  },

  newPricetextChange: function(e){
    console.log(e.detail.value);
    this.setData({
      new_price: e.detail.value
    });
  },

  submitNaming: function(e){
    var that = this;
    var old_price = parseInt(this.data.price);
    var new_price = parseInt(this.data.new_price);
    var score = wx.getStorageSync('scores');
    if (new_price <= old_price){
      wx.showToast({
        title: '请出更高的价格',
      })
      return 0;
    }
    console.log(old_price, new_price, score);
    if(score < new_price){
      wx.showToast({
        title: '积分余额不足',
      })
      return 0;
    }
    wx.showToast({
      title: '成功冠名' + that.data.new_naming,
    })
    // wx.request({ 
    //   url: "Fake URL",
    //   data: {
    //     openid: getApp().globalData.openid,
    //     sessionid: getApp().globalData.sessionid,
    //     POI_id: that.data.POI_id,
    //     title: that.data.new_naming,
    //     price: price
    //   },
    //   success: function(){

    //   }
    // });
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