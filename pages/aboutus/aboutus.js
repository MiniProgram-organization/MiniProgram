// pages/aboutus/aboutus.js
var app = getApp();
Page({

  data: {
    text:"",
    openid: app.globalData.openid,
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
  },

  textChange: function (e) {
    this.setData({
      text: e.detail.value
    });
    console.log(this.data.text);
  },
  
})