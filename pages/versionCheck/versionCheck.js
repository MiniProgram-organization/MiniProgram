var app = getApp();
var versionCheck = {

  data: {
    loading:false,
    version: 0, //代表当前小程序的版本号，0为审核版本，1为上线版本
    currentPage:'活动',
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
          text: "心情",
          iconPath: "../images/icon/heart.png",
          selectedIconPath: "../images/icon/heart_blue.png",
          selected: false
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
        console.log("[VersionCheck] onShow ");
        console.log(res);

        if (res.data.status == 'OK') {
          if (res.data.version == 0) {
            that.setData({
              version: 1
            });
          } else if (res.data.version == 1) {
            that.setData({
              version: 1
            });
          }

          that.init();
        }
        else {
          console.log("[response] error");
          wx.showToast({
            title: '读取版本错误!',
          });
        }
      },
      fail: function (res) {
        console.log("[response] fail");
        wx.showToast({
          title: '读取版本错误!',
        });
      }
    })
  },

  onShow: function () {

  },

  init:function(){
    //根据version号决定显示内容
    var version = this.data.version;
    // 0 是审核版本, 1 是上线版本
    if(version == 0){
      var list = [
        {
          text: "天气",
          iconPath: "../images/icon/weather.png",
          selectedIconPath: "../images/icon/weather_blue.png",
          selected: true
        },
        {
          text: "发现",
          iconPath: "../images/icon/discover.png",
          selectedIconPath: "../images/icon/discover_blue.png",
          selected: false
        }
      ];
      var tabbar = this.data.tabbar;
      tabbar.list = list;
      this.setData({
        tabbar:tabbar
      });
    }

    // 页面加载完毕
    this.setData({
      loading: true
    });
  },

  switchTab:function(e){
    var page_name = e.currentTarget.dataset.t;
    //更改tabbar显示 
    //更改currentPage
    var tabbar_list = this.data.tabbar.list;
    for(var i = 0,length = tabbar_list.length;i<length;i++){
      if(tabbar_list[i].text == page_name){
        tabbar_list[i].selected = true;
      }else{
        tabbar_list[i].selected = false;
      }
    }
    var tabbar = this.data.tabbar;
    tabbar.list = tabbar_list;

    this.setData({
      tabbar:tabbar,
      currentPage:page_name
    });
    
  },
};

import activityObj from '../activity/activity.js';

var extend = function (o, n) {
  for (var p in n) {
    // 如果是新的，就放进来；如果冲突，则保留原来的
    if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p)))
      o[p] = n[p];
  }
}; 

//把这些页面的object的data合并，方法合并，但是通用方法必须要单独写
var data = versionCheck.data;
var activityData = activityObj.data;
extend(data,activityData);
versionCheck.data = data;

extend(versionCheck,activityObj);

versionCheck["onShow"] = function(){
  wx.getSetting({
    success(res) {
      console.log(res)
      if (!res.authSetting['scope.userLocation']) {

        wx.authorize({
          scope: 'scope.userLocation',
          success() {
            console.log('授权成功')
          },
          fail(res) {
            wx.showModal({
              title: '提示',
              content: '不授权位置信息将无法正常使用卿云go!',
            })
            wx.openSetting({
            })
          }
        });
      }
      else if (res.authSetting['scope.userLocation'] == false) {
        wx.showToast({
          title: '提示:不授权位置信息将无法正常使用卿云go!',
        })
        wx.openSetting({
        })
      }
      else {
        console.log("yijingshouquan");
      }
    }
  })


  if (app.globalData.openid == "") {
    this.getOpenId();
  } else {
    this.getCheckIns();
  }

  console.log('activity........!!!!!!!!!!!!!')
  console.log(this.data.checkins);
  console.log(this.data.classifiedCheckIns);
};

Page(versionCheck);






