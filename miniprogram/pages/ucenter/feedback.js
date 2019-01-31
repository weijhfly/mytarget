const app = getApp();

Page({
  data: {
    feedback:[],
    loaded:false,
    skin: app.data.skin,
    openMask: false,
    openDel: false,
    id:'',
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
  ctrl: function (e) {
    var id = e.target.id,
        that = this;

    this.setData({
      openMask: true,
      id:id
    })
  },
  exec:function(e){
    var i = e.target.dataset.flag,
        that = this,
        id = that.data.id;
    
    if (i == 0) {
      this.setData({
        openMask: false
      })
    }else if(i == 1){
      wx.navigateTo({
        url: '../ucenter/feedbackdetail?id=' + id,
      })
      that.setData({
        openMask: false
      })
    }else if(i == 2){
      this.setData({
        openDel: true
      })
    }else if (i == 3) {
      this.setData({
        openDel: false
      })
    }else if (i == 4) {
      const db = wx.cloud.database();

      db.collection("feedback").doc(id).remove({
        success: res => {
          that.getData();
          wx.showToast({
            title: '删除成功',
          })
          that.setData({
            openMask: false,
            openDel:false
          })
        }, fail: err => {
          wx.showToast({
            title: '删除失败',
          })
        }
      })
    }
  },
  addfeedback: function (e) {

    wx.navigateTo({
      url: '../ucenter/addfeedback'
    })
  }
})
