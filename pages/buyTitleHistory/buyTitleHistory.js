// pages/buyTitleHistory/buyTitleHistory.js
var app = getApp();
var util = require("../../utils/utils.js");
Page({

  data: {
    self:0,
    num:0,
    openid_other:"",

    // 控制无历史的显示
    no_record:false,

    // 控制加载的显示
    loading: false,

    history:[]
  },

  onLoad: function (options) {
     var self = options.self;
     var num = options.number;
     var openid_other = "";
     if(self == 0){
       openid_other = options.openid_other;
     }

     var no_record = false;
     var loading = false;
     if(num == 0){
       no_record = true;
     }else{
       loading = true;
     }

     this.setData({
       self:self,
       num:num,
       openid_other:openid_other,
       no_record:no_record,
       loading:loading
     });
  },

  onShow: function () {
    // 判断是否需要发送请求
    if(this.data.no_record == false){
      // 发送请求
      this.requestHistory();
    }
    this.requestForPic();
  
  },

  requestHistory:function(){
    var that = this;
    var localTime = util.formatTime(new Date());

    var url = "";
    var requestData = {};
    if(this.data.self == 0){
      url = 'https://40525433.fudan-mini-program.com/cgi-bin/TitleTradeHistory_other';
      requestData = {
        openid: app.globalData.openid,
        sessionid: app.globalData.sessionid,
        openid_other: this.data.openid_other,
        localTime: localTime
      };
    }else{
      url = 'https://40525433.fudan-mini-program.com/cgi-bin/TitleTradeHistory';
      requestData = {
        openid: app.globalData.openid,
        sessionid: app.globalData.sessionid,
        localTime: localTime
      };
    }
    console.log(requestData);

   

    wx.request({
      url: url,
      method: 'POST',
      data: requestData,
      success: function (res) {
        console.log("[buyTitleHistory] response data: ");
        console.log(res);
        console.log(res.data);
        if (res.data.status == "OK") {
          //赋值信息
          var history = res.data.hisory;
          
          for(var i=0;i<history.length;i++){
            var item = history[i];
            item.color = "#0E7EE6";
            var category = item.category;
            item.logoPath = '../images/location/' + app.globalData.locationMap[category.split(":")[0]] + '.png';
            if (item.valid == false) {
              item.color = "grey";
            }
            if (that.data.self == 1) {
              var date = (item.time.split(" "))[0];
              date = date.replace(/-/g,"/");
              item.date = date;
            }
            history[i] = item;    
          }
          
          console.log(history);
          

          that.setData({
            history:history,
            loading:false
          });

        }
        else {
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
          showCancel: false
        });
      }
    })
  },

  requestForPic:function(){
    var requestData = {
      openid: app.globalData.openid,
      sessionid: app.globalData.sessionid,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude
    };
    wx.request({
      url: "https://40525433.fudan-mini-program.com/cgi-bin/CheckinImg.py",
      method: 'POST',
      data: requestData,
      success: function (res) {
        console.log("CheckinImg.py response");
        console.log(res);
        console.log(res.data);
        
      },
      fail: function (res) {
        
      }
    })
  }


})