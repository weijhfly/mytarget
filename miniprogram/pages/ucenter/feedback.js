Page({
  data: {
    feedback:[],
    loaded:false
  },

  onLoad: function() {
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
  onShow:function(){
    if(this.data.loaded){
      this.getData();
    }
  },
  getDetail: function (e) {
    let id = e.currentTarget.id

    wx.navigateTo({
      url: '../ucenter/feedbackdetail?id=' + id,
    })
  },
})
