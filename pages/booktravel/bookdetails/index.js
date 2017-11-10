// pages/booktravel/bookdetails/index.jscon
const  request = require('../../../utils/util').request;
console.log('bookDetails');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isbn : '',
    title : '',
    press : '',
    author: '',
    image : '',
    tags : '',
    summary : '',
    rate : '',
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
        let tags = '';
        data.tags.forEach((v)=>{
          tags += v.name;
        });
        console.log(tags);
        this.setData({
          isbn: isbn,
          title: data.title,
          press: data.publisher,
          author: data.author[0],
          image : data.image,
          tags : tags,
          summary : data.summary,
          rate: data.rating.average,
        });
      }
    })
  },
  publishBook: function (){
    console.log(this.data);
    let bookData = this.data;
    wx.showToast({
      title: '发布中...',
      icon : 'loading',
      mask : false,
      success : function(){
        request({
          url: 'https://liudongtushuguan.cn/publish',
          method: 'POST',
          data: bookData,
          success: (res) => {
            if (res.statusCode === 200) {
              wx.showToast({
                title: '发布成功',
                icon: 'success',
                success : function(){
                  setTimeout(() => {
                    wx.switchTab({
                      url: '../../mybooks/index',
                    });
                  }, 1000);
                }
              })
            }else{
              wx.showToast({
                title: '发布失败',
                icon: 'success',
                success: function () {
                  setTimeout(() => {
                    wx.switchTab({
                      url: '../../mybooks/index',
                    });
                  }, 1000);
                }
              })
            }
          },
          fail : () => {
            wx.showToast({
              title: '发布失败',
              icon: 'success',
              success: function () {
                setTimeout(() =>{
                  wx.switchTab({
                    url: '../../mybooks/index',
                  });
                },1000);
              },
            });
          },
        });
      },

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