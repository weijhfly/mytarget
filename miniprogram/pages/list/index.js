var app = getApp();
Page({
  data: {
    targetList: [],
    height: 0,
    scrollY: true,
    maxMoveLeft:0,
    correctMoveLeft:0,
    flag:false
  },
  swipeCheckX: 15, //激活检测滑动的阈值
  swipeCheckState: 0, //0未激活 1激活
  maxMoveLeft: 0, //消息列表项最大左滑距离
  correctMoveLeft: 80, //显示菜单时的左滑距离
  thresholdMoveLeft: 45,//左滑阈值，超过则显示菜单
  lastShowMsgId: '', //记录上次显示菜单的消息id
  moveX: 0,  //记录平移距离
  showState: 0, //0 未显示菜单 1显示菜单
  touchStartState: 0, // 开始触摸时的状态 0 未显示菜单 1 显示菜单
  swipeDirection: 0, //是否触发水平滑动 0:未触发 1:触发水平滑动 2:触发垂直滑动
  onLoad: function () {
  console.log('重新加载')

  if (app.globalData.openid){
    this.getData();
  }else{
    this.onGetOpenid();
  }
  },
  getData:function(){
    this.pixelRatio = app.data.deviceInfo.pixelRatio;
    var windowHeight = app.data.deviceInfo.windowHeight;
    var height = windowHeight;

    const db = wx.cloud.database();
    db.collection("targets").where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        this.setData({
          flag: true,
          targetList: res.data, height: height
        })
        app.globalData.targetList = res.data;
      }, fail: err => {
        wx.showToast({
          icon: "none",
          title: '查询记录失败',
        })
      }
    })
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid;
        this.getData();
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  ontouchstart: function (e) {
    if (this.showState === 1) {
      this.touchStartState = 1;
      this.showState = 0;
      this.moveX = 0;
      this.translateXMsgItem(this.lastShowMsgId, 0, 200);
      this.lastShowMsgId = "";
      return;
    }
    this.firstTouchX = e.touches[0].clientX;
    this.firstTouchY = e.touches[0].clientY;
    if (this.firstTouchX > this.swipeCheckX) {
      this.swipeCheckState = 1;
    }
    this.lastMoveTime = e.timeStamp;
  },

  ontouchmove: function (e) {
    if (this.swipeCheckState === 0) {
      return;
    }
    //当开始触摸时有菜单显示时，不处理滑动操作
    if (this.touchStartState === 1) {
      return;
    }
    var moveX = e.touches[0].clientX - this.firstTouchX;
    var moveY = e.touches[0].clientY - this.firstTouchY;
    //已触发垂直滑动，由scroll-view处理滑动操作
    if (this.swipeDirection === 2) {
      return;
    }
    //未触发滑动方向
    if (this.swipeDirection === 0) {
      //触发垂直操作
      if (Math.abs(moveY) > 4) {
        this.swipeDirection = 2;

        return;
      }
      //触发水平操作
      if (Math.abs(moveX) > 4) {
        this.swipeDirection = 1;
        this.setData({ scrollY: false });
      }
      else {
        return;
      }

    }
    //禁用垂直滚动
    // if (this.data.scrollY) {
    //   this.setData({scrollY:false});
    // }

    this.lastMoveTime = e.timeStamp;
    //处理边界情况
    if (moveX > 0) {
      moveX = 0;
    }
    //检测最大左滑距离
    if (moveX < -this.data.maxMoveLeft) {
      moveX = -this.data.maxMoveLeft;
    }
    this.moveX = moveX;
    this.translateXMsgItem(e.currentTarget.id, moveX, 0);
  },
  ontouchend: function (e) {
    this.swipeCheckState = 0;
    var swipeDirection = this.swipeDirection;
    this.swipeDirection = 0;
    if (this.touchStartState === 1) {
      this.touchStartState = 0;
      this.setData({ scrollY: true });
      return;
    }
    //垂直滚动，忽略
    if (swipeDirection !== 1) {
      return;
    }
    if (this.moveX === 0) {
      this.showState = 0;
      //不显示菜单状态下,激活垂直滚动
      this.setData({ scrollY: true });
      return;
    }
    if (this.moveX === this.data.correctMoveLeft) {
      this.showState = 1;
      this.lastShowMsgId = e.currentTarget.id;
      return;
    }
    if (this.moveX < -this.thresholdMoveLeft) {
      this.moveX = -this.data.correctMoveLeft;
      this.showState = 1;
      this.lastShowMsgId = e.currentTarget.id;
    }
    else {
      this.moveX = 0;
      this.showState = 0;
      //不显示菜单,激活垂直滚动
      this.setData({ scrollY: true });
    }
    this.translateXMsgItem(e.currentTarget.id, this.moveX, 500);
    //this.translateXMsgItem(e.currentTarget.id, 0, 0);
  },
  onDeleteMsgTap: function (e) {
    this.deleteMsgItem(e);
  },
  getItemIndex: function (id) {
    console.log(id)
    var targetList = this.data.targetList;
    for (var i = 0; i < targetList.length; i++) {
      if (targetList[i]._id === id) {
        return i;
      }
    }
    return -1;
  },
  deleteMsgItem: function (e) {
    let _this = this;

    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          let id = e.currentTarget.id;
          const db = wx.cloud.database();

          db.collection("targets").doc(id).remove({
            success: res => {
              wx.showToast({
                title: '删除成功',
              })
              console.log('删除成功')
              _this.onLoad();
              _this.touchStartState = 1;
              _this.showState = 0;
              _this.moveX = 0;
              _this.translateXMsgItem(_this.lastShowMsgId, 0, 200);
              _this.lastShowMsgId = "";
             /* var animation = wx.createAnimation({ duration: 200 });
              animation.height(0).opacity(0).step();
              console.log(e.currentTarget)
              _this.animationMsgWrapItem(e.currentTarget.id, animation);

              setTimeout(function () {
                var index = _this.getItemIndex(e.currentTarget.id);
                _this.data.targetList.splice(index, 1);
                _this.setData({ targetList: _this.data.targetList });
                app.globalData.targetList = _this.data.targetList;
              }, 200);*/
              _this.showState = 0;
              _this.setData({ scrollY: true });
            }, fail: err => {
              wx.showToast({
                title: '删除失败',
              })
            }
          })
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  },
  translateXMsgItem: function (id, x, duration) {
    var animation = wx.createAnimation({ duration: duration });
    animation.translateX(x).step();
    this.animationMsgItem(id, animation);
  },
  animationMsgItem: function (id, animation) {
    var index = this.getItemIndex(id);
    var param = {};
    var indexString = 'targetList[' + index + '].animation';
    param[indexString] = animation.export();
    this.setData(param);
  },
  animationMsgWrapItem: function (id, animation) {
    var index = this.getItemIndex(id);
    var param = {};
    var indexString = 'targetList[' + index + '].wrapAnimation';
    param[indexString] = animation.export();
    this.setData(param);
  },
  update:function(){
    wx.navigateTo({
      url: '../list/update',
    })
  },
  onReady:function(){
    var vm = this;
    var query = wx.createSelectorQuery();
    query.select('.js-width').boundingClientRect();
    query.exec(function (res) {
      vm.setData({ maxMoveLeft: res[0].width, correctMoveLeft: res[0].width });
    })
  },
  onUpdate: function (e) {
    let id = e.currentTarget.id
    
    wx.navigateTo({
      url: '../list/update?id=' + id,
    })

    this.touchStartState = 1;
    this.showState = 0;
    this.moveX = 0;
    this.translateXMsgItem(this.lastShowMsgId, 0, 200);
    this.lastShowMsgId = "";
  },
  getDetail:function(e){
    let id = e.currentTarget.id

    wx.navigateTo({
      url: '../list/detail?id=' + id,
    })
  },
  onShow:function(){
    if (app.globalData.openid) {
      this.getData();
    }
  }
})
