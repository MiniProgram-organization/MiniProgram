// pages/aboutus/aboutus.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:"",
    openid: app.globalData.openid,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  submit: function(e){
    var that = this;
    if(that.data.text == ""){
      wx.showToast({
        title: '为空时不能提交',
        icon: 'loading'
      })
    }
    else{
      wx.request({
        url: 'https://40525433.fudan-mini-program.com/cgi-bin/Feedback',
        method: 'POST',
        data: {
          openid: app.globalData.openid,
          opinion_text:that.data.text,
          sessionid: app.globalData.sessionid,
        },
        success: function (res){
          console.log(res)
          
          if (res.data.status == 'ERROR'){
            wx.showToast({
              title: '提交失败，未知错误!',
              icon: 'loading'
            })
          }
          else{
            
            that.setData({
              text:''
            });
            wx.showToast({
              title: '提交成功，感谢您的反馈!',
              icon: 'success'
            })
          }
        },
        fail: function(res){
          wx.showToast({
            title: '提交失败，未知错误!',
            icon: 'loading'
          })
        }
      })
    }
   /*wx.showToast({
      title: '功能暂未开通',
      icon:"loading",
    })*/
  },
  textChange: function (e) {
    this.setData({
      text: e.detail.value
    });
    console.log(this.data.text);
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