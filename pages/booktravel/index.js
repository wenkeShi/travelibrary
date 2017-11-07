//index.js
//获取应用实例
const app = getApp()
const request = require('../../libs/sessions/session-request.js');

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // request({
    //   url: 'https://liudongtushuguan.cn/login',
    //   method: 'GET',

    //   success(data) {
    //     console.log('success', data);
    //   },

    //   fail(error) {
    //     console.log('error', error);
    //   },

    //   complete(what) {
    //     console.log('complete', what);
    //   },
    // });
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true,
        userInfo: app.globalData.userInfo,
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  scanBook : function (e) {
    wx.scanCode({
      success : (res) => {
        console.log(res);
        if (res.scanType === 'EAN_13'){
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
})
