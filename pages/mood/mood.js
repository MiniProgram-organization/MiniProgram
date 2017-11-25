// pages/mood/mood.js
var app = getApp();
var mood =[{
    "icon": "../images/mood/0.png",
    "text": "狂喜 ꉂ(ˊᗜˋ*)	"
  },{
    "icon": "../images/mood/1.png",
    "text": "开心 (⁎˃ᴗ˂⁎)"
  },{
    "icon": "../images/mood/2.png",
    "text": "放松 ✧( •˓◞•̀ )"
  },{
    "icon": "../images/mood/3.png",
    "text": "平静 ʕ·ᴥ·ʔ"
  },{
    "icon": "../images/mood/4.png",
    "text": "低落 눈_눈"
  },{
    "icon": "../images/mood/5.png",
    "text": "焦虑 ⚆_⚆"
  },{
    "icon": "../images/mood/6.png",
    "text": "生气 (-᷅_-᷄)"
  },{
    "icon": "../images/mood/7.png",  //之后替换图片
    "text": "其他"
  }]
Page({
  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    latitude: "",
    longitude: "",
    moodTimes: 0,
    mood:mood,
    moodId: 0,
    history_mood:[],
    classifiedMoods:[],
    con_day: 0,
    less_day: 7,
    object_day: 7,
    award_text_1: "",
    award_text_2: "",
  },
  bindChange: function (e) {
    this.moodId = e.detail.value;
    console.log(e.detail.value);
    this.setData({mood: mood,})
  },
  goToMoodStatistics: function () {
    wx.navigateTo({
      url: '../moodstatistics/moodstatistics'
    })
  },
  goToRecordMood: function(){
    if (this.moodId == 7){
      wx.navigateTo({
        url: '../otherMood/otherMood?moodId='+this.moodId
      })
    }
    else{
      wx.navigateTo({
        url: '../recordmood/recordmood?moodId='+this.moodId
      })
    }
  },
  classifyByDate: function () {
    var that = this;
    var tempClassifyByDate = [];
    var currentDate = '';
    var currentClass = {};
    for (var i = 0; i < this.data.history_mood.length; i++) {
      
      var tempData = this.data.history_mood[i].datetime.substring(0,10);  
      if (currentDate != tempData){
        if (currentClass.date) tempClassifyByDate.push(currentClass);
        currentClass = {};
        currentClass.date = tempData;
        currentDate = tempData;
        currentClass['moodList'] = [];
      }
      currentClass['moodList'].push(this.data.history_mood[i]);
      console.log(currentClass+'..')
    }
    tempClassifyByDate.push(currentClass);
    console.log(tempClassifyByDate)
    this.setData({classifiedMoods: tempClassifyByDate,});
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.moodId = 0;
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
    var duration = wx.getStorageSync('duration_mood');
    if (duration == "") {
      this.setData({
        con_day: 0,
        less_day: 7,
        object_day: 7,
        award_text_1: "已连续记录心情",
        award_text_2: "天了！还差7天就能获得额外积分奖励喔，加油~"
      })
    }
    else {
      if ((duration % 7 == 0) && ((duration % 28) != 0)) {
        if ((duration / 7) % 4 == 1) {
          this.setData({
            con_day: duration,
            award_text_1: "连续记录心情",
            award_text_2: "天了，真棒！\n又获得额外积分奖励啦~"
          })
        }
        else if ((duration / 7) % 4 == 2) {
          this.setData({
            con_day: duration,
            award_text_1: "连续记录心情",
            award_text_2: "天了，exciting！\n又获得额外积分奖励啦~"
          })
        }
        else if ((duration / 7) % 4 == 3) {
          this.setData({
            con_day: duration,
            award_text_1: "连续记录心情",
            award_text_2: "天了，amazing！\n又获得额外积分奖励啦~"
          })
        }
      }
      else if (duration % 28 == 0) {
        this.setData({
          con_day: duration,
          award_text_1: "连续记录心情",
          award_text_2: "天了，天啦噜！一份超值额外积分大礼砸中了你~"
        })
      }
      else if (duration % 7 != 0) {
        var object_day = (parseInt(duration / 7) + 1) * 7;
        console.log(object_day)
        if (object_day % 28 == 0) {
          this.setData({
            con_day: duration,
            object_day: object_day,
            less_day: object_day - duration,
            award_text_1: "已连续记录心情",
            award_text_2: "天了！还差" + (object_day - duration) + "天就能获得连续28天超值额外积分奖励喔，加油~"
          })
        }
        else {
          this.setData({
            con_day: duration,
            object_day: object_day,
            less_day: object_day - duration,
            award_text_1: "已连续记录心情",
            award_text_2: "天了！还差" + (object_day - duration) + "天就能获得额外积分奖励喔，加油~"
          })
        }
      }
    }
    //获取历史数据
    var history_mood = wx.getStorageSync('history_mood');
    var that = this;
    if (history_mood != "") {
      this.setData({history_mood: history_mood});
      this.classifyByDate();
    }
    else{
      wx.request({
          url: 'https://40525433.fudan-mini-program.com/cgi-bin/MoodHistory',
          data:{
            openid: app.globalData.openid,
          },
          method: 'POST',
          success: function (res) {
            console.log(res)
            var temp_history_mood = [];
            for (var i = 0; i < res.data.moods.length; i++){
              var temp_table = {}
              temp_table = res.data.moods[i];
              temp_table['simpletime'] = res.data.moods[i].datetime.substring(11, 19)
              temp_table['logoPath'] = '../images/mood/'+res.data.moods[i].mood_id+'.png';
              temp_history_mood.push(temp_table);
            }
            that.setData({
              history_mood: temp_history_mood,
            });
            wx.setStorageSync('history_mood', temp_history_mood);
            console.log(wx.getStorageSync('history_mood'))
            that.classifyByDate();
          }
      })
    }
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