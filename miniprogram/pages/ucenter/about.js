const app = getApp();

Page({
  data: {
    skin: 'normal-skin',
  },
  onLoad: function() {
    app.globalData.time = +new Date();
    app.setSkin(this);
  },
  onShow: function () {
    var time = +new Date();

    if (time - app.globalData.time > 1e3) {
      app.setSkin(this);
    }
  }
})
