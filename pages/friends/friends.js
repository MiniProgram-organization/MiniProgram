// friends.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon_male:"../images/friends/male-48.png",
    icon_female:"../images/friends/female-48.png",
    friends_num:0,
    haveRequested:false
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var now_timestamp = Date.parse(new Date());
    var before_timestamp = 0;
    before_timestamp = app.globalData.discoverLastTime;
    if (before_timestamp == undefined) { 
      //之前没有按过发现，保持false
    }else{
      //之前按过发现，计算时间差，大于5min则重置haveRequested为false
      var difference = (now_timestamp - before_timestamp) / 1000;
      if ((difference / 60) >= 5){
        this.setData({
          haveRequested:false
        });
      }
    }
    if(!this.data.haveRequested){
      this.requestForFriends();
    }
  
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
  
  },

  /**
   * 向服务器发送请求信息, 收到请求信息并设置页面data
   */
  requestForFriends:function (){
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/Discover',
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        sessionid: app.globalData.sessionid,
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude
      },
      success: function (res) {
        console.log("[Friends] response:");
        console.log(res.data);
        
        

        if (res.data.status == "OK") {
          var friends_num = res.data.user_num;
          var friends_infos = res.data.users;
          var noFriends = (friends_num == 0);
          for(var i = 0; i < friends_infos.length; i++)
          {
            var prefix = "";
            if (friends_infos[i].gender == 0) prefix = "她/他"
            else if(friends_infos[i].gender == 1) prefix = "他"
            else if (friends_infos[i].gender == 2) prefix="她"

            console.log(prefix)
            if (friends_infos[i]["mayor_count"] == -1) friends_infos[i]['king_words'] = ""
            else if (friends_infos[i]["mayor_count"] == 0){
                friends_infos[i]['king_words'] = prefix + "还没有当过地主~"
            }
            else{
              friends_infos[i]['king_words'] = prefix + "是" + friends_infos[i]["mayor_count"]+"个地点的地主～"
            }
          }
          that.setData({
            friends_num: friends_num,
            friends_infos:friends_infos,
            noFriends:noFriends,
            haveRequested:true
          });
        } else {
          wx.showModal({
            title: '提示',
            content: '获取信息失败',
            showCancel: false
          });
        }
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '获取信息失败',
          showCancel: false
        });
      }
    });
  }
})