const app = getApp();

Page({
  data: {
    nickName: '',
    avatarUrl: '',
    defaultFace:'../../images/default.jpg',
    flag:false,
    skin: app.data.skin,
    openSet:false,
    skinList: app.data.skins,
  },
  onLoad: function() {
    app.setSkin(this);

    if (app.globalData.userInfo){
      this.setData({
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl || this.data.defaultFace
      })
    }else{
      this.setData({
        avatarUrl: this.data.defaultFace
      })
    }
  },
  getUserInfo: function (e) {
    let userInfo = e.detail.userInfo;
    
    app.globalData.userInfo = userInfo;
    this.setData({
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl || this.data.defaultFace
    })
  },
  showSkins:function(e){

    this.setData({
      openSet: e.target.dataset.flag? false:true
    })
  },
  setSkin:function(e){
    var skin = e.target.dataset.flag;

    skin = skin;

    app.data.skin = skin;
   
    app.setSkin(this,1);

    this.setData({
      skin:skin,
      openSet: false
    })

    wx.setStorageSync('skin', skin);

    app.globalData.pages.forEach(function(v){
      app.setSkin(v,1);
    })
  }
})
