// pages/recordmood/recordmood.js
var app = getApp();
var wxCharts = require('../../utils/wxcharts.js');
var all_name = ['狂喜','开心','放松','平静','低落','焦虑','生气']
var all_set = 
[
  '哇咔咔，我也为你开心o(￣▽￣)ｄ 保持这一刻的好心情吧！@_@',
  '很高兴能分享你的好心情(*≧∪≦)',
  '保持这一刻的闲适心境，拥抱所有可能的未知o(￣▽￣)ｄ',
  '带上沉着笃定的心态迎接未来(๑•̀ㅂ•́)و✧',
  '送你一朵fa fa，加油加油（づ￣3￣）づ╭',
  '不要紧张，相信自己 (๑•̀ㅂ•́)و✧加油',
  '世界如此美妙，你却…… '
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: getApp().globalData.windowWidth,
    windowHeight: getApp().globalData.windowHeight,
      icon_url:"",
      mood_text:"",
      mood_id:-1,
      text:"",
  },
  recordMood: function (options)
  {
    
    var that = this;
    console.log(that.data.mood_text)
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/Mood',
      method: 'POST',
      data:{
        mood_id: that.data.mood_id,           //心情类型(1-7)
        mood_text:  that.data.mood_text,    //心情类型对应的文字
        openid: app.globalData.openid,
        text: that.data.text,
        latitude: app.globalData.latitude,//用户所在纬度
        longitude: app.globalData.longitude,  //用户所在经度
      },
      success: function (e) {
        console.log("??????")
        wx.switchTab({
          url: '../mood/mood',
          success: function (e) {
            wx.showToast({
              title: "记录成功：" + that.data.mood_text,
              icon: 'success',
              duration: 2000
            });
          }
        })
      },
      fail: function(e)
      {
        wx.showToast({
          title: "记录失败：" + that.data.mood_text,
          icon: 'loading',
          duration: 2000
        });
      }
    })

  },
  textChange: function (e) {
    this.setData({
      text: e.detail.value
    });
    console.log(this.data.text);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.moodId);
    this.setData({
      icon_url: '../images/mood/' + (parseInt(options.moodId)+1)+'.png',
      mood_id:options.moodId,
      mood_text: all_name[parseInt(options.moodId)],
      mood_set: all_set[parseInt(options.moodId)]
    })
    console.log(this.data)
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