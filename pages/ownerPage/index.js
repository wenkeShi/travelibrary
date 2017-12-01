
const APP = getApp();
const request = require('../../utils/util.js').request;
const URL = 'https://liudongtushuguan.cn';

Page({

  /**
   * 页面的初始数据
   */
  //初始值会在页面被加载之前就被赋值
  data: {
    nickName: '',
    image : '',
    publishedBooks: null,
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      nickName: options.nickName,
      image : options.image,
    });
    this.getPublishedBooks(options.id);
  },


  getPublishedBooks: function (ownerId) {
    let that = this;
    request({
      url: URL + '/owner/publishedbooks?ownerId='+ownerId,
      success: function (res) {
        if (res.statusCode === 200) {
          that.setData({
            publishedBooks: res.data.publishedBooks,
            loading: false,
          });
          //wx.hideNavigationBarLoading();
         // wx.stopPullDownRefresh();
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
    // this.getPublishedBooks();
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
    //wx.showNavigationBarLoading();
    //this.getPublishedBooks();
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