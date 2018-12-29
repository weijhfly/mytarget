Page({
  data: {
    title:'',
    content:''
  },

  onLoad: function (options) {
    console.log(options)
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
