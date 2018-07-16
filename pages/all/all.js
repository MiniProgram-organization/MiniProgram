// pages/all/all.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_page:"天气",
    tabbar: {
      color: "#BFBFBF",
      selectedColor: "#0E7EE6",
      borderStyle: "black",
      backgroundColor: "#ffffff",

      list: [
        {
          pagePath: "/pages/weather/weather",
          text: "天气",
          iconPath: "../images/icon/weather.png",
          selectedIconPath: "../images/icon/weather_blue.png",
          selected: true
        },
        {
          pagePath: "/pages/activity/activity",
          text: "活动",
          iconPath: "../images/icon/flag.png",
          selectedIconPath: "../images/icon/flag_blue.png",
          selected: false
        },
        {
          pagePath: "/pages/mood/mood",
          text: "心情",
          iconPath: "../images/icon/heart.png",
          selectedIconPath: "../images/icon/heart_blue.png",
          selected: false
        },
        {
          pagePath: "/pages/discover/discover",
          text: "发现",
          iconPath: "../images/icon/discover.png",
          selectedIconPath: "../images/icon/discover_blue.png",
          selected: false
        },
        {
          pagePath: "/pages/account/account",
          text: "账号",
          iconPath: "../images/icon/account.png",
          selectedIconPath: "../images/icon/account_blue.png",
          selected: false
        }
      ],
      position: "bottom"
    }
  
  },

  /* 点击tabbar切换页面 */
  changePage:function(e){
    console.log("[ALL] changePage: ");
    var page_id = e.currentTarget.id;

    var tabbar = this.data.tabbar;
    var selected_page = "";
    for (var i in tabbar.list){
      if (i == page_id) {
        tabbar.list[i].selected = true;
        selected_page = tabbar.list[i].text;
      } else {
        tabbar.list[i].selected = false;
      }
    }

    this.setData({
      current_page:selected_page,
      tabbar:tabbar,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var version = app.globalData.version;
    if(version == 0){
      console.log("[ALL] onShow");
      this.setData({
        tabbar:{
          color: "#BFBFBF",
          selectedColor: "#0E7EE6",
          borderStyle: "black",
          backgroundColor: "#ffffff",

          list: [
            {
              pagePath: "/pages/weather/weather",
              text: "天气",
              iconPath: "../images/icon/weather.png",
              selectedIconPath: "../images/icon/weather_blue.png",
              selected: true
            },
            {
              pagePath: "/pages/discover/discover",
              text: "发现",
              iconPath: "../images/icon/discover.png",
              selectedIconPath: "../images/icon/discover_blue.png",
              selected: false
            }
          ],
          position: "bottom"
        }
      });
    }
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

})