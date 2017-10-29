//app.js
var app = getApp();
var utils = require('./utils/utils.js');
var QQMapWX = require('./utils/qqmap-wx-jssdk.js');

App({
  /**
   * @brief 先检查是否还处于登录状态，如果成功直接进入主页，否则进行登录流程
   */
  onLaunch: function () {
    
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: scope,
            success() {
              console.log('授权成功')
            }
          });
        } else {
          console.log("yijingshouquan");
        }
      }
    })

    var res = wx.getSystemInfoSync();
    var that = this;
    this.globalData.windowWidth = res.windowWidth;
    this.globalData.windowHeight = res.windowHeight;


    //外部类
    this.globalData.qqmapsdk = new QQMapWX({
      key: 'A5EBZ-DCPK4-IFSU7-XIQGW-NJKPJ-2NFLM'
    });



    console.log('手机高度为 ' + res.windowHeight);
    console.log('手机宽度为 ' + res.windowWidth);


    console.log("发送请求");

    wx.login({
      success: function (res) {
        var code = res.code;
        console.log('code is ' + code);
        wx.getUserInfo({
          success: function (res) {
            console.log(res.rawData);
            that.globalData.rawData = JSON.parse(res.rawData);
            console.log(that.globalData.rawData);
            var iv = res.iv;
            console.log("Don't get storage");
            wx.request({
              url: 'https://40525433.fudan-mini-program.com/cgi-bin/Login',
              method: 'POST',
              data: {
                code: code,
                rawData: that.globalData.rawData,
                latitude: that.globalData.latitude,
                longitude: that.globalData.longitude,
              },
              success: function (res) {
                if (res.data.status == "ERROR") {
                  console.log(res.data.message);
                  wx.navigateTo({
                    url: '/pages/error/error',
                  })
                  return;
                }

                console.log(res.data.openid);
                console.log(res.data.registered);
                that.globalData.openid = res.data.openid;

                wx.redirectTo({
                  url: '/pages/activity/activity',
                  success: function () {
                    console.log("aaa");
                  }
                });
              }
            });
          }
        })
      }
    });
  },
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  }
  ,
  /**
   * 
   */
  globalData: {
    openid: '',
    windowWidth: '',
    windowHeight: '',
    rawData: {},
    latitude: 0.0,
    longitude: 0.0,
    qqmapsdk: {},
    qrcodeUrl: "",
    locationMap: {
      "房产小区": "resident",
      "教育学校": "school",
      "酒店宾馆": "hotel",
      "公司企业": "company",
      "购物": "mall",
      "美食": "restaurant",
      "娱乐休闲": "entertainment",
      "机构团体": "bureau",
      "银行金融": "bank",
      "生活服务": "living_service",
      "旅游景点": "tourism",
      "基础设施": "infra",
      "医疗保健": "hospital"
    }
  }

})

