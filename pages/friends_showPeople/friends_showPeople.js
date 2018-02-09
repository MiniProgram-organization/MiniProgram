// pages/friends_showPeople/friends_showPeople.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon_male: "../images/friends/male-48.png",
    icon_female: "../images/friends/female-48.png",

    target_id:"",
    avatarUrl:"../images/icon/discover_icon.png",
    nickName:"猜猜我是谁",
    gender:0,
    location:"未知",
    venue:"就在你周围",
    mayor_available:false,

    details_height:90
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      target_id:options.target_id,
      avatarUrl:options.avatarUrl,
      nickName:options.nickName,
      gender:options.gender,
      venue:options.venue
    });
    
    /*
    if(options.mayor_count>=0){
      this.setData({
        mayor_available: true,
        mayor_count : options.mayor_count
      });
    }else{
      this.setData({
        details_height:70
      });
    }*/

    this.requestForProfile();

  
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
  
  },

  /**
   * 请求对应open_id的用户profile
   */
  requestForProfile: function (){
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/Profile',
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        sessionid: app.globalData.sessionid,
        openid_other: that.data.target_id,
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude
      },
      success: function (res) {
        console.log("[Friends_showPeople] response data: ")
        console.log(res.data);
        if(res.data.status=="OK"){
          var location = res.data.country;
          if(res.data.province!=""){
            location = location + "·" + res.data.province;
          }
          if(res.data.city!=""){
            location = location + "·" + res.data.city;
          }
          if(location==""){
            location = "(神秘的人~)"
          }

          
          that.setData({
            location: location
          });

          if (res.data.mayor_count >= 0) {
            that.setData({
              mayor_available: true,
              mayor_count: res.data.mayor_count
            });
          } else {
            this.setData({
              details_height: 70
            });
          }

        }
        else{
          wx.showModal({
            title: '提示',
            content: '获取用户数据失败',
            showCancel: false
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '获取用户数据失败',
          showCancel:false
        });
      }
    })
  },

  previewImg:function(e){
    wx.previewImage({
      urls: [this.data.avatarUrl],
    })
  }
})