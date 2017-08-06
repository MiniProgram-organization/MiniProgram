var utils = require('../../utils/utils.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: '',
    windowHeight: '',
    markers: [],
    longitude: '',
    latitude: '',
    actionSheetHidden: true,
    actionSheetItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("获取openid" + app.globalData.openid);
    this.setData({
      windowWidth: app.globalData.windowWidth,
      windowHeight: app.globalData.windowHeight
    });
    console.log('当前宽度' + this.data.windowWidth);
    console.log('当前高度' + this.data.windowHeight);

    wx.getLocation({
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        console.log(res);
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.setData({
          latitude: latitude,
          longitude: longitude,
        });
        
        wx.request({
          url: 'https://40525433.fudan-mini-program.com/cgi-bin/Search',
          method: 'POST',
          data: {
            latitude: latitude,
            longitude: longitude,
            openid: getApp().globalData.openid
          },
          success: function (res) {
            console.log("hhh"); //DELETE
            var coordinates = res.data.coordinates;  //经纬度坐标数组
            if (coordinates) {
              console.log("位置坐标为:" + coordinates);

               /*tempMarkers作为数据中转*/


              //先加入中心位置 
              var tempMarkers = [{
                latitude: latitude,
                longitude: longitude,
                iconPath: '../images/mapicon.jpg'
              }];

              var actionSheetItemsTemp = []

              for (var i = 0; i < coordinates.length; i++) {
                var tempLatitude = coordinates[i].latitude;
                var tempLongitude = coordinates[i].longitude;
                var category = coordinates[i].category;
                var venue = coordinates[i].venue;
                var POI_id = coordinates[i].POI_id;

                actionSheetItemsTemp.push({
                  POI_id: POI_id,
                  venue: venue
                });



                tempMarkers.push({
                  POI_id: POI_id,
                  latitude: tempLatitude,
                  longitude: tempLongitude,
                  iconPath: '../images/' + category + '.jpg',
                  venue: venue
                });
              }
              console.log(tempMarkers);
              console.log(actionSheetItemsTemp);

              that.setData({
                actionSheetItems: actionSheetItemsTemp
              });

              that.setData({
                markers: tempMarkers
              });
            } else {
              console.log("未收到青鸟林的附近位置坐标");
            }
          },
          fail: function () {
            console.log('发送位置失败');
          }
        });

        



       
        



        /*TODO 后期的一些高级操作需要我们调用腾讯地图的自带功能，这里暂时不需要*/
        // wx.openLocation({
        //   latitude: latitude,
        //   longitude: longitude,
        //   scale: 28
        // })
      }
    });
  },

  checkIn: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
    


  },

  actionSheetChange: function(e){
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },


  bindItemTap: function(e){
    var that = this;
    console.log("选择的内容为：");
    console.log(e.currentTarget.dataset.name);
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/CheckIn',
      method: 'POST',
      data: {
        openid: getApp().globalData.openid,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        POI_id: e.currentTarget.dataset.name  
      },
      success: function(e){
        if( e.data.status == "OK" ){
          console.log("签到成功");
        }
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