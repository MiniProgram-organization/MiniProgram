



module.exports = {
  getOpenId: getOpenId,
  register: register,
  queryProximity: queryProximity
}


// 获取时间
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}



/*@brief 每次向服务器请求的时候，需要确保我们有用户的openid，所以要维护用户的登录状态，
 *@return true: 用户已经注册过手机
 *        false： 用户没有注册过手机，跳转到注册界面去
 * */


function getOpenId() {
  wx.login({
    success: function (res) {
      var code = res.code;
      console.log(res);
      wx.getUserInfo({
        success: function (res) {
          console.log(res.rawData);
          wx.request({
            /*TODO 发送用户信息，换取openid*/
            url: 'https://88856376.qcloud.la',
            method: 'POST',
            data: {
              /*fucking加密，直接裸奔数据，青鸟林直接存数据库就好了*/
              code: code,
              rawData: res.rawData,
            },
            success: function (res) {
              getApp().globalData.openid = res.data.openid;
              if (!res.data.registered){
                wx.redirectTo({
                  url: "/pages/register/register",
                  success: function () {
                    console.log("成功跳转到注册界面");
                  },
                  fail: function () {
                    console.log("跳转注册界面失败");
                  }
                });
              }
            },
            fail: function () {
              console.log('上传个人数据失败');
            }
          });
        },
        fail: function () {
          console.log('wx.getUserInfo()失败');
        }
      });
    },
    fail: function () {
      console.log('wx.login()失败');
    }
  });
};


function register(info) {
  var user = info.user;
  var phone = info.phone;
  console.log(info);
  var rawData = info.rawData;
  var openid = info.openid;
  wx.request({
    url: 'https://40525433.fudan-mini-program.com/cgi-bin/Register',
    method: 'POST',
    data: {
      rawData: rawData,
      openid: openid,
    },
    success: function (res) {
      if (res.data.status == "OK") {
        wx.showToast({
          title: '注册成功',
          icon: 'success'
        });
        wx.setStorageSync('registered', 'OK');
        wx.switchTab({
          url: '../map/map',
        })
      } else {
        wx.showToast({
          title: '注册失败',
          icon: 'loading',
          duration: 2000
        });
        console.log('服务器端注册失败');
        console.log(res.data.message);
      }
    },
    fail: function () {
      wx.showToast({
        title: '注册失败',
        icon: 'loading',
        duration: 2000
      });
      console.log('发送注册请求失败');
    }
  });
}


function queryProximity(latitude, longitude) {


      wx.request({
        url: 'https://40525433.fudan-mini-program.com/cgi-bin/Search',
        method: 'POST',
        data: {
          latitude: latitude,
          longitude: longitude,
          openid: getApp().globalData.openid
        },
        success: function (res) {
          var coordinates = res.data.coordinates;  //经纬度坐标数组
          if (coordinates) {
            console.log("位置坐标为:" + coordinates);
            return coordinates;
          } else {
            console.log("未收到青鸟林的附近位置坐标");
          }
        },
        fail: function () {
          console.log('发送位置失败');
        }
      });

}


