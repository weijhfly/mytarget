const app = getApp();

Page({
  data: {
    reply:'',
    content:'',
    loaded: false,
    skin: 'normal-skin',
  },

  onLoad: function (options) {
    app.globalData.time = +new Date();
    app.setSkin(this);
    
    const db = wx.cloud.database();
    db.collection("feedback").where({
      _id: options.id
    }).get({
      success: res => {
        console.log(res)
        let data = res.data[0];
        this.setData({
          loaded:true,
          content: data.content,
          reply: data.reply || '',
        })
      }, fail: err => {
        console.log(err)
      }
    })
  },
  onShow: function () {
    var time = +new Date();

    if (time - app.globalData.time > 1e3) {
      app.setSkin(this);
    }
  }
})
