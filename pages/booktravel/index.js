//获取应用实例
const app = getApp();
const {request,session} = require('../../utils/util.js');
let sessionId = session.sessionId;
let URL ='https://liudongtushuguan.cn';
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    borrowMessage : [],
    newBooks : [],
  },
  //事件处理函数
  // bindViewTap: function() {
  // },
  onLoad: function () {
    let that = this; 
    if (sessionId) {
      login();
    } else {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            wx.request({
              url: URL+'/register',
              data: {
                code: res.code,
              },
              success: function (res) {
                if (res.statusCode == 200) {
                  console.log(res.data);
                  // wx.setStorageSync('sessionId', res.data.data.sessionId);
                  session.sessionId = res.data.data.sessionId;
                  // let sessionId = wx.getStorageSync('sessionId');
                  login();
                }
              },
            });
          } else {
            console.log(res.errMsg);
          }
        }
      })
    }
    wx.onSocketOpen(function(res){

    });
    wx.onSocketMessage(function(res){
      let msg = JSON.parse(res.data);
      let msgs = that.data.borrowMessage;
      msgs.unshift(msg);
      that.setData({ borrowMessage: msgs});
    });
    wx.onSocketClose(function(res){
      console.log('websocket closed');
    });


    //     console.log('success', data);
    //   },

    //   fail(error) {
    //     console.log('error', error);
    //   },

    //   complete(what) {
    //     console.log('complete', what);
    //   },
    // });
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     hasUserInfo: true,
    //     userInfo: app.globalData.userInfo,
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
    function login(){
      wx.request({
        url: URL + '/login',
        header: {
          sessionId: session.sessionId,
        },
        success: function (res) {
          if (res.statusCode == 200) {
            console.log(res.data);
            that.getBorrowMsgs();
            that.getNewBooks();
            wx.connectSocket({
              url: 'wss://liudongtushuguan.cn/socket?sessionId=' + session.sessionId,
            });
          }
        },
      });
    }
  },
  onShow: function(){
  },

  getBorrowMsgs: function(){
    let that = this;
    request({
      url: URL +'/message/borrowMsgs',
      success :function(res){
        if (res.statusCode == 200){
          that.setData({
            borrowMessage: res.data.borrowMessages,
          });
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading() //完成停止加载
        }
      }
    });
  },
  //获取新书
  getNewBooks : function(){
    let that = this;
    request({
      url : URL + '/newbooks',
      success  : function(res){
        if(res.statusCode == 200){
          that.setData({
            newBooks: res.data.newPublishedBooks,
          });
        }
      },
    });
  },
  //点击新书跳转
  toBorrowBook : function(e){
    let isbn = e.currentTarget.dataset.isbn;
    let bookId = e.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: '../libraryshelves/borrowBook/index?isbn='+isbn+'&bookId='+bookId,
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  scanBook : function (e) {
    wx.scanCode({
      success : (res) => {
        console.log(res);
        if (res.scanType === 'EAN_13' || res.scanType === 'EAN_10'){
          wx.navigateTo({
            url: './bookdetails/index?isbn=' + res.result,
          });
        }else{
          wx.navigateTo({
            url: './error/index',
          });
        }
      },
    });
  },
  respond : function(e){
    let dataset = e.currentTarget.dataset;
    let index = dataset.index;
    let type= dataset.type;
    let msgs = this.data.borrowMessage;
    let that = this;
    let pageData = this.data;
    let borrowMessage = pageData.borrowMessage[index];
    wx.showNavigationBarLoading();
    request({
      url: URL + '/' + type,
      method : 'POST',
      data : {
        borrower: borrowMessage.borrower,
        //targetId: borrowMessage.targetId,
        bookId: borrowMessage.bookId,
        borrowerId: borrowMessage.borrowerId,
      },
      success : function(res){
        if(res.statusCode == 200){
          pageData.borrowMessage.splice(index, 1);
          wx.hideNavigationBarLoading();
          that.setData({
            borrowMessage: pageData.borrowMessage,
          });
        }
      },
    });

  },
  onPullDownRefresh : function(){
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getBorrowMsgs();
    this.getNewBooks();
  },
})
