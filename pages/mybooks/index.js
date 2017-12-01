// pages/page3/page3.js
const APP = getApp();
const request = require('../../utils/util.js').request;
const URL = 'https://liudongtushuguan.cn';
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
    publishedBooks : null,
    borrowedBooks : null,
    loading1 : true,
    loading2 : true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.getPublishedBooks();
    this.getBorrowedBooks(); 
  },
  switchTab : function(e){
    console.log("switchTab");
    // console.log(this);
    let current = e.detail.current;
    if (current === this.data.currentTab) return;
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
  getPublishedBooks : function(){
    let that = this;
    request({
      url : URL+'/publishedbooks',
      success : function(res){
        if(res.statusCode === 200){
          res.data.publishedBooks.forEach((v, i )=>{
          });
          that.setData({
            publishedBooks: res.data.publishedBooks,
            loading1 : false,
          });
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
        }
      },
    });
  },
  getBorrowedBooks : function(){
    let that = this;
    request({
      url : URL+'/borrowedbooks',
      success: function (res) {
        if (res.statusCode === 200) {
          that.setData({
            borrowedBooks: res.data.borrowedBooks,
            loading2: false,
          });
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
        }
      },
    });
  },
  returnBook : function(e){
    let bookId = e.currentTarget.dataset.bookid;
    let index = e.currentTarget.dataset.index;
    let that = this;
    wx.showNavigationBarLoading();
    request({
      url : URL + '/returnbook?bookId='+ bookId,
      success : function(res) {
        if(res.statusCode == 200){
          that.data.borrowedBooks[index].borrowingStatus = '归还中';
          wx.hideNavigationBarLoading();
          that.setData({
            borrowedBooks: that.data.borrowedBooks,
          });
        }
      }
    });
  },
  receiveBook : function(e){
    let bookId = e.currentTarget.dataset.bookid;
    let index = e.currentTarget.dataset.index;
    let that = this;
    wx.showNavigationBarLoading();
    request({
      url : URL + '/receivebook',
      method : 'POST',
      data : {
        bookId: bookId,
        borrowerId :  that.data.publishedBooks[index].borrowerId,
      },
      success : function(res){
        if(res.statusCode == 200){
          wx.hideNavigationBarLoading();
          that.data.publishedBooks[index].borrowerId = '';
          that.data.publishedBooks[index].borrower = '';
          that.setData({
            publishedBooks: that.data.publishedBooks,
          })
        }
      },
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
    //利用全局变量 实现跳转到tabbar刷新
    if (APP.globalData.myBookUpdate && this.data.publishedBooks){
      APP.globalData.myBookUpdate = false;
      this.setData({
        currentTab : 0,
      });
      this.getPublishedBooks(); 
    }
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
    let tab = this.data.currentTab;
    wx.showNavigationBarLoading();
    if (tab == 0){
      this.getPublishedBooks();
    }else{
      this.getBorrowedBooks();
    }
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