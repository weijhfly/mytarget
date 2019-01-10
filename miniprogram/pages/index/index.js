//index.js
const app = getApp()

Page({
  data: {
    flag:true,
    title:'',
    content:'',
    id:'',
    skin: 'normal-skin',
  },

  onLoad: function (options) {
    app.globalData.time = +new Date();
    app.setSkin(this);

    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo;
            }
          })
        }else{
          console.log('未授权获取用户信息');
        }
      }
    })
    // 分享
    wx.showShareMenu({});
    this.onGetOpenid(options ? options.id:'');
  },
  getUserInfo: function (e) {
    /*let userInfo = e.detail.userInfo;

    console.log('点击获取');
    app.globalData.userInfo = userInfo;*/

    wx.navigateTo({
      url: '../list/update?from=index',
    })
  },
  getData:function(){
    const db = wx.cloud.database();
    db.collection("targets").where({
      _openid: app.globalData.openid,
      date: new Date().getFullYear()
    }).get({
      success: res => {
        let data = res.data[0] || {};

        this.setData({
          id: data._id || '',
          title: data.title || '',
          content: data.content || '',
          flag: false
        })
      }, fail: err => {
        console.log(err)
        this.setData({
          flag: false
        })
      }
    })
  },
  onShow:function(){
    var time = +new Date();

    if (time - app.globalData.time > 1e3){
      console.log('index-show');
      app.setSkin(this);
      if (app.globalData.openid) {
        this.getData();
      }
    }
    
  },
  onGetOpenid: function (id) {
    if(id){
      const db = wx.cloud.database();
      db.collection("targets").where({
        _id: id
      }).get({
        success: res => {
          let data = res.data[0] || {};
          this.setData({
            id:data._id || '',
            title: data.title || '数据已删除',
            content: data.content || '',
            flag:false
          })
        }, fail: err => {
          console.log(err)
        }
      })
    }
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid;
        if(!id){
          this.getData();
        }
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  onShareAppMessage: function (ops) {
    let _this = this;

    return {
      path: 'pages/index/index?id=' + _this.data.id,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

  }
})
