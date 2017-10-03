// showpeople.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    localUrl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    that.setData({
      localUrl: app.globalData.qrcodeUrl
    });

    wx.downloadFile({
      url: that.data.localUrl,
      success: function (res) {
        var filePath = res.tempFilePath;
        console.log(typeof (filePath));
        wx.saveImageToPhotosAlbum({
          tempFilePath: filePath,
          success: function (res) {
            console.log(res);
          },
          fail: function (res) {
            console.log(res);
          }
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