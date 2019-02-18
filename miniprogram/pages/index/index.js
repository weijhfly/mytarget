//index.js
const app = getApp()

Page({
  data: {
    flag:true,
    title:'',
    content:'',
    id:'',
    shareId:'',
    skin: app.data.skin,
    screenWidth:0,
    screenHeight:0,
    sayingC:'',
    sayingN:'',
    buttons:[
      {
        label: '保存'
      },
      {
        openType: 'share',
        label: '分享'
      }
    ]
  },

  onLoad: function (options) {

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
          console.log('login');
          wx.login({
            success: () => {
              wx.getUserInfo({
                success: (res) => {
                  app.globalData.userInfo = res.userInfo
                },
                fail: (res) => {
                  console.log(res);
                }
              })
            }
          })
        }
      }
    })
    // 分享
    wx.showShareMenu({});
    this.onGetOpenid(options ? options.id:'');
    
    wx.getSystemInfo({
      success: res => {
        this.setData({
          screenWidth: res.screenWidth,
          screenHeight: res.screenHeight
        })
      }
    })
    const db = wx.cloud.database();
    let that = this;

    db.collection("sayingone").get({
      success: res => {
        let data = res.data[0],
            order = data.order;
 
        db.collection('saying').count({
          success(res) {
            if(order >= res.total){
              order = 1;
              db.collection('sayingone').doc('XGrCysDR1TiNWNF1').update({
                data: {
                  order: 1
                }
              })
            }
            db.collection('saying').skip(order).limit(1).get({
              success: res => {
                let data = res.data[0];
 
                that.setData({
                  sayingC: data.content,
                  sayingN: data.name,
                })
              }, fail: err => {
                console.log(err)
              }
            })
          }
        })
      }, fail: err => {
        console.log(err)
      }
    })
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
  onGetOpenid: function (id) {
    if(id){
      this.setData({
        shareId:id
      })
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
  },
  onClick(e) {
    if (e.detail.index === 0) {
      app.share(this);
    }
  }
})
