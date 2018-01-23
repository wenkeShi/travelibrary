// pages/page2.js
const APP = getApp();
const request = require('../../utils/util.js').request;
const URL = 'https://liudongtushuguan.cn/';
Page({
  data: {
    winHeight: '',//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    showBooks : [], //获取的书籍
    tags: ['全部', '文学', '流行', '文化', '生活', '经管', '科技','编程'], //书籍分类
    currentPages : [], //记录当前tab分页查询当前page
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    console.log('switchTab');
    let index = e.detail.current//分类
    this.setData({
      currentTab: index
    });
    this.checkCor();
    if (!this.data.showBooks[index]){
      this.getBooks(this.data.tags[index], index);
    }
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    };
    // this.getBooks(this.data.tags[cur], cur);
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    console.log('checkFor');
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function () {
    // console.log('books-----------');
    this.getBooks(this.data.tags[0],0);
    var that = this;
    // 高度自适应

    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth;
          //rpxR = 750 / clientWidth;
        //var calc = clientHeight * rpxR - 180;
        //console.log(calc)
        that.setData({
          winHeight: clientHeight-40,
        });
      }
    });
  },
  // footerTap: app.footerTap
  footerTap : function (){
    
  },
  //tag : 种类
  //index : 种类对应的索引
  getBooks : function(tag,index,currentPage=0){
    let that = this;
    if(tag === '全部') tag = 'all';
    request({
      url : URL+'books?tag='+tag+'&currentPage='+currentPage,
      success : function(res){
        if(res.statusCode === 200){
          let showBooks = that.data.showBooks;
          showBooks[index] = currentPage ? showBooks[index].concat(res.data.books) : res.data.books;
          that.data.currentPages[index] = currentPage;
          that.setData({
            showBooks : that.data.showBooks,
            currentPages : that.data.currentPages
          });
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
        }
      },
    });
  },
  toBorrowBook : function(e){
    //dataset会将变量变为全部小写
    let isbn = e.currentTarget.dataset.isbn;
    let bookId = e.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: './borrowBook/index?isbn=' + isbn + '&bookId=' + bookId,
    }) 
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh');
    let data = this.data;
    wx.showNavigationBarLoading();
    this.getBooks(data.tags[data.currentTab],data.currentTab);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let data = this.data;
    if (APP.globalData.libraryUpdate){
      APP.globalData.libraryUpdate = false;
      this.getBooks(data.tags[data.currentTab], data.currentTab);
    }
  },
  refresh : function(){
    console.log('refresh');
    //wx.startPullDownRefresh();
  },
  onReachBottom : function(){
    console.log('onReachBottom');
  },
  onPageScroll : function(){
    console.log('onpageScroll');
  }
})