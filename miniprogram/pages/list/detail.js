var app = getApp();

Page({
  data: {
    title:'',
    content: '',
    skin: app.data.skin,
    screenWidth: 0,
    screenHeight: 0,
    buttons: [
      {
        label: '保存'
      },
      {
        openType: 'share',
        label: '分享'
      }
    ]
  },

  onLoad: function (options) {
    app.setSkin(this); 

    const db = wx.cloud.database();
    db.collection("targets").where({
      _id: options.id
    }).get({
      success: res => {
        let data = res.data[0];
        this.setData({
          title: data.title || '数据已删除',
          content: data.content || '',
        })
      }, fail: err => {
        console.log(err)
      }
    })
    // 分享
    wx.showShareMenu({});

    wx.getSystemInfo({
      success: res => {
        this.setData({
          screenWidth: res.screenWidth,
          screenHeight: res.screenHeight
        })
      }
    })
  },
  onClick(e) {
    if (e.detail.index === 0) {
      app.share(this);
    }
  }
})
