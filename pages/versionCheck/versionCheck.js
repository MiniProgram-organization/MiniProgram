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
        tabbar:tabbar,
        currentPage:'天气'
      });
    }

    // 页面加载完毕
    this.setData({
      loading: true
    });
  },

  onShow:function(){
    // 这里占个空位，便于后面合并不被其他页面的onShow替代
  },


};

import activityObj from '../activity/activity.js';
import accountObj from '../account/account.js';
import discoverObj from '../discover/discover.js';

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

extend(data,activityData);
extend(data,accountData);
extend(data,discoverData);
versionCheck.data = data;

//把这些方法的 Onshow 都单独提取出来，在调用到switchTab的时候单独调用
var activityOnShow = activityObj.onShow;
var accountOnShow = accountObj.onShow;
var discoverOnShow = accountObj.onShow;

extend(versionCheck,activityObj);
extend(versionCheck,accountObj);
extend(versionCheck,discoverObj);

versionCheck["activityOnShow"] = activityOnShow;
versionCheck["accountOnShow"] = accountOnShow;
versionCheck["discoverOnShow"] = discoverOnShow;


//重写页面的OnShow，根据版本号决定调用哪一个onShow
versionCheck["onShow"] = function(){
  // 这里需要写一个阻塞函数，直到接受到版本号为止才能决定调用谁
  this.activityOnShow();
};

//重写页面的switchtab，在每次切换tab的时候调用对应的OnSHow
versionCheck["switchTab"] = function(e){
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
  if(page_name == "天气"){

  }else if(page_name == "活动"){
    this.activityOnShow();
  } else if (page_name == "心情"){

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
versionCheck["goToFriends"] = function(){
  if(this.data.version == 1){
    this.trueGoToFriends();
  }
}

Page(versionCheck);






