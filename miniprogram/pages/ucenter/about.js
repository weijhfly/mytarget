const app = getApp();

Page({
  data: {
    skin: app.data.skin,
  },
  onLoad: function() {
    app.setSkin(this);
  }
})
