// pages/register/register.js
var utils = require('../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: '',
    phone: ''
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

  // 获取用户信息
  phoneInput: function(e){
    this.setData({
      phone: e.detail.value
    });
  },

  userInput: function(e){
   this.setData({
     user: e.detail.value
   });
  },

  uploadInfo: function(){
    var that = this;
    console.log(this.data.user.length);
    console.log(this.data.phone.length);
    if(this.data.phone.length == 0 || this.data.user.length == 0){
      wx.showToast({
        title: '用户名和电话不能为空',
        icon: 'loading',
        duration: 1000
      });
    }else{
      // 显示消息
      wx.showToast({
        title: '注册成功',
        icon: 'success',
        duration: 2000
      });

      
      utils.register({
        rawData: getApp().globalData.rawData,
        openid: getApp().globalData.openid,
        user: this.data.user,
        phone: this.data.phone
      });

      console.log('跳转到地图界面');
      //跳转到地图页面
      wx.switchTab({
        url: '../map/map',
      });
    }
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