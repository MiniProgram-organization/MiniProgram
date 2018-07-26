// showpeople.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    displayQrCode: "none",
    users: [],
    crown_url:'../images/showpeople/crown.png',
    king_user_name:'',
    king_user_icon:'',
    king_user_num:0,
    POI_name:'',
  },
  redictDetail: function (e) {
    console.log(e.currentTarget);
    var target_id = e.currentTarget.id;
    var url = '../showtops/showtops?target_id=' + target_id;
    wx.redirectTo({
      url: url
    })
  },
  requestPoiHistory: function () {
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/Recent',
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        sessionid: app.globalData.sessionid,
        POI_id: that.data.POI_id,
        user_num: 10 //查看最近在这里签到的用户数
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.status == "OK") {
          var numbers = res.data.user_num;
          var modifiedusers = res.data.users;
          console.log("查看签到人数");

          for(var index in modifiedusers){
            if (modifiedusers[index].text.length > 10){
              modifiedusers[index].text = modifiedusers[index].text.slice(0,10)+ '....';
            }
          } 


          that.setData({
            users: modifiedusers
          });
        } else {
          wx.showToast({
            title: '获取消息失败',
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      POI_id: options.POI_id,
      POI_name: options.POI_name
    });
    that.getKingUser();
    that.requestPoiHistory();
  },
  getKingUser: function(){
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/FrequentUsers',
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        sessionid: app.globalData.sessionid,
        POI_id: that.data.POI_id,
        user_num: 1,
        
      },
      success: function (res) {
        that.setData({
          king_user_name:res.data.users[0].nickName,
          king_user_num: res.data.users[0].check_num,
          king_user_icon:res.data.users[0].avatarUrl
        })
      },
      fail: function(res){

      }
    })
  },
  requestMostUser: function(){
    var that = this;
    
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
    app.globalData.activity_refresh = true;
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