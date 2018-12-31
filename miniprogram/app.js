//app.js
App({
  data: {
    deviceInfo: {}
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
    this.data.deviceInfo = wx.getSystemInfoSync();
  }
})
