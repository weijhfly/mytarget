const app = getApp();

Page({
  data: {
    nickName: '',
    avatarUrl: '',
    defaultFace:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QlaRXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAITAAMAAAABAAEAAIdpAAQAAAABAAAAZgAAAMAAAABIAAAAAQAAAEgAAAABAAeQAAAHAAAABDAyMjGRAQAHAAAABAECAwCgAAAHAAAABDAxMDCgAQADAAAAAQABAACgAgAEAAAAAQAAAISgAwAEAAAAAQAAAISkBgADAAAAAQAAAAAAAAAAAAYBAwADAAAAAQAGAAABGgAFAAAAAQAAAQ4BGwAFAAAAAQAAARYBKAADAAAAAQACAAACAQAEAAAAAQAAAR4CAgAEAAAAAQAACDIAAAAAAAAASAAAAAEAAABIAAAAAf/Y/8AAEQgAoACgAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAQEBAQEBAgEBAgMCAgIDBAMDAwMEBQQEBAQEBQYFBQUFBQUGBgYGBgYGBgcHBwcHBwgICAgICQkJCQkJCQkJCf/bAEMBAQEBAgICBAICBAkGBQYJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCf/dAAQACv/aAAwDAQACEQMRAD8A/uIooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9D+4iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0f7iKKKKACiiigAooooAKQnFLTWkWNGeRwir8xz0wOpJ7UAPwScYrGv/ABDoOlP5epXkNu3pI6qf1Ir5c+J3xiudRuW0XwpM8NquQ8ijDOfY9cD618+vLJIxaZixY/MSTkn3zQB+ktj4h0LU32adeQzt6RurfyJrXyM4r8xI5Gik82NtpXoVzke/FfQfwz+Md3psq6P4rlM1uxAWZiSV9Ae5HvzigD65IxwaKajpIokiIZTyCOQRTqACiiigAooooAKKKKAP/9L+4iiiigAooooAKKKKACvHvjV4kfQ/CL2docTXxEIPop5Y/wDfINew18l/tEyynWLK3BO3yd3tkM1AHzqzlmLA9abSsQW+Xp2+lJQAUA46UUUAfb/wV8SPr3hBbS7OZ7JvKJ9VGCh/IivYm2kkpwDXyR+zxNMutXsAPyeTu59S6/0r629x3oAKKKKACiiigAooooA//9P+4iiiigAooooAKKKKACvnD9oXR5JdMtdbj5ETiNuOgO7B/M4r6PrG1/QrTxNpE+iX+PKnXbnupPRvwoA/NdemaWtzxFoF94Z1WTSr9SrJ09CvYg96xCMHFACHjmjocUGt7w54fv8AxRq8ej6eCWlxuI/hX1PpQB9Jfs86NJHpN1r0nCyuY19wMf1GK+kT6dMVh+HtCtPDOiwaHYL+7hUKT6nPLfU1t5Y8t1oAKKKKACiiigAooooA/9T+4iiiigAooooAKKKKACmsAR7j8iPSnVl6xrWl6DZNf6nMsMaDLE8k+2KAPEP2hNJtJfDtvrmAJ45xFu7lXUkj8NtfIRIyADkHp+devfFP4lnxzNHp9ghjsrdtwDfeZsYBOOK8g3AELjt+VACj6Z9q+vf2edFtYdAudYADTTzGIt1KoqqQPXqTXyFx3r174W/E3/hCZ5LC+Qy2VwQzFTgxuOAR65FAH3COeOppay9J1rT9dsl1DTpllifoR2PvWqeO2P6+4oASiiigAooooAKKKKAP/9X+4iiiigAooooAPocfWoLi4gtIGuruRY40GWZjtC+5PpUGpahb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',
    flag:false,
    skin: 'normal-skin',
    openSet:false,
    skinList:[
      { name: '默认', flag:'normal'},
      { name: '深黑', flag: 'dark' },
      { name: '粉红', flag: 'red' },
      { name: '橘黄', flag: 'yellow' },
      { name: '草绿', flag: 'green' },
      { name: '青葱', flag: 'cyan' },
      { name: '水蓝', flag: 'blue' },
    ]
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
  feedback:function(){
    wx.navigateTo({
      url: '../ucenter/feedback',
    })
  },
  about: function () {
    wx.navigateTo({
      url: '../ucenter/about',
    })
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

    skin = skin + '-skin';

    app.globalData.skin = skin;
   
    app.setSkin(this,1);

    this.setData({
      openSet: false
    })

    wx.setStorage({
      key: "skin",
      data: skin
    })

    app.globalData.pages.forEach(function(v){
      app.setSkin(v,1);
    })
  }
})
