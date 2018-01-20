// pages/chooseArea/chooseArea.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'城市',
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    showList:[],
    level:-1,
    selectedName:'',
    parent:'',
    in_china:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      showList: [{
          id:0,
          name:'中国'
        },{
          id: 1,
          name: '世界'
        }
      ]
    })


    /*
      var preCityList = wx.getStorageSync('cityList');
      var that = this;
      if (preCityList == ""){
        wx.request({
          url: 'https://40525433.fudan-mini-program.com/cgi-bin/City',
          method: 'POST',
          data: {
            //in_china:1,
            openid: getApp().globalData.openid,
            sessionid: getApp().globalData.sessionid,
            level:0
          },
          success: function (res) {
            var tmpShowList = []
            tmpShowList.push({
              id: 0,
              name: '默认位置'
            })
            for (var i = 0; i < res.data.cities.length; i++){
              tmpShowList.push({
                id:i+1,
                name: res.data.cities[i]
              })
            }
            wx.setStorageSync('cityList', tmpShowList)
            that.setData({
              showList: tmpShowList
            })
          },
          fail: function(res){
          }
        })
      }
      else{
        that.setData({
          showList: preCityList
        })
      }*/
  },
  listListener: function(e){
    console.log(this.data.level)
    console.log("level")
    this.setData({
      parent: this.data.selectedName,
      selectedName: this.data.showList[e.currentTarget.id].name
    })
    if(this.data.level == 0){
      if (e.currentTarget.id == 0){
        wx.navigateBack();
      }
      else this.queryCity(this.data.in_china);
    }
    else if(this.data.level == 1){
      this.queryArea(this.data.in_china);
    }
    else if(this.data.level == 2){
      this.goToWeather(this.data.in_china);
    }
    else if(this.data.level == -1){
      if (e.currentTarget.id == 0) {
        var preCityList = wx.getStorageSync('cityList_inchina');
        var that = this;
        if (preCityList == "") {
          wx.request({
            url: 'https://40525433.fudan-mini-program.com/cgi-bin/City',
            method: 'POST',
            data: {
              in_china:1,
              openid: getApp().globalData.openid,
              sessionid: getApp().globalData.sessionid,
              level: 0
            },
            success: function (res) {
              var tmpShowList = []
              tmpShowList.push({
                id: 0,
                name: '默认位置'
              })
              for (var i = 0; i < res.data.cities.length; i++) {
                tmpShowList.push({
                  id: i + 1,
                  name: res.data.cities[i]
                })
              }
              wx.setStorageSync('cityList_inchina', tmpShowList)
              that.setData({
                showList: tmpShowList,
                level:0,
                in_china:1
              })
            },
            fail: function (res) {
            }
          })
        }
        else {
          that.setData({
            showList: preCityList,
            level:0,
            in_china:1
          })
        }
      }
      else if(e.currentTarget.id == 1){
        var preCityList = wx.getStorageSync('cityList_outchina');
        var that = this;
        if (preCityList == "") {
          wx.request({
            url: 'https://40525433.fudan-mini-program.com/cgi-bin/City',
            method: 'POST',
            data: {
              in_china: 0,
              openid: getApp().globalData.openid,
              sessionid: getApp().globalData.sessionid,
              level: 0
            },
            success: function (res) {
              var tmpShowList = []
              console.log(res)
              tmpShowList.push({
                id: 0,
                name: '默认位置'
              })
              for (var i = 0; i < res.data.cities.length; i++) {
                tmpShowList.push({
                  id: i + 1,
                  name: res.data.cities[i]
                })
              }
              wx.setStorageSync('cityList_outchina', tmpShowList)
              that.setData({
                showList: tmpShowList,
                level: 0,
                in_china:0
              })
            },
            fail: function (res) {
            }
          })
        }
        else {
          that.setData({
            showList: preCityList,
            level: 0,
            in_china:0
          })
        }
      }
    }
  },
  goToWeather: function(in_china){
    var that = this;
    wx.setStorageSync('weatherCity', [this.data.selectedName, this.data.parent])
    wx.navigateBack();
  },
  queryCity: function (in_china) {
    console.log(this.data.selectedName)
    var tmplevel = 1;
    var that = this;
    if (this.data.selectedName == '北京' || this.data.selectedName == '上海'
      || this.data.selectedName == '天津' || this.data.selectedName == '重庆')
      tmplevel = 2;
    var preList = wx.getStorageSync(this.data.selectedName)

    if (in_china == 0){
      tmplevel = 2;
    }
    if(preList == "")
    {
      var that = this;
        console.log('无区域缓存..需要向服务器获取')
        wx.request({
          url: 'https://40525433.fudan-mini-program.com/cgi-bin/City',
          method: 'POST',
          data: {
            in_china: in_china,
            level: 1,
            query: that.data.selectedName,
            openid: getApp().globalData.openid,
            sessionid: getApp().globalData.sessionid,
          },
          success: function (res) {
            console.log(res)
            var tmpShowList = []
            for (var i = 0; i < res.data.cities.length; i++) {
              tmpShowList.push({
                id: i,
                name: res.data.cities[i]
              })
            }
            wx.setStorageSync(that.data.selectedName, tmpShowList);
            that.setData({
              showList: tmpShowList,
              level: tmplevel
            })

          },
          fail: function (res) {
            console.log(data)
            console.log(res)
          }
        })
    }
    else{
        //有缓存
      that.setData({
        showList: preList,
        level:tmplevel
      })
    }
  },
  queryArea: function(in_china){
    var preList = wx.getStorageSync(this.data.selectedName)
    if (preList == "") {
      console.log('无区域缓存..需要向服务器获取')
      var that = this;
      wx.request({
        url: 'https://40525433.fudan-mini-program.com/cgi-bin/City',
        method: 'POST',
        data: {
          in_china:in_china,
          level: 2,
          query: that.data.selectedName,
          openid: getApp().globalData.openid,
          sessionid: getApp().globalData.sessionid,
        },
        success: function (res) {
          console.log(that.data.selectedName)
          console.log(in_china)
          console.log(res)
          var tmpShowList = []
          for (var i = 0; i < res.data.cities.length; i++) {
            tmpShowList.push({
              id: i,
              name: res.data.cities[i]
            })
          }
          wx.setStorageSync(that.data.selectedName, tmpShowList);
          that.setData({
            showList: tmpShowList,
            level: 2
          })
        },
        fail: function (res) {
        }
      })
    }
    else {
      var that = this;
      //有缓存
      that.setData({
        showList: preList,
        level:2
      })
    }
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