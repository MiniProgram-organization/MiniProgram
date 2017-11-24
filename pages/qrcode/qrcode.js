// pages/qrcode/qrcode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcodeUrl: "",
    windowWidth: getApp().globalData.windowWidth,
    windowHeight: getApp().globalData.windowHeight 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      qrcodeUrl: options.qrcodeUrl
    });
  },



  saveQRCode: function () {
    var that = this;
    this.setData({
      displayQrCode: "block"
    });
    console.log(that.data.qrcodeUrl);
    wx.downloadFile({
      url: that.data.qrcodeUrl,
      success: function (res) {
        console.log(res);
        var filePath = res.tempFilePath;
        console.log(filePath)
        console.log(filePath);
        
        wx.saveImageToPhotosAlbum({
          filePath: filePath,
          success: function (res) {
            //console.log(res);
            wx.showModal({
              title: '可以将图片分享到朋友圈',
              content: '个性的小程序码已保存到手机相册!',
              success:function(){
                 wx.switchTab({
                  url: '../account/account',
                })
              },
              });
          },
          fail: function (res) {
            // console.log("HHHHH");
            //console.log(res.errMsg);
            wx.openSetting({
              success: function (settingdata) {
                console.log(settingdata)
                if (settingdata.authSetting['scope.writePhotosAlbum']) {
                  console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                }
                else {
                  console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                }
              }
            });
          }
        });
      },
      fail: function (res) {
        console.log("TTTT");
        console.log(res);
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