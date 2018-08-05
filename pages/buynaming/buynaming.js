
var app = getApp();

Page({

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
    has_owner:false
    
  },


  onLoad: function (options) {
    console.log(options);

    var show_price = 0;
    var show_title = '';
    var has_owner = false;
    if (options.target_ownerName == '' || options.target_ownerName == "undefined" )
    {
      show_price = parseInt(options.target_price);
      show_title = options.target_venue;
    } 
    else {
      has_owner = true;
      show_price = parseInt(options.target_price) + 1;
      show_title = options.target_title;
    }

    var POI_info = {
      category: options.target_category,
      venue: options.target_venue,
      latitude: options.target_latitude, //poi所在纬度
      longitude: options.target_longitude, //poi所在经度
      province: options.target_adinfo_province,
      city: options.target_adinfo_city,
      district: options.target_adinfo_district
    }

    this.setData({
      venue: options.target_venue,
      iconPath: options.target_logoPath,
      price: show_price,
      POI_info: POI_info,
      POI_id: options.target_id,
      ownerName: options.target_ownerName,
      title: show_title,
      has_owner:has_owner
    });

  },


  newNamingtextChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      new_naming: e.detail.value
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
    var show_price = parseInt(this.data.price);
    var score = wx.getStorageSync('scores');

    console.log(score)
    if (score < show_price){
      // 积分余额不足
      wx.showModal({
        title: '冠名失败',
        content: '积分余额不足！',
        showCancel:false,
        success: function (res) {
  
        }
      });
    }else{

      // 冠名成功，这里其实可以考虑做一个分享页面
      var requestData = {
        openid: getApp().globalData.openid,
        sessionid: getApp().globalData.sessionid,
        POI_info:that.data.POI_info,
        POI_id: that.data.POI_id,
        title: that.data.new_naming,
        price: show_price,
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude,
      };
      console.log("buy title request data");
      console.log(requestData);
      wx.request({
       url: 'https://40525433.fudan-mini-program.com/cgi-bin/BuyTitle',
       method: 'POST',
       data: requestData,
       success: function(res){
         console.log(res)
         if (res.data.status != 'ERROR')
         {
          wx.showToast({
            title: '冠名成功!',
          });
          // 这里要改变冠名人的积分
          var new_score = score - show_price;
          wx.setStorageSync("scores", new_score);
          app.globalData.account_refresh = true;
          
          setTimeout(function(){wx.navigateBack({ })},1500);
         }
         else{
           wx.showModal({
             title: '提示',
             content: '冠名失败！请稍后再试',
             showCancel:false,
             success:function(res){
               wx.navigateBack({});
             }
           })
         }

       }
     });
    }

  }

})