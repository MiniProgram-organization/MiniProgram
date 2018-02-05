// friends.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon_male:"../images/friends/male-48.png",
    icon_female:"../images/friends/female-48.png",
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 向服务器发送请求信息 */
    /* 收到服务的返回信息 */
    /* 解析服务器返回的信息到list中 */
    var friends_infos = [
      {
        name:"用户1",
        avatar_url:"../images/test.png",
        isMale:true,
        king_number:0,
        king_words:"他还没有当过地主"
      },
      {
        name: "用户2",
        avatar_url: "../images/test.png",
        isMale: false,
        king_number: 4,
        king_words: "她是 4 个地方的地主~"
      }
    ];
    this.setData({
      friends_infos:friends_infos
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