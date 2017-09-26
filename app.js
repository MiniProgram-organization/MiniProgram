//app.js
var utils = require('./utils/utils.js');
var QQMapWX = require('./utils/qqmap-wx-jssdk.js');

App({
  /**
   * @brief 先检查是否还处于登录状态，如果成功直接进入主页，否则进行登录流程
   */
  onLaunch: function () {

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


    var registered = wx.getStorageSync("registered")
    if(registered){
      console.log("Successfully get storage");
      that.globalData.openid = wx.getStorageSync('openid');
      wx.redirectTo({
        url: '/pages/activity/activity',
        success: function () {
        }
      });
    }else{

    wx.login({
      success: function(res){
        var code = res.code;
        console.log('code is '+code);
        wx.getUserInfo({
          success: function(res){
            that.globalData.rawData = JSON.parse(res.rawData);
            console.log(that.globalData.rawData);
            var iv = res.iv;
            console.log("Don't get storage");
            wx.request({
              url: 'https://40525433.fudan-mini-program.com/cgi-bin/Login',
              method:'POST',
              data:{
                code: code
              },
              success: function(res){
                if (res.data.status=="ERROR"){
                  console.log(res.data.message);
                  wx.navigateTo({
                    url: '/pages/error/error',
                  })
                  return;
                }
               
                console.log(res.data.openid);
                console.log(res.data.registered);
                that.globalData.openid = res.data.openid;
                
                if(res.data.registered==true){
                  console.log('registered');
                
                  wx.setStorageSync('registered', 'OK');
                  wx.setStorageSync('openid', res.data.openid);
                  wx.redirectTo({
                    url: '/pages/activity/activity',
                    success: function(){
                      console.log("aaa");
                    }
                  });
                  
                }else{
                  console.log("Not registered");
                  wx.redirectTo({
                    url: '/pages/register/register',
                    success:function(){
                      console.log("bbb");
                    }
                  });
                }
              }
            });

            
          }
        }) 
      }
    });
    }
    
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
    qqmapsdk: {}
  }

})

