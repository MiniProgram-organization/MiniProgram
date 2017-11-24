// pages/recordmood/recordmood.js
var app = getApp();
var wxCharts = require('../../utils/wxcharts.js');
//从0-6对应
var all_name = ['狂喜','开心','放松','平静','低落','焦虑','生气']
var all_set = {
  0:[
    '哇咔咔，我也为你开心o(￣▽￣)ｄ 保持这一刻的好心情吧',
    '我拼命的忍住笑:)',
    '我的心里绽开了朵朵鲜花，就要蹦出来似的',
    '好兴奋奥，睡不着唉'
  ],
  1:[
    '(๑￫ܫ￩)世界会给自信的你留一席之地，保持这一刻的好心情~',
    '很高兴能分享你的好心情(*≧∪≦)',
    '感觉幸福 感觉不孤单'
  ],
  2:[
    '保持这一刻的闲适心境，拥抱所有可能的未知o(￣▽￣)ｄ',
    '我喜欢暖冬的太阳,我喜欢初春的青草,我喜欢午后的庭院和一旁发呆的秋千,我喜欢你，你应该也知道.',
    '喜欢这些微小的幸福，享受这些柔柔的感动……'
  ],
  3:[
    '闲看庭前花开花落，漫随天边云卷云舒:）',
    '带上沉着笃定的心态迎接未来(๑•̀ㅂ•́)و✧',
    '十年夜雨心不冷，百鸟飞远天不远，千山越过水不浊，万花落尽春不尽'
  ],
  4:[
    '别灰心，给你一个大大的拥抱(づ。◕‿‿◕。)づ',
    '送你一朵fa fa，加油加油（づ￣3￣）づ╭～',
    '我们的征途是星辰大海，不要灰心，再坚持一下(๑•̀ㅂ•́)و✧',
    '摸摸头，向前走(づ￣3￣)づ╭～'
  ],
  5:[
    '不要紧张，相信自己 (๑•̀ㅂ•́)و✧加油',
    '听听轻音乐放松一下~ 亲测α波音乐有舒缓效用哦 :）',
    '闭上眼睛深呼吸放松一下:）',
    '一念一清净，心是莲花开',
    '得之坦然，失之淡然，顺其自然，争其必然'
  ],
  6:[
    '消消火消消火，不要生气哦(。·ω·。)好心情会造访你的～',
    '世界如此美妙，你却……\n不要生气，对身体不好哦(づ。◕‿‿◕｡)づ',
    '世人动曰：“尘世苦海”，殊不知时间花迎鸟笑，尘世不尘，海亦不苦，彼自苦其心尔。'
  ]
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: getApp().globalData.windowWidth,
    windowHeight: getApp().globalData.windowHeight,
      icon_url:"",
      mood_text:"",
      mood_id:-1,
      text:"",
  },
  recordRequest: function (latitude, longitude){
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/Mood',
      method: 'POST',
      data: {
        mood_id: that.data.mood_id,        //心情类型(0-6)
        mood_text: that.data.mood_text,    //心情类型对应的文字
        openid: app.globalData.openid,
        text: that.data.text,
        latitude: latitude,//用户所在纬度
        longitude: longitude,  //用户所在经度
      },
      success: function (e) {
        //添加到缓存
        var old_history = wx.getStorageSync('history_mood');
        var datetime = new Date();
        var time = datetime.toLocaleTimeString();
        var date = datetime.toLocaleDateString();
        var datetimestring = date + ' ' + time.substring(time.length - 8, time.length)
        var duration = e.data.duration;
        var award = e.data.award;
        var scores = e.data.scores;
        wx.setStorageSync('scores', scores);
        wx.setStorageSync('duration_mood', duration);

        if (old_history == "") {
          wx.setStorageSync('history_mood', [{
            mood_id: that.data.mood_id,
            mood_text: that.data.mood_text,    //心情类型对应的文字
            text: that.data.text,
            datetime: datetimestring,
            latitude: app.globalData.latitude,//用户所在纬度
            longitude: app.globalData.longitude,  //用户所在经度
            simpletime: time.substring(time.length - 8, time.length),
            logoPath: '../images/mood/' + that.data.mood_id + '.png'
          }])
        }
        else {
          old_history.unshift({
            mood_id: that.data.mood_id,
            mood_text: that.data.mood_text,    //心情类型对应的文字
            text: that.data.text,
            datetime: datetimestring,
            latitude: app.globalData.latitude,//用户所在纬度
            longitude: app.globalData.longitude,  //用户所在经度
            simpletime: time.substring(time.length - 8, time.length),
            logoPath: '../images/mood/' + that.data.mood_id + '.png'
          });
          wx.setStorageSync('history_mood', old_history);
        }
        wx.switchTab({
          url: '../mood/mood',
          success: function (e) {
            if (award > 0) {
              wx.showToast({
                title: "记录成功：\n" + that.data.mood_text + '\n' + '+' + award + '分',
                icon: 'success',
                duration: 2000
              });
            }
            else {
              wx.showToast({
                title: "记录成功：\n" + that.data.mood_text,
                icon: 'success',
                duration: 2000
              });
            }
          }
        })
      },
      fail: function (e) {
        wx.showToast({
          title: "记录失败：\n" + that.data.mood_text,
          icon: 'loading',
          duration: 2000
        });
      }
    })
  },
  recordMood: function ()
  {
    var that = this;
    wx.getLocation({
      success: function(res) {
        that.recordRequest(res.latitude,res.longitude);
      },
      fail: function(){
        that.recordRequest(app.globalData.latitude, app.globalData.longitude);
      }
    })

  },
  textChange: function (e) {
    this.setData({
      text: e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var randomval = Math.floor((Math.random() * all_set[options.moodId].length));
    this.setData({
      icon_url: '../images/mood/' + parseInt(options.moodId)+'.png',
      mood_id:options.moodId,
      mood_text: all_name[parseInt(options.moodId)],
      mood_set: all_set[parseInt(options.moodId)][randomval],
    })
    var old_history = wx.getStorageSync('history_mood');
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