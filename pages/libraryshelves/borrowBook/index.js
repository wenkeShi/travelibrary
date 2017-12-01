// pages/libraryshelves/borrowBook/index.js
const request = require('../../../utils/util').request;
const APP = getApp();
const URL = 'https://liudongtushuguan.cn';
let bookId = '';
let isbn = '';


Page({
  /**
   * 页面的初始数据
   */
  data: {
    isbn: '',
    title: '',
    press: '',
    author: '',
    image: '',
    tags: '',
    summary: '',
    rate: '',
    total: 0,
    canBorrow : 0,
    ownerId: '',
    owner : '',
    ownerImage: '',
    visible : false, //表单弹框
    loading : true, //加载
    hidden :true, //隐藏借阅按钮
    infoVisible:false, //输入提示信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    isbn = options.isbn;
    bookId = options.bookId;
    console.log(bookId);
    let that = this;

    wx.request({
      url: 'https://api.douban.com/v2/book/isbn/' + isbn,
      header: {
        'Content-Type': 'json', //一个坑，必须要设为json
      },
      success: (res) => {
        console.log(res.data);
        let data = res.data;
        let tags = '';
        data.tags.forEach((v) => {
          tags += v.name;
        });
        console.log(tags);
        this.setData({
          isbn: isbn,
          title: data.title,
          press: data.publisher,
          author: data.author[0],
          image: data.image,
          tags: tags,
          summary: data.summary,
          rate: data.rating.average,
          loading :false,
        });
      }
    });

   //获取书主的信息
    request({
      url : URL+'/book/ownerInfo?bookId='+bookId,
      success : function(res){
        let data = res.data;
        that.setData({
          ownerId : data.ownerId,
          owner : data.owner,
          ownerImage : data.ownerImage,
          hidden : false,
        });
      },
    });

    this.getBookStatus();
  },

  //获取书籍可借阅数量
  getBookStatus : function(){
    let that = this;
    request({
      url: URL + '/book/status?isbn=' + isbn,
      success: function (res) {
        if(res.statusCode == 200){
          let data = res.data;
          that.setData({
            canBorrow: data.canBorrow,
            total: data.total,
          });
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
        }
      },
    });
  },


  borrowBook : function(){
    this.setData({
      visible : true,
    });
  },


  submit  : function(e){
    console.log(e.detail);
    let wxNum = e.detail.value.wxNum;
    let phoneNum = e.detail.value.phoneNum;
    let msg = e.detail.value.msg;
    let bookData = this.data;

    if (!wxNum || !phoneNum || phoneNum.length != 11){
      this.setData({
        infoVisible : true,
      });
      return;
    }

    this.setData({
      visible : false,
    });
    wx.showLoading({
      title: '发送中...',
    });
  
    request({
      url : URL+'/borrowBook',
      method : 'POST',
      data : {
        isbn: bookData.isbn,
        title: bookData.title,
        press: bookData.press,
        author: bookData.author,
        image: bookData.image,
        rate: bookData.rate,
        bookId : bookId,
      },
      success : function(res){
        if(res.statusCode==200&&!(res.data.error)){  //判断是否已被借阅

        //添加借阅消息
          request({
            url: URL + '/borrowMsg', 
            method: 'POST',
            data: {
              time: new Date().toLocaleString(),
              borrower: APP.globalData.userInfo.nickName,
              book: bookData.title,
              targetId: bookData.ownerId,
              bookId: bookId,   //要加id这样后台才能save成功？？！
              wxNum: wxNum,
              phoneNum: phoneNum,
              msg: msg,
            },
            success: function () {
            },
          });

          //发送socket消息
          let data = JSON.stringify({
            targetId: bookData.ownerId,
            nickName: APP.globalData.userInfo.nickName,
            bookName: bookData.title,
            time: new Date().toLocaleString(),
            bookId: bookId,
            wxNum: wxNum,
            phoneNum: phoneNum,
            msg: msg,
          });
          wx.sendSocketMessage({
            data: data,
          });

          wx.showToast({
            title: '发送成功',
            icon : 'success',
            success : function(){
              setTimeout(function(){
                APP.globalData.libraryUpdate = true;  //设置跳转到tabbar是否刷新的判断值
                wx.switchTab({
                  url: '../index',
                });
              }, 2000);
            },
          });

        }else{
          wx.showToast({
            title: res.data.error || '发送失败',
            image : '../../../images/cancel.png',
          });
          setTimeout(() => {wx.hideToast()}, 2000);
        }
      },
    });
  },


  toOwnerPage : function(){
    let data = this.data;
    wx.navigateTo({
      url: '../../ownerPage/index?id='+data.ownerId+'&nickName='+data.owner+'&image='+data.ownerImage,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.getBookStatus();
  },
  hiddenForm : function(){
    this.setData({
      visible : false,
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