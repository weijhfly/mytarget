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
  },
  setSkin:function(that){
    wx.getStorage({
     key: 'skin',
     success: function(res) {
       if(res){
         that.setData({
          skin: res.data
        })

         var fcolor = res.data == 'dark-skin' ? '#ffffff' : '#000000',
             obj = {
               'normal-skin':{
                 color:'#000000',
                 background:'#f6f6f6'
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
             },
           item = obj[res.data],
           tcolor = item.color,
           bcolor = item.background;

         wx.setNavigationBarColor({
           frontColor: fcolor,
           backgroundColor: bcolor,
         })

         wx.setTabBarStyle({
           color: tcolor,
           backgroundColor: bcolor,
         })
       }
     }
   })
    }
})
