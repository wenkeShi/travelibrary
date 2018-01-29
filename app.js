App({
  onLaunch: function () {
    // 展示本地存储能力   
    // var sessionId = wx.getStorageSync('sessionId');
    // console.log(sessionId);
    // logs.unshift(Date.now());
    // wx.setStorageSync('logs', logs);
    // 登录
    // if(sessionId){
    //   wx.request({
    //     url: 'https://liudongtushuguan.cn/login',
    //     header : {
    //       sessionId : sessionId,
    //     },
    //     success : function(res){
    //       if (res.statusCode == 200) {
    //         console.log(res.data);
    //       }
    //     },
    //   });
    // }else{
    //   wx.login({
    //     success: res => {
    //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //       if (res.code) {
    //         wx.request({
    //           url: 'https://liudongtushuguan.cn/login',
    //           data: {
    //             code: res.code,
    //           },
    //           // header :{sessionId:sessionId},
    //           success: function (res) {
    //             if (res.statusCode == 200) {
    //               console.log(res.data);
    //               wx.setStorageSync('sessionId',res.data.data.sessionId);
    //               let sessionId = wx.getStorageSync('sessionId');
    //               console.log('sessionId-------'+sessionId);
    //               wx.request({
    //                 url: 'https://liudongtushuguan.cn/login',
    //                 header: {
    //                   sessionId: sessionId,
    //                 },
    //                 success: function (res) {
    //                   if (res.statusCode == 200) {
    //                     console.log(res.data);
    //                   }
    //                 },
    //               });
    //             }
    //           },
    //         });
    //       } else {
    //         console.log(res.errMsg);
    //       }
    //     }
    //   })
    // }
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     if(res.code){
    //       wx.request({
    //         url: 'https://liudongtushuguan.cn/login',
    //         data: {
    //           code: res.code,
    //         },
    //         // header :{sessionId:sessionId},
    //         success:function(res){
    //           if(res.statusCode==200){
    //             console.log(res.data);
    //           }
    //         },
    //       });
    //     }else{
    //       console.log(res.errMsg);
    //     }
    //   }
    // })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              console.log(res.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          wx.authorize({
            scope: 'scope.userInfo',
            success:() => {
              // 用户已经同意小程序授权，后续调用wx.getUserInfo 接口不会弹窗询问
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res.userInfo;
                  console.log(res.userInfo);
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                }
              })
            },
          })
        }
      }
    })
  },
  
  globalData: {
    userInfo: 'init',
    libraryUpdate : false,  //借阅书架是否刷新  
    myBookUpdate : false,   //我的图书是否刷新
  }
})