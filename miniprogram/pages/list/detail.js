var app = getApp();

Page({
  data: {
    title:'',
    content: '',
    skin: 'normal-skin',
  },

  onLoad: function (options) {
    app.setSkin(this); 

    const db = wx.cloud.database();
    db.collection("targets").where({
      _id: options.id
    }).get({
      success: res => {
        console.log(res)
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
  }
})
