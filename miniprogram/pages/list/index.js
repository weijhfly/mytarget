var app = getApp();

Page({
  data: {
    targetList: [],
    flag: false,
    skin: app.data.skin,
    openMask: false,
    openDel: false,
    id: '',
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
    let _this = this;
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
    //定义每次获取的条数​ 
    const MAX_LIMIT = 20;
    //先取出集合的总数 
    db.collection('targets').where({_openid: app.globalData.openid}).count({
      success(res) {
      if(res.total <= 20){return false;}

       const batchTimes = Math.ceil(res.total / MAX_LIMIT) -1;
       let arr = []

       for (let i = 0; i < batchTimes; i++) { 
        let index = i * MAX_LIMIT;

        index = index || MAX_LIMIT;

        db.collection("targets").where({
          _openid: app.globalData.openid
        }).skip(index).limit(MAX_LIMIT).get({
          success: res => {
            arr = arr.concat(res.data);
            if(i == batchTimes -1){
              let data = _this.data.targetList.concat(arr);
             _this.setData({
                targetList: data
              })
             app.globalData.targetList = data;
            }
          }, fail: err => {

          }
        })
      } 
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

    this.setData({
      openMask: true,
      id: id
    })
  },
  update: function () {
    wx.navigateTo({
      url: '../list/update',
    })
  },
  exec: function (e) {
    var i = e.target.dataset.flag,
      that = this,
      id = that.data.id;

    if (i == 0) {
      this.setData({
        openMask: false
      })
    } else if (i == 1 || i == 5) {
      console.log(id)
      wx.navigateTo({
        url: (i == 1 ? '../list/detail?id=' : '../list/update?id=') + id,
      })
      that.setData({
        openMask: false
      })
    } else if (i == 2) {
      this.setData({
        openDel: true
      })
    } else if (i == 3) {
      this.setData({
        openDel: false
      })
    } else if (i == 4) {
      const db = wx.cloud.database();

      db.collection("targets").doc(id).remove({
        success: res => {
          that.getData();
          wx.showToast({
            title: '删除成功',
          })
          that.setData({
            openMask: false,
            openDel: false
          })
        }, fail: err => {
          wx.showToast({
            title: '删除失败',
          })
        }
      })
    }
  },
})
