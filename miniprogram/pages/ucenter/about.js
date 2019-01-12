const app = getApp();

Page({
  data: {
    skin: 'normal-skin',
  },
  onLoad: function() {
    app.setSkin(this);
  }
})
