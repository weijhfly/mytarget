const app = getApp();
let util = require("../../utils/util.js");

Page({
  data: {
  
  },

  onLoad: function() {
   
  },
  add: function (e) {
 
    const db = wx.cloud.database()//打开数据库连接
    let content = e.detail.value.content;

    if(!content.length){
      wx.showToast({
        title: '反馈内容不能为空哦',
        icon: 'none'
      })
      return false;
    } else if (content.length < 2){
      wx.showToast({
        title: '请至少输入两个字',
        icon: 'none'
      })
      return false;
    }
    db.collection("feedback").add({
      data: {
        content: content,
        nickName: app.globalData.userInfo.nickName,
        ctime: util.formatTime(new Date())
      }, success: res => {
        wx.showToast({
          title: '反馈成功',
        })
        setTimeout(function(){
          wx.navigateBack();
        },1500)
      }, fail: err => {
        wx.showToast({
          title: '反馈失败',
          icon: 'none'
        })
      }
    })

  }
})
