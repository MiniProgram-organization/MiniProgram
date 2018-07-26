// pages/mood/mood.js
var app = getApp();
var moodObj = {
  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.windowWidth,
    windowHeight: app.globalData.windowHeight,
    latitude: "",
    longitude: "",

    moodTimes: 0,
    mood: [{
      "icon": "../images/mood/0.png",
      "text": "狂喜 ꉂ(ˊᗜˋ*)	"
    }, {
      "icon": "../images/mood/1.png",
      "text": "开心 (⁎˃ᴗ˂⁎)"
    }, {
      "icon": "../images/mood/2.png",
      "text": "放松 ✧( •˓◞•̀ )"
    }, {
      "icon": "../images/mood/3.png",
      "text": "平静 ʕ·ᴥ·ʔ"
    }, {
      "icon": "../images/mood/4.png",
      "text": "低落 눈_눈"
    }, {
      "icon": "../images/mood/5.png",
      "text": "焦虑 ⚆_⚆"
    }, {
      "icon": "../images/mood/6.png",
      "text": "生气 (-᷅_-᷄)"
    }, {
      "icon": "../images/mood/7.png",  //之后替换图片
      "text": "其他"
    }],
    moodId: 0,
    history_mood:[],
    classifiedMoods:[],

    mood_con_day: 0,
    mood_less_day: 7,
    mood_object_day: 7,
    mood_award_text_1: "",
    mood_award_text_2: "",

    hasEmptyGrid: false,
    showPickerMood: false,
    classifiedMoods: {},
    mood_logo_dic: {

      0: 'orange-bg', //橙色
      1: 'pink-bg', //粉红色
      2: 'green-bg', //绿色
      3: 'blue-bg', //平静
      4: 'grey-bg',// 灰色
      5: 'brown-bg',//棕色
      6: 'red-bg', //生气
      100: ''//无色
    }
  },

  
  goToRecordMood_7: function(){
      wx.navigateTo({
        url: '../otherMood/otherMood?moodId=7'
      })
  },
  goToRecordMood_0: function () {
      wx.navigateTo({
        url: '../recordmood/recordmood?moodId=0'
      })
  },
  goToRecordMood_1: function () {
    wx.navigateTo({
      url: '../recordmood/recordmood?moodId=1' 
    })
  },
  goToRecordMood_2: function () {
    wx.navigateTo({
      url: '../recordmood/recordmood?moodId=2'
    })
  },
  goToRecordMood_3: function () {
    wx.navigateTo({
      url: '../recordmood/recordmood?moodId=3'
    })
  },
  goToRecordMood_4: function () {
    wx.navigateTo({
      url: '../recordmood/recordmood?moodId=4'
    })
  },
  goToRecordMood_5: function () {
    wx.navigateTo({
      url: '../recordmood/recordmood?moodId=5'
    })
  },
  goToRecordMood_6: function () {
    wx.navigateTo({
      url: '../recordmood/recordmood?moodId=6'
    })
  },
  


  onShow: function () {
    console.log("[心情] onShow");
    var duration = wx.getStorageSync('duration_mood');
    if (duration == "") {
      this.setData({
        mood_con_day: 0,
        mood_less_day: 7,
        mood_object_day: 7,
        mood_award_text_1: "已连续记录心情",
        mood_award_text_2: "天了！还差7天就能获得额外积分奖励喔，加油~"
      })
    }
    else {
      if ((duration % 7 == 0) && ((duration % 28) != 0)) {
        if ((duration / 7) % 4 == 1) {
          this.setData({
            mood_con_day: duration,
            mood_award_text_1: "连续记录心情",
            mood_award_text_2: "天了，真棒！\n又获得额外积分奖励啦~"
          })
        }
        else if ((duration / 7) % 4 == 2) {
          this.setData({
            mood_con_day: duration,
            mood_award_text_1: "连续记录心情",
            mood_award_text_2: "天了，exciting！\n又获得额外积分奖励啦~"
          })
        }
        else if ((duration / 7) % 4 == 3) {
          this.setData({
            mood_con_day: duration,
            mood_award_text_1: "连续记录心情",
            mood_award_text_2: "天了，amazing！\n又获得额外积分奖励啦~"
          })
        }
      }
      else if (duration % 28 == 0) {
        this.setData({
          mood_con_day: duration,
          mood_award_text_1: "连续记录心情",
          mood_award_text_2: "天了，天啦噜！一份超值额外积分大礼砸中了你~"
        })
      }
      else if (duration % 7 != 0) {
        var mood_object_day = (parseInt(duration / 7) + 1) * 7;
        if (mood_object_day % 28 == 0) {
          this.setData({
            mood_con_day: duration,
            mood_object_day: mood_object_day,
            mood_less_day: mood_object_day - duration,
            mood_award_text_1: "已连续记录心情",
            mood_award_text_2: "天了！还差" + (mood_object_day - duration) + "天就能获得连续28天超值额外积分奖励喔，加油~"
          })
        }
        else {
          this.setData({
            mood_con_day: duration,
            mood_object_day: mood_object_day,
            mood_less_day: mood_object_day - duration,
            mood_award_text_1: "已连续记录心情",
            mood_award_text_2: "天了！还差" + (mood_object_day - duration) + "天就能获得额外积分奖励喔，加油~"
          })
        }
      }
    }

    const date = new Date();
    const curYear = date.getFullYear();
    const curMonth = date.getMonth() + 1;
    const weeksCh = ['日', '一', '二', '三', '四', '五', '六'];

    this.fetchHistoryMood();
    this.calculateEmptyGrids(curYear, curMonth);
    this.calculateDays(curYear, curMonth);

    this.setData({
      curYear,
      curMonth,
      weeksCh
    });
  },

  fetchHistoryMood() {
    var history_mood = wx.getStorageSync('history_mood');
    var that = this;
    var oldDatetmp = wx.getStorageSync('timestamp_mood');
    var oldDate = 0;
    var nowDate = (Date.parse(new Date()) / 1000);
    if (oldDatetmp == "") oldDate = 0;
    else oldDate = oldDatetmp;

    if (history_mood != "" && ((nowDate - oldDate) < 86400)) {
      this.setData({ 
        history_mood: history_mood 
      });
      this.classifyByDateMood();
    }
    else {
      wx.request({
        url: 'https://40525433.fudan-mini-program.com/cgi-bin/MoodHistory',
        data: {
          openid: app.globalData.openid,
          sessionid: app.globalData.sessionid,
        },
        method: 'POST',
        success: function (res) {
          if (res.data.status == 'ERROR') {
            wx.showToast({
              title: '获取历史心情失败',
              icon: 'loading'
            })
          }
          else {
            wx.setStorageSync('timestamp_mood', (Date.parse(new Date()) / 1000));
            var temp_history_mood = [];
            for (var i = 0; i < res.data.moods.length; i++) {

              res.data.moods[i].date = res.data.moods[i]['datetime'].split(" ")[0];
              res.data.moods[i].time = res.data.moods[i]['datetime'].split(" ")[1];

              var temp_table = {}
              temp_table = res.data.moods[i];
              temp_table['simpletime'] = res.data.moods[i].datetime.substring(11, 19)
              temp_table['logoPath'] = '../images/mood/' + res.data.moods[i].mood_id + '.png';
              temp_history_mood.push(temp_table);
            }

            that.setData({
              history_mood: temp_history_mood,
            });

            wx.setStorageSync('history_mood', temp_history_mood);

            that.classifyByDateMood();
          }
        }
      })
    }
  },

  classifyByDateMood: function () {
    var that = this;
    var tempclassifyByDateMood = {};
    var currentDate = '';
    var currentClass = {};

    for (var i = 0; i < this.data.history_mood.length; i++) {
      if (currentDate != this.data.history_mood[i].date) {
        
        if (currentClass.date) {
          tempclassifyByDateMood[currentDate] = currentClass;
        }
        currentClass = {};
        currentClass.date = this.data.history_mood[i].date;
        currentDate = this.data.history_mood[i].date;

        currentClass['moodList'] = [];
      }
      currentClass['moodList'].push(this.data.history_mood[i]);
      
    }
    tempclassifyByDateMood[currentDate] = currentClass;

    this.setData({ 
      classifiedMoods: tempclassifyByDateMood, 
    });
  },

  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },

  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },

  calculateDays(year, month) {
    let days = [];

    const thisMonthDays = this.getThisMonthDays(year, month);

    for (let i = 1; i <= thisMonthDays; i++) {
      var current_mood = this.getMoodByDate(year, month, i);
      days.push({
        day: i,
        choosed: current_mood
      });
    }

    this.setData({
      days
    });
  },

  getMoodByDate(year, month, date) {
    month = (month < 10 ? '0' : '') + month.toString();
    date = (date < 10 ? '0' : '') + date.toString();
    var full_date = year + '-' + month + '-' + date;
    
    var mood = this.data.classifiedMoods[full_date];
    if (!mood)
      return 100;
    
    return mood.moodList[0].mood_id;
  },

  

  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const curYear = this.data.curYear;
    const curMonth = this.data.curMonth;
    if (handle === 'prev') {
      let newMonth = curMonth - 1;
      let newYear = curYear;
      if (newMonth < 1) {
        newYear = curYear - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        curYear: newYear,
        curMonth: newMonth
      });
    } else {
      let newMonth = curMonth + 1;
      let newYear = curYear;
      if (newMonth > 12) {
        newYear = curYear + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        curYear: newYear,
        curMonth: newMonth
      });
    }
  },
  
  chooseYearAndMonth() {
    const curYear = this.data.curYear;
    const curMonth = this.data.curMonth;
    let pickerYear = [];
    let pickerMonth = [];
    for (let i = 2000; i <= 2100; i++) {
      pickerYear.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      pickerMonth.push(i);
    }
    const idxYear = pickerYear.indexOf(curYear);
    const idxMonth = pickerMonth.indexOf(curMonth);
    this.setData({
      pickerValue: [idxYear, idxMonth],
      pickerYear,
      pickerMonth,
      showPickerMood: true,
    });
  },
  

};

Page(moodObj);

export default moodObj;