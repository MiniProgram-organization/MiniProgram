// pages/buynaming/buynaming.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    venue: '',
    title:'',
    price: 0,
    iconPath: '',
    ownerName: '',
    new_nickname: '',
    new_price: 0,
    new_naming: '',
    POI_id: "",
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);

    var show_price = 0;
    var show_title = '';
    if (options.target_ownerName == '暂无')
    {
      show_price = parseInt(options.target_price);
      show_title = options.target_venue;
    } 
    else{
      show_price = parseInt(options.target_price) + 1;
      show_title = options.target_title;
    }
    this.setData({
      venue: options.target_venue,
      iconPath: options.target_logoPath,
      price: show_price,
      POI_id: options.target_id,
      ownerName: options.target_ownerName,
      title: show_title,
    });

    console.log(this.data);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  newNamingtextChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      new_naming: e.detail.value
    });
  },

  newNicknametextChange: function(e){
    console.log(e.detail.value);
    this.setData({
      new_nickname: e.detail.value
    });
  },

  newPricetextChange: function(e){
    console.log(e.detail.value);
    this.setData({
      new_price: e.detail.value
    });
  },

  submitNaming: function(e){
    var that = this;
    /*var old_price = parseInt(this.data.price);
    var new_price = parseInt(this.data.new_price);*/
    var show_price = parseInt(this.data.price);
    var score = wx.getStorageSync('scores');

    console.log(score)
    if (score < show_price){
      wx.showToast({
        icon: 'loading',
        title: '积分余额不足',
      })
     
    }
    else if (that.data.new_naming.indexOf(this.data.venue) < 0)
    {
      var ss='上海中医药大学1'
      console.log(ss.indexOf("上海中医药大学"))
      wx.showToast({
        icon:'loading',
        title: '需要包含原名!',
      })
      
    }
    else{
      wx.request({
       url: 'https://40525433.fudan-mini-program.com/cgi-bin/BuyTitle',
       method: 'POST',
       data: {
         openid: getApp().globalData.openid,
         sessionid: getApp().globalData.sessionid,
         POI_id: that.data.POI_id,
         title: that.data.new_naming,
         price: show_price,
         latitude: app.globalData.latitude,
         longitude: app.globalData.longitude,
       },
       success: function(res){
         console.log(res)
         if (res.data.status != 'ERROR')
         {
          wx.showToast({
            title: '冠名成功!',
          }) 
          wx.navigateBack({
            
          })
         }
         else{
           wx.showToast({
             title: '冠名失败!',
           }) 
         }

       }
     });
    }

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