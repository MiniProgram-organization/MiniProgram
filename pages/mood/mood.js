// pages/mood/mood.js
var app = getApp();
var mood =[{
    "icon": "../images/mood/0.png",
    "text": "狂喜"
  },{
    "icon": "../images/mood/1.png",
    "text": "开心"
  },{
    "icon": "../images/mood/2.png",
    "text": "放松"
  },{
    "icon": "../images/mood/3.png",
    "text": "平静"
  },{
    "icon": "../images/mood/4.png",
    "text": "低落"
  },{
    "icon": "../images/mood/5.png",
    "text": "焦虑"
  },{
    "icon": "../images/mood/6.png",
    "text": "生气"
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
    history_moodlist:[],
    show_moodlist:[],
    classifiedMoods:[],
  },
  bindChange: function (e) {
    this.moodId = e.detail.value;
    this.setData({
      mood: mood,
    })
  },
  goToMoodStatistics: function () {
    wx.navigateTo({
      url: '../moodstatistics/moodstatistics'
    })
  },
  goToRecordMood: function(){
    wx.navigateTo({
      url: '../recordmood/recordmood?moodId='+this.moodId
    })
  },
  classifyByDate: function () {
    var tempClassifyByDate = [];
    var currentDate = '';
    var currentClass = {};
    for (var i = 0; i < this.data.show_moodlist.length; i++) {

      //出现新的日期，则增加新的一个date对象
      var tempData = this.data.show_moodlist[i].datetime.substring(0,10);  
      if (currentDate != tempData){
        if (currentClass.date) {
          tempClassifyByDate.push(currentClass);
        }
        currentClass = {};
        currentClass.date = tempData;
        currentDate = tempData;
        currentClass['moodList'] = [];
      }
      currentClass['moodList'].push(this.data.show_moodlist[i]);
    }
    //最后一个也需要塞入进去
    tempClassifyByDate.push(currentClass);
    this.setData({
      classifiedMoods: tempClassifyByDate,
    });
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
    //获取历史数据
    var history_mood = wx.getStorageSync('history_mood');
    var that = this;

    console.log("请求历史心情");
    wx.request({
        url: 'https://40525433.fudan-mini-program.com/cgi-bin/MoodHistory',
        data:{
          openid: app.globalData.openid,
        },
        method: 'POST',
        success: function (res) {
          console.log("返回的历史心情");
          console.log(res);
          var show_moodlist = [];
          for (var i = 0; i < res.data.moods.length; i++){
            var temp_table = {}
            temp_table = res.data.moods[i];
            temp_table['simpletime'] = res.data.moods[i].datetime.substring(11, 19)
            temp_table['logoPath'] = '../images/mood/'+res.data.moods[i].mood_id+'.png';
            show_moodlist.push(temp_table);
          }
          that.setData({
            history_moodlist: res.data.moods,
            show_moodlist: show_moodlist,
          });
          wx.setStorageSync('history_mood', show_moodlist);
          that.classifyByDate();
        }
    })
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