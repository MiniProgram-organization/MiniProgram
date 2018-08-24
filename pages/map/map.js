var utils = require('../../utils/utils.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: getApp().globalData.windowWidth,
    windowHeight: getApp().globalData.windowHeight,
    markers: [],
    venue: '',
    POI_id: '',
    longitude: '', //POI经度
    latitude: '', //POI纬度
    category: '',
    logoPath: '',
    imgUrl: '',
    text: '',
    ad_info:{},
    in_china:0,
    check_in_last_time:0

  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    console.log(options);
    console.log(options.target_adinfo_city);
    this.setData({
      POI_id: options.target_id,
      longitude: parseFloat(options.target_longitude),
      latitude: parseFloat(options.target_latitude),
      venue: options.target_venue,
      category: options.target_category,
      logoPath: options.target_logoPath,
      ad_province: options.target_adinfo_province,
      ad_city: options.target_adinfo_city,
      ad_district: options.target_adinfo_district,
      ad_country: options.target_adinfo_country,
      markers: [{
        latitude: options.target_latitude,
        longitude: options.target_longitude,
      }],
      in_china: options.in_china,
    });

  },

  textChange: function (e) {
    this.setData({
      text: e.detail.value
    });
    console.log(this.data.text);
  },

  loginNoOpenId: function(){
    wx.login({
      success: function (res) {
        var code = res.code;
        console.log('code is ' + code);
        wx.getUserInfo({
          success: function (res) {
            console.log(res.rawData);
            app.globalData.rawData = JSON.parse(res.rawData);
            console.log(app.globalData.rawData);
            var iv = res.iv;
            console.log("Don't get storage");
            wx.request({
              url: 'https://40525433.fudan-mini-program.com/cgi-bin/Login',
              method: 'POST',
              data: {
                code: code,
                rawData: app.globalData.rawData,
                latitude: app.globalData.latitude,
                longitude: app.globalData.longitude,
              },
              success: function (res) {
                if (res.data.status == "ERROR") {
                  console.log(res.data.message);
                  return;
                }
                console.log(res.data.openid);
                console.log(res.data.registered);
                app.globalData.openid = res.data.openid;
                app.globalData.sessionid = res.data.sessionid;
              }
            });
          }
        })
      }
    });
  },

  checkIn: function (e) {
    //console.log(this.data.check_in_last_time)
    var that = this;
      if (app.globalData.openid == ""){
        that.loginNoOpenId();
      }
      var now_timestamp = Date.parse(new Date());  
    /*  var d1 = (now_timestamp - that.data.check_in_last_time)/1000;
      console.log(d1)
      console.log('d1')
      if((d1/60)<5){
        that.setData({
          check_in_last_time:now_timestamp,
        })

        return;

      }*/
      console.log(now_timestamp);
      var before_timestamp = 0;
      wx.showToast({
        title: '请等待',
        icon:'loading',
        duration:100000,
      })
      console.log('输出字典')
      console.log(app.globalData.checkinLastTimeTable);
      console.log('一半')
      console.log(that.data.POI_id + "")
      before_timestamp = app.globalData.checkinLastTimeTable[that.data.POI_id+""];
      if (before_timestamp == undefined){ //之前没有签到过
        var gd = 1; //不执行操作
      }
      else{
        var difference = (now_timestamp - before_timestamp)/1000;
        console.log(difference)
        console.log('difference')
        if ((difference/60)<5)
        {
          wx.showModal({
            title: '提示',
            content: '您在该地点签到过于频繁，请5分钟后再试。',
            success: function (res) {
              if (res.confirm) {
              } else if (res.cancel) {
              }
            }
          })  
          wx.showToast({
            title: '请稍后再试',
            icon: 'loading',
            duration: 500,
          })
         /* wx.showToast({
            title: '此地签到太频繁',
            icon:'loading'
          })*/
          return
        }
      }


      // 先查询一下未签到的时候地主数是谁
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
          console.log("[map] frequentUsers");
          console.log(res);

          var king_before = "";
          if(res.data.user_num == 0){
            king_before = "undefined";
          }else{
            king_before = res.data.users[0].openid;
          }

          wx.request({
            url: 'https://40525433.fudan-mini-program.com/cgi-bin/CheckIn',
            method: 'POST',

            data: {
              POI_id: that.data.POI_id,
              POI_info: {
                category: that.data.category,
                venue: that.data.venue,
                latitude: that.data.latitude, //poi所在纬度
                longitude: that.data.longitude, //poi所在经度
                province: that.data.ad_province,
                city: that.data.ad_city,
                district: that.data.ad_district,
              },
              created_by_user: false,
              openid: app.globalData.openid,
              sessionid: app.globalData.sessionid,
              latitude: app.globalData.latitude,//用户所在纬度
              longitude: app.globalData.longitude,  //用户所在经度
              text: that.data.text,
              in_china: that.data.in_china,
            },
            success: function (e) {

              var datetime = new Date();
              var time = e.data.time;
              var date = e.data.date
              var height_p = 65;
              if (that.data.text != "") {
                height_p = 80;
              }
              var old_history = wx.getStorageSync('checkins');

              if (e.data.status == "OK") {
                app.globalData.checkinLastTimeTable[that.data.POI_id.toString()] = now_timestamp;
                console.log(app.globalData.checkinLastTimeTable)
                var award = e.data.award;
                var scores = e.data.scores;
                var duration = e.data.duration;

                wx.setStorageSync('scores', scores);
                wx.setStorageSync('duration_checkin', {
                  data: duration
                });

                if (!old_history) {
                  console.log("没有缓存");
                  wx.setStorage({
                    key: 'checkins',
                    data: [{
                      POI_latitude: that.data.latitude,
                      POI_longitude: that.data.longitude,
                      latitude: app.globalData.latitude,
                      longitude: app.globalData.longitude,
                      POI_id: that.data.POI_id,
                      category: that.data.category,
                      venue: that.data.venue,
                      time: time,
                      text: that.data.text,
                      date: date,
                      logoPath: that.data.logoPath,
                      text: that.data.text,
                      height_p: height_p,
                    }]
                  })
                } else {
                  console.log("有历史缓存");
                  //插入头部，因为是按照时间倒序排列的
                  old_history.unshift({
                    POI_latitude: that.data.latitude,
                    POI_longitude: that.data.longitude,
                    latitude: app.globalData.latitude,
                    longitude: app.globalData.longitude,
                    POI_id: that.data.POI_id,
                    category: that.data.category,
                    venue: that.data.venue,
                    time: time,
                    text: that.data.text,
                    date: date,
                    logoPath: that.data.logoPath,
                    text: that.data.text,
                    height_p: height_p,
                  });
                  wx.setStorage({
                    key: 'checkins',
                    data: old_history,
                  });
                }


                wx.redirectTo({
                  url: '../showpeople/showpeople?POI_id=' + that.data.POI_id + '&POI_name=' + that.data.venue + '&king_before=' + king_before,
                  success: function (e) {
                    if (award > 0) {
                      wx.showToast({
                        title: "签到成功\n" + '+' + award + '分',
                        icon: 'success',
                        duration: 2000
                      });
                    }
                    else {
                      wx.showToast({
                        title: "签到成功",
                        icon: 'success',
                        duration: 2000
                      });
                    }
                  }
                });

              } else {

                wx.showToast({
                  title: "签到失败",
                  icon: 'loading',
                  duration: 2000

                });

              }
            },
            fail: function (e) {
              console.log("获取位置网络连接失败");
            }

          });
        },
        fail: function (res) {

        }
      })
      

    },

    requestCheckin:function(king_before){
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