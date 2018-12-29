const app = getApp();
let util = require("../../utils/util.js");

Page({
  data: {
    id:'',
    title:'',
    content:'',
    date: '',
    from:''
  },
  onLoad: function (options) {
    
    if (options.id) {
      const db = wx.cloud.database();
      db.collection("targets").where({
        _id: options.id
      }).get({
        success: res => {
          let data = res.data[0];
          this.setData({
            id:options.id,
            date:data.date,
            title: data.title,
            content:data.content
          })
        }, fail: err => {
          console.log(err)
        }
      })
    }else{
      this.setData({
        date: new Date().getFullYear()
      })
    }
    if(options.from){
      this.setData({
        from: options.from
      })

      const db = wx.cloud.database();
      db.collection("targets").where({
        _openid: app.globalData.openid
      }).get({
        success: res => {
          app.globalData.targetList = res.data;
        }, fail: err => {
          console.log('查询记录失败');
        }
      })
    }
  },
  getContent:function(e){
    var val = e.detail.value;
    this.setData({
      content: val
    });
  },
  getTitle:function(e){
    var val = e.detail.value;
    this.setData({
      title: val
    });
  },
  comfirm: function (e) {

    let date = this.data.date,
      title = this.data.title,
      content = this.data.content,
      canRun = true,
      _this = this;

    //检测年份是否已存在
    app.globalData.targetList.forEach(function (v, i) { 
      if (_this.data.id){//修改
        if (v.date == date && v._id != _this.data.id) {
          canRun = false;
          return false;
        }
      }else{//新增
        if(v.date == date){
          canRun = false;
          return false;
        }
      }
     })

    if (!canRun) {
      wx.showToast({
        title: '年份已存在，请重新选择哦',
        icon: 'none'
      })
      return false;
    } else if (!title) {
      wx.showToast({
        title: '请填写标题',
        icon: 'none'
      })
      return false;
    } else if (!content) {
      wx.showToast({
        title: '请填写内容',
        icon: 'none'
      })
      return false;
    }

    const db = wx.cloud.database()//打开数据库连接

    let data = { date: date, title: title, content: content, ctime: util.formatTime(new Date())};
    if (!this.data.id) {//id等于空是新增数据
      this.add(db, data)  //新增记录
    } else {
      data.id = this.data.id;
      this.update(db, data)  //修改记录
    }
  },
  add: function (db, data) {

    db.collection("targets").add({
      data: data,
      success: res => {
        wx.showToast({
          title: '新增成功',
        })
        let url = this.data.from ? '../index/index' :'../list/index';
        setTimeout(function () {
          wx.switchTab({
            url: url,
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          })
        }, 1000)
      }, fail: err => {
        wx.showToast({
          title: '新增失败',
          icon: 'none'
        })
      }
    })
  },
  update: function (db, data) {

    db.collection("targets").doc(data.id).update({
      data: data,
       success: res => {
        wx.showToast({
          title: '修改成功',
        })
         setTimeout(function () {
           wx.switchTab({
             url: '../list/index',
             success: function (e) {
               var page = getCurrentPages().pop();
               if (page == undefined || page == null) return;
               page.onLoad();
             }
           })
         }, 1000)
      }, fail: err => {
        wx.showToast({
          title: '修改失败',
        })
      }
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  onShow:function(){
    this.setData({
      date: this.data.date
    })
  }
})
