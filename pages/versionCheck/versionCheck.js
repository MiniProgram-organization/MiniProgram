
Page({

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

})