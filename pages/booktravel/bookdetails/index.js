// pages/booktravel/bookdetails/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookSrc : '',
    author : '',
    title : '',
    summary : '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let isbn = options.isbn
    wx.request({
      url: 'https://api.douban.com/v2/book/isbn/'+isbn,
      header: {
        'Content-Type' : 'json', //一个坑，必须要设为json
      },
      success: (res) => {
        console.log(res.data);
        let data = res.data;
        this.setData({
          bookSrc : data.image,
          author : data.author[0],
          title : data.title,
          summary : data.summary,
        });
      }
    })
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