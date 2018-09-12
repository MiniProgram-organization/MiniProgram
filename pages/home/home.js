var app = getApp();
var versionCheck = {

  data: {
    loading: false,
    version: 0, //代表当前小程序的版本号，0为审核版本，1为上线版本
    userInfoHidden:true,
    currentPage: '活动',
    tabbar: {
      color: "#BFBFBF",
      selectedColor: "#0E7EE6",
      borderStyle: "black",
      backgroundColor: "#ffffff",
      list: [
        {
          text: "天气",
          iconPath: "../images/icon/weather.png",
          selectedIconPath: "../images/icon/weather_blue.png",
          selected: false
        },
        {
          text: "活动",
          iconPath: "../images/icon/flag.png",
          selectedIconPath: "../images/icon/flag_blue.png",
          selected: true
        },
        {
          text: "发现",
          iconPath: "../images/icon/discover.png",
          selectedIconPath: "../images/icon/discover_blue.png",
          selected: false
        },
        {
          text: "账号",
          iconPath: "../images/icon/account.png",
          selectedIconPath: "../images/icon/account_blue.png",
          selected: false
        }
      ],
      position: "bottom"
    }
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/Version',
      method: 'POST',
      data: {
        version_code: '0.97'
      },
      success: function (res) {
        console.log("[Home] onLoad ");
        console.log(res);

        if (res.data.status == 'OK') {
          if (res.data.version == 0) {
            that.setData({
              version: 0
            });
          } else if (res.data.version == 1) {
            that.setData({
              version: 1
            });
          }

          that.init();
        }
        else {
          console.log("[Home] error");
          wx.showToast({
            title: '读取版本错误!',
          });
        }
      },
      fail: function (res) {
        console.log(res);
        console.log("[Home] fail");
        wx.showToast({
          title: '读取版本错误!',
        });
      }
    })
  },

  onShow: function () {

  },

  init: function () {
    console.log("[Home] init");
    
    //根据version号决定显示内容
    var version = this.data.version;
    // 0 是审核版本, 1 是上线版本
    if (version == 0) {
      var list = [
        {
          text: "天气",
          iconPath: "../images/icon/weather.png",
          selectedIconPath: "../images/icon/weather_blue.png",
          selected: true
        }
      ];
      var tabbar = this.data.tabbar;
      tabbar.list = list;
      this.setData({
        tabbar: tabbar,
        currentPage: '天气'
      });
    }

    // 获取用户的openid和sessionid，在这些执行完毕后再执行对应界面的OnShow,在将加载中的页面去掉
   this.getOpenId();

    
  },

  getOpenId: function () {
    console.log("[Home] getOpenId");

    var that = this;
    var userInfoAuthorized = false;

    // 检查是否已经授权
    wx.getSetting({
      success(res) {
        userInfoAuthorized = res.authSetting['scope.userInfo'];
        if (userInfoAuthorized == true) {
          // 已经授权了，进行服务器登录
          that.serverLogin();
        } else {
          // 还未授权或者拒绝授权，显示授权按钮
          wx.showModal({
            title: '提醒',
            content: '卿云GO申请使用您的昵称、头像等信息',
            confirmText: "同意",
            cancelText: "拒绝",
            success(res) {
              console.log("[Home] 用户同意了授权");
              console.log(res);
              if (res.confirm) {
                // 同意了授权，显示真正的授权按钮
                that.setData({
                  userInfoHidden: false
                });
                console.log(that.data.userInfoHidden);
              } else {
                // 拒绝了授权，显示提示
                wx.showToast({
                  title: '为了您更好的体验,请先同意授权',
                  icon: 'none',
                  duration: 2000
                });

                //显示页面为发现
                var tabbar = that.data.tabbar;
                tabbar.list = [
                  {
                    text: "天气",
                    iconPath: "../images/icon/weather.png",
                    selectedIconPath: "../images/icon/weather_blue.png",
                    selected: false
                  },
                  {
                    text: "发现",
                    iconPath: "../images/icon/discover.png",
                    selectedIconPath: "../images/icon/discover_blue.png",
                    selected: true
                  }
                ];

                that.discoverOnShow();
                that.setData({
                  tabbar:tabbar,
                  currentPage:"发现",
                  loading: true
                });

              }
            }
          })
        }
      }
    });
  },

  getUserInfo: function (e) {
    console.log("[Home] getUserInfo");

    // 确认授权后，得到用户信息，进行登录
    this.serverLogin();
    this.setData({
      userInfoHidden: true
    });

  },

  serverLogin: function () {
    console.log("[Home] serverLogin");

    var that = this;
    var systemInfo = wx.getSystemInfoSync();

    wx.login({
      success: function (res) {
        var code = res.code;
        wx.getUserInfo({
          lang: 'zh_CN',
          success: function (res) {
            getApp().globalData.rawData = JSON.parse(res.rawData);
            var iv = res.iv;
            wx.request({
              url: 'https://40525433.fudan-mini-program.com/cgi-bin/Login',
              method: 'POST',
              data: {
                code: code,
                rawData: getApp().globalData.rawData,
                latitude: getApp().globalData.latitude,
                longitude: getApp().globalData.longitude,
                userSystemInfo: systemInfo,
              },
              success: function (res) {
                if (res.data.status == "ERROR") {
                  wx.redirectTo({
                    url: '/pages/error/error',
                  })
                  return;
                }
                getApp().globalData.openid = res.data.openid;
                getApp().globalData.sessionid = res.data.sessionid;
                
                // 执行对应页面的onShow
                if(that.data.version == 0){
                  that.weatherOnShow();
                }else{
                  that.activityOnShow();
                }

                // 页面加载完毕
                that.setData({
                  loading: true
                });
              }
            })
          }
        });
      }
    });
  },

  onShow: function () {
    // 这里占个空位，便于后面合并不被其他页面的onShow替代
  },


};

import activityObj from '../activity/activity.js';
import accountObj from '../account/account.js';
import discoverObj from '../discover/discover.js';
import weatherObj from '../weather/weather.js';

var extend = function (o, n) {
  for (var p in n) {
    // 如果是新的，就放进来；如果冲突，则保留原来的
    if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p)))
      o[p] = n[p];
  }
};

//把这些页面的object的data合并
var data = versionCheck.data;
var activityData = activityObj.data;
var accountData = accountObj.data;
var discoverData = discoverObj.data;
var weatherData = weatherObj.data;

extend(data, activityData);
extend(data, accountData);
extend(data, discoverData);
extend(data, weatherData);
versionCheck.data = data;

//把这些方法的 Onshow 都单独提取出来，在调用到switchTab的时候单独调用
var activityOnShow = activityObj.onShow;
var accountOnShow = accountObj.onShow;
var discoverOnShow = discoverObj.onShow;
var weatherOnShow = weatherObj.onShow;

extend(versionCheck, activityObj);
extend(versionCheck, accountObj);
extend(versionCheck, discoverObj);
extend(versionCheck, weatherObj);

versionCheck["activityOnShow"] = activityOnShow;
versionCheck["accountOnShow"] = accountOnShow;
versionCheck["discoverOnShow"] = discoverOnShow;
versionCheck["weatherOnShow"] = weatherOnShow;


//重写页面的OnShow，根据版本号决定调用哪一个onShow
versionCheck["onShow"] = function () {
  console.log("[Home] onShow");

  var activity_refresh = app.globalData.activity_refresh;
  var account_refresh = app.globalData.account_refresh;

  if (activity_refresh) {
    app.globalData.activity_refresh = false;
    this.activityOnShow();
  }


  if (account_refresh) {
    app.globalData.account_refresh = false;
    this.accountOnShow();
  }

};

//重写页面的switchtab，在每次切换tab的时候调用对应的OnSHow
versionCheck["switchTab"] = function (e) {
  console.log("[Home] switchTab");
  var page_name = e.currentTarget.dataset.t;
  console.log(page_name);
  //更改tabbar显示 
  //更改currentPage
  var tabbar_list = this.data.tabbar.list;
  for (var i = 0, length = tabbar_list.length; i < length; i++) {
    if (tabbar_list[i].text == page_name) {
      tabbar_list[i].selected = true;
    } else {
      tabbar_list[i].selected = false;
    }
  }
  var tabbar = this.data.tabbar;
  tabbar.list = tabbar_list;

  this.setData({
    tabbar: tabbar,
    currentPage: page_name
  });

  //根据点击tab的不同调用不同的OnShow
  if (page_name == "天气") {
    this.weatherOnShow();
  } else if (page_name == "活动") {
    this.activityOnShow();
  } else if (page_name == "发现") {
    this.discoverOnShow();
  } else if (page_name == "账号") {
    this.accountOnShow();
  }
};

/* 下面是一些界面的特殊处理 */
//发现页面的发现周围卿云GO用户，根据版本号不同显示不同
var discoverGoToFriend = discoverObj.goToFriends;
versionCheck["trueGoToFriends"] = discoverGoToFriend;
versionCheck["goToFriends"] = function () {
  if (this.data.version == 1) {
    this.trueGoToFriends();
  }
}

Page(versionCheck);






