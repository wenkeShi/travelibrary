// pages/page3/page3.js
const APP = getApp();
//在应用启动时，所有页面在Page之外的代码都会执行
// const USERINFO = APP.globalData.userInfo;
// console.log("books---------------"+USERINFO);
Page({

  /**
   * 页面的初始数据
   */
  //初始值会在页面被加载之前就被赋值
  data: {
    userInfo: null,
    currentTab : 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.$wuxRater = App.wux(this).$wuxRater
    this.$wuxRater.render('star', {
      value: 5,
    })
    console.log(this);
    console.log('onLoad--------' + this.data.userInfo);
    // wx.getUserInfo({
    //   sucesss : (data) => {
    //     console.log(data);
    //   }
    // });
    // let that = this;
    // APP.getUserInfo((userInfo) => {
    //   that.setData({
    //     userInfo : userInfo,
    //   });
    // });
    // console.log(APP.globalData.userInfo);
    // console.log(USERINFO);
    this.setData({
      userInfo: APP.globalData.userInfo,
    });
  },
  switchTab : function(e){
    console.log(this);
    let current = e.detail.current;
    this.setData({
      currentTab : current,
    });
  },
  switchNav : function(e){
    console.log(e.target.dataset);
    this.setData({
      currentTab: e.target.dataset.current,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})