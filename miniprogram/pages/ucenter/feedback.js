const app = getApp();

Page({
  data: {
    feedback:[],
    loaded:false,
    skin: app.data.skin,
  },

  onLoad: function() {
    app.setSkin(this);
   
   this.getData();
  },
  getData: function () {

    const db = wx.cloud.database();
    db.collection("feedback").get({
      success: res => {
        this.setData({
          loaded: true,
          feedback: res.data,
        })
      }, fail: err => {
        wx.showToast({
          icon: "none",
          title: '查询失败',
        })
      }
    })
  },
  addfeedback: function (e) {

    wx.navigateTo({
      url: '../ucenter/addfeedback'
    })
  },
  getDetail: function (e) {
    let id = e.currentTarget.id

    wx.navigateTo({
      url: '../ucenter/feedbackdetail?id=' + id,
    })
  },
})
