// miniprogram/pages/editUserInfo/name/name.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: ''
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
    this.setData({
      nickName: app.globalData.userInfo.nickName
    })
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
  update: function () {
    this.setNickName()
  },
  handleText: function (ev) {
    let value = ev.detail.value
    this.setData({
      nickName: value
    })
  },
  setNickName: function () {
    wx.showLoading({
      title: '提交中',
    })
    db.collection('users').doc(app.globalData.userInfo._id).update({
      data: {
        nickName: this.data.nickName
      }
    }).then((res) => {
      wx.hideLoading({
        success: (res) => {
          wx.showToast({
            title: '提交成功',
          })
          app.globalData.userInfo.nickName = this.data.nickName
        }
      })
    })
  },
  onGetUserInfo: function (ev) {
    let userInfo = ev.detail.userInfo
    if (userInfo) {
      this.setData({
        nickName: userInfo.nickName
      }, () => {
        this.setNickName()
      })
    }
  }
})