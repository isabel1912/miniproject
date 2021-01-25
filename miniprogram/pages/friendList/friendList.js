// miniprogram/pages/friendList/friendList.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendList: [],
    logged: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if (app.globalData.userInfo._id) {
      this.setData({
        logged: true
      })
      db.collection('users').where({
        friendList: app.globalData.userInfo._id
      }).get().then((res) => {
        this.setData({
          friendList: res.data
        })
      })
    } else {
      wx.showToast({
        title: '请登录',
        duration: 2000,
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '../../pages/myself/myself',
            }, 2000)
          })
        }
      })
    }


  }
})