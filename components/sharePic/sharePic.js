// component/sharePic/sharePic.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 弹窗标题
    title: {            
      type: String,     
      value: '标题'     
    },
    // 弹窗内容
    content: {
      type: String,
      value: '弹窗内容'
    },
    // 弹窗取消按钮文字
    cancelText: {
      type: String,
      value: '取消'
    },
    // 弹窗确认按钮文字
    confirmText: {
      type: String,
      value: '确定'
    }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    isShow: false,
    //展示图片的url
    imgUrl: "../../pages/images/weather/100.png"
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */

    //隐藏弹框
    hideDialog() {
      this.setData({
        isShow: !this.data.isShow,
      })
    },
    //展示弹框
    showDialog(imageUrl) {
      this.setData({
        isShow: !this.data.isShow,
        imgUrl: imageUrl
      })
    },
    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */
    _downloadEvent() {
      //触发取消回调
      this.triggerEvent("downloadEvent")
    },
    _shareEvent() {
      //触发成功回调
      this.triggerEvent("shareEvent");
    },
    _cancelEvent() {
      //触发成功回调
      this.triggerEvent("cancelEvent");
    }
  }
})
