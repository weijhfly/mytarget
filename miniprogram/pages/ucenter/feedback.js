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
  ctrl: function (e) {
    var id = e.target.id,
        that = this;

    wx.showActionSheet({
      itemList: ['反馈详情', '删除'],
      success(res) {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '../ucenter/feedbackdetail?id=' + id,
          })
        } else if (res.tapIndex == 1) {

          wx.showModal({
            title: '提示',
            content: '确定删除吗？',
            success: function (res) {
              if (res.confirm) {
                const db = wx.cloud.database();

                db.collection("feedback").doc(id).remove({
                  success: res => {
                    that.getData();
                    wx.showToast({
                      title: '删除成功',
                    })
                  }, fail: err => {
                    wx.showToast({
                      title: '删除失败',
                    })
                  }
                })
              } else {
                console.log('用户点击了取消')
              }
            }
          })
        }
      }
    })
  },
  addfeedback: function (e) {

    wx.navigateTo({
      url: '../ucenter/addfeedback'
    })
  }
})
