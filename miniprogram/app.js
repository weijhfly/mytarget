//app.js
App({
  data: {
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
        color: '#999999',
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
      that.onShow = function(){
       
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

    var skins = this.data.skins,
        item = skins[skin],
        tcolor = item.color,
        bcolor = item.background;

    wx.setTabBarStyle({
      color: tcolor,
      backgroundColor: bcolor,
    })
    wx.setBackgroundColor({
      backgroundColor: bcolor,
      backgroundColorTop: bcolor, 
      backgroundColorBottom: bcolor,
    })
  },
  share:function(that){
    var app = this;

    wx.showLoading({
      title: '保存中...',
    })

    let context = wx.createCanvasContext('share'),
      background = app.data.skins[that.data.skin].background,
      color = app.data.skins[that.data.skin].color,
      w = that.data.screenWidth,
      h = that.data.screenHeight,
      title = that.data.title,
      content = that.data.content;

    content = content.replace(/\n/g, '&n').split('&n');

    context.setFillStyle(background);
    context.fillRect(0, 0, w, h);
    //绘制标题
    context.setFontSize(24);
    context.setFillStyle(color);
    context.fillText(title, (w - context.measureText(title).width) / 2, 40, w);

    //绘制内容
    context.setFontSize(20);
    var rh = 0;
    content.forEach(function (v, i) {
      var y = (i + 1) * 25 + 60;

      context.fillText(v, 10, y, w);
      rh = y;
    })
    h = rh + 150;
    //把画板内容绘制成图片，并回调 画板图片路径
    context.draw(false, function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: w,
        height: h,
        destWidth: w,
        destHeight: h,
        canvasId: 'share',
        success: function (res) {

          if (!res.tempFilePath) {
            wx.showModal({
              title: '提示',
              content: '图片绘制中，请稍后重试',
              showCancel: false
            })
          }
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (res) => {
              wx.hideLoading()
              wx.showToast({
                'title': '保存成功'
              })
            },
            fail: (err) => {
              wx.showToast({
                'title': '保存失败，请稍后再试'
              })
              wx.hideLoading()
            }
          })
        }
      })
    });
  }
})
