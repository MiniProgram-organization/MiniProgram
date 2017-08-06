//app.js
var utils = require('./utils/utils.js');
App({
  /**
   * @brief 先检查是否还处于登录状态，如果成功直接进入主页，否则进行登录流程
   */
  onLaunch: function () {
    var res = wx.getSystemInfoSync();
    var that = this;
    this.globalData.windowWidth = res.windowWidth;
    this.globalData.windowHeight = res.windowHeight;

    console.log('手机高度为 ' + res.windowHeight);
    console.log('手机宽度为 ' + res.windowWidth);


    console.log("发送请求");
  
    wx.login({
      success: function(res){
        var code = res.code;
        console.log('code is '+code);
        wx.getUserInfo({
          success: function(res){
            that.globalData.rawData = res.rawData;
            var iv = res.iv;
            wx.request({
              url: 'https://40525433.fudan-mini-program.com/cgi-bin/Login',
              method:'POST',
              data:{
                code: code
              },
              success: function(res){
                console.log(res.data.openid);
                console.log(res.data.registered);
                that.globalData.openid = res.data.openid;
                
                if(res.data.registered==true){
                  console.log('registered');
                  wx.redirectTo({
                    url: '/pages/map/map',
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
    rawData: ''
  }

})

