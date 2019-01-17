var app = getApp();

Page({
  data: {
    targetList: [],
    flag: false,
    skin: app.data.skin,
    id:''
  },
  onLoad: function () {
    
    app.setSkin(this);
    if (app.globalData.openid){
      this.getData();
    }else{
      this.onGetOpenid();
    }
  },
  getData:function(){

    const db = wx.cloud.database();
    db.collection("targets").where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        this.setData({
          flag: true,
          targetList: res.data
        })
        app.globalData.targetList = res.data;
      }, fail: err => {
        wx.showToast({
          icon: "none",
          title: '查询记录失败',
        })
      }
    })
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid;
        this.getData();
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  ctrl:function(e){
    var id = e.target.id,
        that = this;

    wx.showActionSheet({
      itemList: ['目标详情', '编辑目标', '删除'],
      success(res) {
        if(res.tapIndex == 0){
          wx.navigateTo({
            url: '../list/detail?id=' + id,
          })
        } else if (res.tapIndex == 1) {
          wx.navigateTo({
            url: '../list/update?id=' + id,
          })
        } else if (res.tapIndex == 2) {

          wx.showModal({
            title: '提示',
            content: '确定删除吗？',
            success: function (res) {
              if (res.confirm) {
                const db = wx.cloud.database();

                db.collection("targets").doc(id).remove({
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
  update: function () {
    wx.navigateTo({
      url: '../list/update',
    })
  }
})
