const app = getApp();

Page({
  data: {
    reply:'',
    content:'',
    loaded: false,
    skin: 'normal-skin',
  },

  onLoad: function (options) {
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
  }
})
