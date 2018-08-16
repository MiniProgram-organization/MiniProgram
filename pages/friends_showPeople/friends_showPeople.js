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
    avatarUrl:"../images/icon/discover.png",
    nickName:"猜猜我是谁",
    gender:0,
    location:"未知",
    venue:"就在你周围",
    mayor_available:false,

    details_height:90
  },

  onLoad:function(options){
    this.setData({
      target_id: options.target_id,
      avatarUrl: options.avatarUrl,
      gender: options.gender,
      venue: options.venue,
      nickName: options.nickName
    })
  },

  onShow:function(){
    this.requestForProfile();
  },

  /**
   * 请求对应open_id的用户profile
   */
  requestForProfile: function (){
    var that = this;
    var requestData = {
      openid: app.globalData.openid,
      sessionid: app.globalData.sessionid,
      openid_other: that.data.target_id,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude
    };
    console.log(requestData);
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/Profile',
      method: 'POST',
      data: requestData,
      success: function (res) {
        console.log("[Friends_showPeople] response data: ");
        console.log(res);
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