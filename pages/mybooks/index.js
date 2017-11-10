// pages/page3/page3.js
const APP = getApp();
const request = require('../../utils/util.js').request;
const URL = 'https://liudongtushuguan.cn/';
//在应用启动时，所有页面在Page之外的代码都会执行
// const USERINFO = APP.globalData.userInfo;
// console.log("books---------------"+USERINFO);
import { $wuxRater } from '../../components/wux';
Page({

  /**
   * 页面的初始数据
   */
  //初始值会在页面被加载之前就被赋值
  data: {
    userInfo: null,
    currentTab : 0,
    publishedBooks : [],
    borrowedBooks : [],
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
  getPublishedBooks : function(){
    let that = this;
    request({
      url : URL+'publishedbooks',
      success : function(res){
        if(res.statusCode === 200){
          res.data.publishedBooks.forEach((v, i )=>{
            $wuxRater.init(i, {
              value: (v.rate/2).toFixed(1),
              disabled : !0,
            })
          });
          that.setData({
            publishedBooks: res.data.publishedBooks,
          });
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
    this.getPublishedBooks();
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