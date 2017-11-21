// showpeople.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    qrcodeUrl: "",
    displayQrCode: "none",
    users: [],
    crown_url:'../images/showpeople/crown.png',
    king_user_name:'',
    king_user_icon:'',
    king_user_num:0,
    POI_name:'',
  },

  QRCode: function () {
    var that = this;
    this.setData({
      displayQrCode: "block"
    });
    console.log(that.data.qrcodeUrl);
    wx.downloadFile({
      url: that.data.qrcodeUrl,
      success: function (res) {
        console.log(res);
        var filePath = res.tempFilePath;
        console.log(filePath)
        console.log(filePath);
        wx.saveImageToPhotosAlbum({
          filePath: filePath,
          success: function (res) {
            console.log(res);
          },
          fail: function (res) {
            console.log("HHHHH");
            console.log(res.errMsg);
            wx.openSetting({
              success: function (settingdata) {
                console.log(settingdata)
                if (settingdata.authSetting['scope.writePhotosAlbum']) {
                  console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                }
                else {
                  console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                }
              }
            });
          }
        });
      },
      fail: function (res) {
        console.log("TTTT");
        console.log(res);
      }
    });
  },

  requestPoiHistory: function () {
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/Recent',
      method: 'POST',
      data: {
        POI_id: that.data.POI_id,
        user_num: 10 //查看最近在这里签到的用户数
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.status == "OK") {
          var numbers = res.data.user_num;
          var users = res.data.users;
          console.log("查看签到人数");
          console.log(users);
          that.setData({
            users: users
          });
        } else {
          wx.showToast({
            title: '获取消息失败',
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      POI_id: options.POI_id,
      POI_name: options.POI_name
    });
    that.getKingUser();
    that.requestPoiHistory();
    that.getQRCode();
  },
  getKingUser: function(){
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/FrequentUsers',
      method: 'POST',
      data: {
        POI_id: that.data.POI_id,
        user_num: 1
      },
      success: function (res) {
        that.setData({
          king_user_name:res.data.users[0].nickName,
          king_user_num: res.data.users[0].check_num,
          king_user_icon:res.data.users[0].avatarUrl
        })
      },
      fail: function(res){

      }
    })
  },
  requestMostUser: function(){
    var that = this;
    
  },

  getQRCode: function () {
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/QRCode',
      method: 'POST',
      data: {
        scene: "lsh",
        path: "pages/map/map",
        width: 430,
        auto_color: false,
        line_color: {
          "r": "0",
          "g": "255",
          "b": "0"
        }
      },
      success: function (e) {
        console.log(e.data);
        that.setData({
          qrcodeUrl: e.data.url
        });
      }
    })
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