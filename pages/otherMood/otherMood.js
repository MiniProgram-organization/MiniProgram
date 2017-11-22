// pages/otherMood/otherMood.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    icon_url:'',
    mood_id: 0,
    text: "",
    mood_text: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      icon_url: '../images/mood/' + parseInt(options.moodId) + '.png',
      mood_id: options.moodId,
      mood_text: "",
      mood_set: "今天是属于你的特殊日子吗？(๑•̀ㅂ•́)و✧记录下你独特的心情吧～",
    })
  },
  bindMoodType: function(e){
    this.setData({
      mood_text: e.detail.value
    });
    console.log(e.detail.value)
  },
  textChange: function (e) {
    this.setData({
      text: e.detail.value
    });
  },
  recordMood: function (options) {
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/Mood',
      method: 'POST',
      data: {
        mood_id: that.data.mood_id,        //心情类型(0-7)
        mood_text: that.data.mood_text,    //心情类型对应的文字
        openid: app.globalData.openid,
        text: that.data.text,
        latitude: app.globalData.latitude,//用户所在纬度
        longitude: app.globalData.longitude,  //用户所在经度
      },
      success: function (e) {
        //添加到缓存
        var old_history = wx.getStorageSync('history_mood');
        var datetime = new Date();
        var time = datetime.toLocaleTimeString();
        var date = datetime.toLocaleDateString();
        var datetimestring = date + ' ' + time.substring(time.length - 8, time.length)
        var duration = e.data.duration;
        var award = e.data.award;
        var scores = e.data.scores;
        wx.setStorageSync('scores', scores);
        wx.setStorageSync('duration_mood', duration);

        if (old_history == "") {
          wx.setStorageSync('history_mood', [{
            mood_id: that.data.mood_id,
            mood_text: that.data.mood_text,    //心情类型对应的文字
            text: that.data.text,
            datetime: datetimestring,
            latitude: app.globalData.latitude,//用户所在纬度
            longitude: app.globalData.longitude,  //用户所在经度
            simpletime: time.substring(time.length - 8, time.length),
            logoPath: '../images/mood/' + that.data.mood_id + '.png'
          }])
        }
        else {
          old_history.unshift({
            mood_id: that.data.mood_id,
            mood_text: that.data.mood_text,    //心情类型对应的文字
            text: that.data.text,
            datetime: datetimestring,
            latitude: app.globalData.latitude,//用户所在纬度
            longitude: app.globalData.longitude,  //用户所在经度
            simpletime: time.substring(time.length - 8, time.length),
            logoPath: '../images/mood/' + that.data.mood_id + '.png'
          });
          wx.setStorageSync('history_mood', old_history);
        }
        wx.switchTab({
          url: '../mood/mood',
          success: function (e) {
            if (award > 0) {
              wx.showToast({
                title: "记录成功：\n" + that.data.mood_text + '\n' + '+' + award + '分',
                icon: 'success',
                duration: 2000
              });
            }
            else {
              wx.showToast({
                title: "记录成功：\n" + that.data.mood_text,
                icon: 'success',
                duration: 2000
              });
            }
          }
        })
      },
      fail: function (e) {
        wx.showToast({
          title: "记录失败：\n" + that.data.mood_text,
          icon: 'loading',
          duration: 2000
        });
      }
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