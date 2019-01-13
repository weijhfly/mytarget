//app.js
App({
  data: {
    deviceInfo: {},
    skin: wx.getStorageSync('skin'),
    index: 'pages/index/index',
    skins: {
      'normal-skin': {
        tag:'默认',
        color: '#000000',
        background: '#f6f6f6'
      },
      'dark-skin': {
        tag: '深黑',
        color: '#ffffff',
        background: '#000000'
      },
      'red-skin': {
        tag: '粉红',
        color: '#8e5a54',
        background: '#f9e5ee'
      },
      'yellow-skin': {
        tag: '橘黄',
        color: '#8c6031',
        background: '#f6e1c9'
      },
      'green-skin': {
        tag: '草绿',
        color: '#5d6021',
        background: '#e3eabb'
      },
      'cyan-skin': {
        tag: '青葱',
        color: '#417036',
        background: '#d1e9cd'
      },
      'blue-skin': {
        tag:'水蓝',
        color: '#2e6167',
        background: '#bbe4e3'
      }
    }
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: "release-5cd9c5",//这个就是环境id
        traceUser: true,
      })
    }

    this.globalData = {};
    this.globalData.pages = [];
    this.data.deviceInfo = wx.getSystemInfoSync();
  },
  setSkin:function(that,flag){
    var app = this;

    if(that.data.skin != app.data.skin){
      that.setData({
        skin: app.data.skin
      })
    }
    app.master();

    if(!flag){
      app.globalData.pages.push(that);
      app.globalData.time = +new Date();

      if(that.route != app.data.index){
        app.globalData.pages[0].setData({
          shareId:''
        })
      }
      that.onShow = function(e){

        if (+new Date() - app.globalData.time > 1e3){
          if ([app.data.index, 'pages/list/index', 'pages/ucenter/feedback'].indexOf(this.route) != -1) {
            if (app.globalData.openid) {
              if (this.route == app.data.index && !this.data.shareId){
                this.getData();
              }else{
                this.getData();
              }
            }
          }
          app.master();
        }
      }
    }
  },
  master: function (){
    var skin = this.data.skin;

    if(!skin){return;}

    var fcolor = skin == 'dark-skin' ? '#ffffff' : '#000000',
      skins = this.data.skins,
      item = skins[skin],
      tcolor = item.color,
      bcolor = item.background;

    //setNavigationBarColor、setBackgroundColor只对当前页有效，所以每次都要设置
    wx.setNavigationBarColor({
      frontColor: fcolor,
      backgroundColor: bcolor,
    })
    wx.setTabBarStyle({
      color: tcolor,
      backgroundColor: bcolor,
    })
    wx.setBackgroundColor({
      backgroundColor: bcolor,
      backgroundColorTop: bcolor, // 顶部窗口的背景色为白色
      backgroundColorBottom: bcolor, // 底部窗口的背景色为白色
    })
  }
})
