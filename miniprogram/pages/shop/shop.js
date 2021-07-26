// miniprogram/pages/shop/shop.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../images/myself.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    current: 'links',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    requestResult: '',
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    listData: [],
    bannerImgs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                logged: true,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.pageInit()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.pageInit()
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

  },

  pageInit: function () {
    this.getBannerImgs()
    db.collection('users').field({
      userPhoto: true,
      nickName: true,
      links: true
    }).orderBy(this.data.current, 'desc').get().then((res) => {
      this.setData({
        logged: true,
        listData: res.data
      })
    })
  },

  getBannerImgs: function () {
    this.setData({
          bannerImgs: [
            {
              id:1,
              fileId:'/images/banner1.jpg'
            },
            {
              id:2,
              fileId:'/images/banner2.jpg'
            },
            {
              id:3,
              fileId:'/images/banner3.jpg'
            }
          ]
    })
    // db.collection('banner').orderBy('file_time', 'desc').limit(3).get().then((res) => {
    //   this.setData({
    //     bannerImgs: res.data
    //   })
    // })
  }
})