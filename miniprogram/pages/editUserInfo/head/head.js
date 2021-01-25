// miniprogram/pages/editUserInfo/head/head.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: ''
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
      avatarUrl: app.globalData.userInfo.userPhoto
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
    let cloudPath = 'userPhoto/' + app.globalData.userInfo._openid + Date.now() + '.jpg'

    wx.showToast({
      title: '提交中',
    })

    wx.cloud.uploadFile({
      cloudPath,// 上传至云端的路径
      filePath: this.data.avatarUrl, // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        let fileID = res.fileID
        if (fileID) {

          db.collection('users').doc(app.globalData.userInfo._id).update({
            data: {
              userPhoto: fileID
            }
          }).then((res) => {
            wx.hideLoading({
              success: (res) => {
                wx.showToast({
                  title: '提交成功',
                })
                app.globalData.userInfo.userPhoto = fileID
              },
            })
          })
        }
      },
      fail: console.error
    })
  },
  handleUploadImage: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
        this.setData({
          avatarUrl: tempFilePaths
        })
      }
    })
  },
  onGetUserInfo: function (ev) {
    let userInfo = ev.detail.userInfo
    if (userInfo) {
      wx.showToast({
        title: '提交中',
      })
      this.setData({
        avatarUrl: userInfo.avatarUrl
      }, () => {
        db.collection('users').doc(app.globalData.userInfo._id).update({
          data: {
            userPhoto: userInfo.avatarUrl
          }
        }).then((res) => {
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: '提交成功',
              })
            },
          })
          app.globalData.userInfo.userPhoto = userInfo.avatarUrl
        })
      })
    }
  }
})