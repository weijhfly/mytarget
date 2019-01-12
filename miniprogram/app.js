//app.js
App({
  data: {
    deviceInfo: {},
    skins: {
      'normal-skin': {
        color: '#000000',
        background: '#f6f6f6'
      },
      'dark-skin': {
        color: '#ffffff',
        background: '#000000'
      },
      'red-skin': {
        color: '#8e5a54',
        background: '#f9e5ee'
      },
      'yellow-skin': {
        color: '#8c6031',
        background: '#f6e1c9'
      },
      'green-skin': {
        color: '#5d6021',
        background: '#e3eabb'
      },
      'cyan-skin': {
        color: '#417036',
        background: '#d1e9cd'
      },
      'blue-skin': {
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

    if (app.globalData.skin){
      if (that.data.skin != app.globalData.skin){
        app.master(app.globalData.skin, that);
      }
    }else{
      wx.getStorage({
        key: 'skin',
        success: function (res) {
          if (res) {
            app.master(res.data, that);
            app.globalData.skin = res.data;
          }
        }
      })
    }

    if(!flag){
      app.globalData.pages.push(that);
      app.globalData.time = +new Date();
      that.onShow = function(){
        if(['pages/index/index','pages/list/index','pages/ucenter/feedback'].indexOf(this.route) != -1){
          this.getData();
        }
        if (+new Date() - app.globalData.time > 1e3){
          app.master(app.globalData.skin, false);
        }
      }
    }
  },
  master: function (skin,flag){

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
    if(flag != false){
      flag.setData({
        skin: skin
      })

      wx.setTabBarStyle({
        color: tcolor,
        backgroundColor: bcolor,
      })
    }
    wx.setBackgroundColor({
      backgroundColor: bcolor,
      backgroundColorTop: bcolor, // 顶部窗口的背景色为白色
      backgroundColorBottom: bcolor, // 底部窗口的背景色为白色
    })
  }
})
