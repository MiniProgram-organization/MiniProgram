var app = getApp();

var activityObj = {
  data: {
    // 手机屏幕数据
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    
    // 位置信息
    latitude: "",
    longitude: "",

    //原始的历史记录
    checkins: [],  
    //分类之后的历史记录
    classifiedCheckIns: [], 
    // 签到历史的数量，位置数量，种类数量
    checkInTimes: 0,
    checkInPlaces: 0,
    checkInCategories: 0,

    //连续签到的奖励
    con_day: 0,
    less_day: 7,
    object_day: 7,
    award_text_1: "",
    award_text_2: "",

    //用户在不在国内
    inChina: 0,
    //用户周围的poi，主要用于地图渲染
    markers: [],
    include_points: [],

    // 用户授权按钮隐藏
    userInfoHidden: true,
  },

  /* 得到用户的位置，得到用户的账户信息，进行服务器登录，获取签到历史记录*/
  onShow: function () {
    console.log("[活动] onShow");
    /* 得到用户的位置，得到用户的账户信息，进行服务器登录，获取签到历史记录*/
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
  
  },

  /**
     * 版本1.4特有的部分：获取用户的身份信息
     */
  getOpenId: function () {
    console.log("[Activity] getOpenId");
    var that = this;
    var userInfoAuthorized = false;

    // 检查是否已经授权
    wx.getSetting({
      success(res) {
        console.log("[Auth Setting]");
        console.log(res);
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
              if (res.confirm) {
                console.log("[Activity] 用户同意了授权");
                // 同意了授权，显示真正的授权按钮
                that.setData({
                  userInfoHidden: false
                });
              } else {
                // 拒绝了授权，显示提示
                console.log("用户拒绝了身份信息授权");
                wx.showToast({
                  title: '为了您更好的体验,请先同意授权',
                  icon: 'none',
                  duration: 2000
                });
              }
            }
          })
        }
      }
    });




  },

  /**
   * 版本1.4中特有的部分：授权按钮的反应
   */
  getUserInfo: function (e) {
    // 确认授权后，得到用户信息，进行登录
    console.log(e);
    this.serverLogin();
    this.setData({
      userInfoHidden: true
    });

  },

  /**
   * 版本1.4中特有的部分：拿到用户的rawData之后进行服务器登录
   */
  serverLogin: function () {
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
                console.log(systemInfo);
                console.log(res);
                if (res.data.status == "ERROR") {
                  console.log(res.data.message);
                  wx.redirectTo({
                    url: '/pages/error/error',
                  })
                  return;
                }
                getApp().globalData.openid = res.data.openid;
                getApp().globalData.sessionid = res.data.sessionid;
                that.getCheckIns();
              }
            })
          }
        });
      }
    });
  },

  getCheckIns: function () {
    //获取历史数据
    var checkins = wx.getStorageSync('checkins');
    var oldDatetmp = wx.getStorageSync('timestamp_checkins');
    var oldDate = 0;
    var nowDate = (Date.parse(new Date()) / 1000);
    if (oldDatetmp == "") oldDate = 0;
    else oldDate = oldDatetmp;

    var that = this;
    if (checkins != "" && ((nowDate - oldDate) < 86400)) {
      this.setData({
        checkins: checkins
      });
      that.classifyByDate();
    } else {
      wx.request({
        url: 'https://40525433.fudan-mini-program.com/cgi-bin/History',
        data: {
          openid: getApp().globalData.openid,
          sessionid: getApp().globalData.sessionid,
        },
        method: 'POST',
        success: function (res) {
          if (res.data.status == "ERROR") {
            wx.showToast({
              title: '获取历史签到失败',
              icon: 'loading'
            })
          }
          else {
            wx.setStorageSync('timestamp_checkins', (Date.parse(new Date()) / 1000));
            for (var i = 0; i < res.data.checkins.length; i++) {
              res.data.checkins[i].date = res.data.checkins[i]['datetime'].split(" ")[0];
              res.data.checkins[i].time = res.data.checkins[i]['datetime'].split(" ")[1];
              //需要自行设置logoPath
              var category = res.data.checkins[i].category;
              res.data.checkins[i].logoPath = '../images/location/' + app.globalData.locationMap[category.split(":")[0]] + '.png';
              if (res.data.checkins[i].text != "") {
                res.data.checkins[i]['height_p'] = 80;
              }
              else res.data.checkins[i]['height_p'] = 65;
            }

            that.setData({
              checkins: res.data.checkins
            });
            wx.setStorageSync('checkins', res.data.checkins);
            // 对数据进行整理，方便展示
            that.classifyByDate();
          }
        }
      })

    }
  },

  classifyByDate: function () {
    var tempClassifyByDate = [];
    var that = this;
    var currentDate = '';
    var currentClass = {};


    //用字典的方法来统计签到的地点数和种类数
    var categoryDic = {};
    var placeDic = {};
    var districtDic = {};
    var checkInTimes = 0;
    var checkInCategories = 0;
    var checkInPlaces = 0;

    for (var i = 0; i < that.data.checkins.length; i++) {

      //出现新的日期，则增加新的一个date对象
      if (currentDate != that.data.checkins[i].date) {

        //如果上一个对象不为空(排除第一个的情况)，则把上一个对象塞入数组中
        if (currentClass.date) {
          tempClassifyByDate.push(currentClass);
        }
        currentClass = {};
        currentClass.date = that.data.checkins[i].date;
        currentDate = that.data.checkins[i].date;

        currentClass['checkInList'] = [];
      }

      //统计签到地点数，种类数，并将当前签到记录塞入
      checkInTimes += 1;
      if (!categoryDic[that.data.checkins[i].category.split(":")[0]]) {
        checkInCategories += 1;
        categoryDic[that.data.checkins[i].category.split(":")[0]] = 1;
      } else {
        categoryDic[that.data.checkins[i].category.split(":")[0]] += 1;
      }

      if (!that.data.checkins[i].district || that.data.checkins[i].district == "") {
        that.data.checkins[i].district = "未知";
      }
      if (!districtDic[that.data.checkins[i].district]) {
        districtDic[that.data.checkins[i].district] = 1;
      } else {
        districtDic[that.data.checkins[i].district] += 1;
      }

      if (!placeDic[that.data.checkins[i].POI_id]) {
        checkInPlaces += 1;
        placeDic[that.data.checkins[i].POI_id] = true;
      }
      currentClass['checkInList'].push(that.data.checkins[i]);
    }

    // 全局变量设置这些字典，便于画图
    getApp().globalData.categoryDic = categoryDic;
    getApp().globalData.placeDic = placeDic;
    getApp().globalData.districtDic = districtDic;

    //最后一个也需要塞入进去
    tempClassifyByDate.push(currentClass);

    this.setData({
      classifiedCheckIns: tempClassifyByDate,
      checkInTimes: checkInTimes,
      checkInPlaces: checkInPlaces,
      checkInCategories: checkInCategories
    });

    this.fetchData(1);

  },

  fetchData: function (cnt) {
    var that = this;
    this.setData({
      windowWidth: app.globalData.windowWidth,
      windowHeight: app.globalData.windowHeight
    });

    var oldDatetmp = wx.getStorageSync('timestamp_duration');
    var oldDate = 0;
    var nowDate = (Date.parse(new Date()) / 1000);
    if (oldDatetmp == "") oldDate = 0;
    else oldDate = oldDatetmp;

    var duration = wx.getStorageSync('duration_checkin');
    
    if (duration != "" && ((nowDate - oldDate) < 86400)) {
      this.setDuration(duration.data)
    } else {
      //如果没有缓存
      wx.request({
        url: 'https://40525433.fudan-mini-program.com/cgi-bin/Scores',
        method: 'POST',
        data: {
          openid: getApp().globalData.openid,
          sessionid: getApp().globalData.sessionid,
        },
        success: function (res) {
          if (res.data.status == "ERROR") {
            wx.showToast({
              title: '获取连续天数失败！',
              icon: 'loading'
            })
          }
          else {
            wx.setStorageSync('timestamp_duration', (Date.parse(new Date()) / 1000));
            wx.setStorageSync('duration_checkin',
              {
                data: res.data.duration_checkin
              });
            wx.setStorageSync('duration_weather', res.data.duration_weather);
            wx.setStorageSync('duration_mood', res.data.duration_mood);
            wx.setStorageSync('scores', res.data.scores);

            app.globalData.scores = res.data.scores;
            // 提醒用户连续签到的奖励
            that.setDuration(res.data.duration_checkin)
          }
        },
        fail: function (res) {
        }
      })
    }

    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        cnt = cnt + 1
        app.globalData.latitude = res.latitude;
        app.globalData.longitude = res.longitude;
        //存储一个缓存的经纬度,用于定位失败时使用
        wx.setStorageSync('latitude', res.latitude);
        wx.setStorageSync('longitude', res.longitude);
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        });

        wx.request({
          url: 'https://40525433.fudan-mini-program.com/cgi-bin/GetNation',
          method: 'POST',
          data: {
            latitude: res.latitude,
            longitude: res.longitude,
            openid: getApp().globalData.openid,
            sessionid: getApp().globalData.sessionid,
          },
          success: function (res) {
            console.log('nation...')
            console.log(res)
            if (res.data.status == 'OK') {
              if (res.data.nation == '中国') {
                wx.setStorageSync('inChina', 1)
                //渲染地图上的poi和用户位置
                that.useMap(1, that.data.latitude, that.data.longitude);
              }
              else {
                wx.setStorageSync('inChina', 0)
                // 好像什么都没做...
                that.useMap(0, that.data.latitude, that.data.longitude);
              }
            }
            else {
              wx.showToast({
                title: '获取经纬度国家信息失败！请检查定位设置',
              })
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '获取经纬度国家信息失败！请检查定位设置',
            })
          }

        })
      },
      fail: function (res) {
        console.log(res)
        if (res.errMsg == 'getLocation:fail auth deny') {
          wx.showModal({
            title: '提示',
            content: '不授权位置信息将无法正常使用卿云go!',
          })
          wx.openSetting({

          })
          return
        }


        // 如果用户不提供定位信息，就迭代执行这个函数，10次为上限
        cnt = cnt + 1
        if (cnt < 10) {
          that.fetchData(cnt)
        }else {
          var latitude = wx.getStorageSync('latitude')
          var longitude = wx.getStorageSync('longitude')
          if (latitude == "") {
            wx.showToast({
              title: '定位失败!请检查设置!',
              duration: 1000,
              icon: 'loading'
            })
          }
          else {
            wx.showToast({
              title: '定位失败!使用上次位置!',
              duration: 1000,
              icon: 'loading'
            })
            //使用缓存定位
            app.globalData.latitude = latitude;
            app.globalData.longitude = longitude;
            app.globalData.qqmapsdk.reverseGeocoder({
              location: {
                latitude: latitude,
                longitude: longitude
              },
              get_poi: 1,
              success: function (res) {
                console.log("附近POI");
                console.log(res.result.pois);
                var coordinates = res.result.pois;
                //marker数组
                var tempMarkers = [];
                var tempIncludePoints = [];
                tempMarkers.push({
                  latitude: that.data.latitude,
                  longitude: that.data.longitude,
                  iconPath: '../images/map/location.png',
                });

                for (var i = 0; i < coordinates.length; i++) {
                  var tempLatitude = coordinates[i].location.lat;
                  var tempLongitude = coordinates[i].location.lng;
                  var category = coordinates[i].category
                  var venue = coordinates[i].title;
                  var POI_id = coordinates[i].id;

                  tempMarkers.push({
                    POI_id: POI_id,
                    latitude: tempLatitude,
                    longitude: tempLongitude,
                    iconPath: '../images/map/dot.jpg',
                    category: category,
                    venue: venue
                  });
                  tempIncludePoints.push({
                    latitude: tempLatitude,
                    longitude: tempLongitude,
                  });
                }
                that.setData({
                  markers: tempMarkers,
                  include_points: tempIncludePoints
                });

              },
              fail: function () {

              }
            });
          }
        }
      }
    });


  },

  setDuration: function (duration) {
    console.log("[Activity] setDuration");
    console.log(duration);

    if (duration == 0) {
      this.setData({
        con_day: duration,
        object_day: object_day,
        less_day: object_day - duration,
        award_text_1: "已连续签到",
        award_text_2: "天了！还差" + 7 + "天就能获得额外积分奖励喔，加油~"
      })
    }
    else {
      if ((duration % 7 == 0) && ((duration % 28) != 0)) {
        if ((duration / 7) % 4 == 1) {
          this.setData({
            con_day: duration,
            award_text_1: "连续签到",
            award_text_2: "天了，真棒！\n又获得额外积分奖励啦~"
          })
        }
        else if ((duration / 7) % 4 == 2) {
          this.setData({
            con_day: duration,
            award_text_1: "连续签到",
            award_text_2: "天了，exciting！\n又获得额外积分奖励啦~"
          })
        }
        else if ((duration / 7) % 4 == 3) {
          this.setData({
            con_day: duration,
            award_text_1: "连续签到",
            award_text_2: "天了，amazing！\n又获得额外积分奖励啦~"
          })
        }
      }
      else if (duration % 28 == 0) {
        this.setData({
          con_day: duration,
          award_text_1: "连续签到",
          award_text_2: "天了，天啦噜！一份超值额外积分大礼砸中了你~"
        })
      }
      else if (duration % 7 != 0) {
        var object_day = (parseInt(duration / 7) + 1) * 7;

        if (object_day % 28 == 0) {
          this.setData({
            con_day: duration,
            object_day: object_day,
            less_day: object_day - duration,
            award_text_1: "已连续签到",
            award_text_2: "天了！还差" + (object_day - duration) + "天就能获得连续28天超值额外积分奖励喔，加油~"
          })
        }
        else {
          this.setData({
            con_day: duration,
            object_day: object_day,
            less_day: object_day - duration,
            award_text_1: "已连续签到",
            award_text_2: "天了！还差" + (object_day - duration) + "天就能获得额外积分奖励喔，加油~"
          })
        }
      }
    }
  },

  useMap: function (inChina, latitude, longitude) {
    var that = this;
    if (inChina == 1) {
      // 渲染周围的poi，和用户本身所在的点
      app.globalData.qqmapsdk.reverseGeocoder({
        location: {
          latitude: that.data.latitude,
          longitude: that.data.longitude,
        },
        coord_type: 1,
        get_poi: 1,
        success: function (res) {
          if (res.result.pois == undefined) {
            return;
          }
          var coordinates = res.result.pois;
          //marker数组
          var tempMarkers = [];
          var tempIncludePoints = [];
          tempMarkers.push({
            latitude: that.data.latitude,
            longitude: that.data.longitude,
            iconPath: '../images/map/location.png',
          });
          for (var i = 0; i < coordinates.length; i++) {
            var tempLatitude = coordinates[i].location.lat;
            var tempLongitude = coordinates[i].location.lng;
            var category = coordinates[i].category
            var venue = coordinates[i].title;
            var POI_id = coordinates[i].id;
            tempMarkers.push({
              POI_id: POI_id,
              latitude: tempLatitude,
              longitude: tempLongitude,
              iconPath: '../images/map/placeholder.png',
              category: category,
              venue: venue
            });

            tempIncludePoints.push({
              latitude: tempLatitude,
              longitude: tempLongitude,
            });
          }
          that.setData({
            markers: tempMarkers,
            include_points: tempIncludePoints
          });
        },
        fail: function (res) {

        }
      });
    }
    else {
      //用户在国外，什么都不做
    }
  },


  // 去签到页面和买地名页面
  redirectCheckIn: function () {
    
    var that = this;
    wx.navigateTo({
      url: '../checkin/checkin?markers='
    })
  },
  redirectBuySite: function(){
    wx.navigateTo({
      url: '../buysite/buysite?markers='
    })
  },


  
  //去那3个统计页面
  
  Todistrictsta: function () {
    var that = this;
    wx.navigateTo({
      url: '../districtsta/districtsta'
    })
  },
  Tocategorysta: function () {
    var that = this;
    wx.navigateTo({
      url: '../categorysta/categorysta'
    })
  },
  Toplacesta: function () {
    var that = this;
    wx.navigateTo({
      url: '../placesta/placesta'
    })
  },
  
  
  
  chooseLocation: function(options){
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        app.globalData.latitude = res.latitude;
        app.globalData.longitude = res.longitude;
        //存储一个缓存的经纬度,用于定位失败时使用
        wx.setStorageSync('latitude', res.latitude);
        wx.setStorageSync('longitude', res.longitude);

        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        });
        wx.setStorageSync('refresh_activity', 'no')
        console.log(wx.getStorageSync('refresh_activity')+'choose_now')
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  },


  //用户拖动地图，其实我们这里什么都没做
  regionchange(e) {
    // 地图发生变化的时候，获取中间点，也就是用户选择的位置
    if (e.type == 'end') {
      this.getLngLat()
    }
  }, 

  
  getLngLat: function (options) {

  },

  //点击地图上的marker
  markertap(e) {
    console.log(e)
  },

  

  
  // 孤岛函数，没有人调用执行它
  getPlaces: function(){
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/FrequentPOIs',
      method: 'POST',
      data: {
        openid: getApp().globalData.openid,
        place_num: 5,
        sessionid: getApp().globalData.sessionid,
      },
      success: function(res){
        if(res.data.status == "OK"){
          getApp().globalData.placeList = res.data.places
        }
      }
    })
  },
};


Page(activityObj);

export default activityObj;


