// miniprogram/pages/myself/myself.js
const app = getApp()
const db = wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    logged: false,
    avatarUrl: '../../images/myself.png',
    nickName: '',
    id: '',
    latitude: '',
    longitude: '',
    disabled: true
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
    this.getLocation()
    this.pageInit()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.pageInit()) {
      this.setData({
        avatarUrl: app.globalData.userInfo.userPhoto,
        nickName: app.globalData.userInfo.nickName,
        id: app.globalData.userInfo._id,
      })
    } else {
      this.pageInit()
    }

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
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then((res) => {
      db.collection('users').where({
        _openid: res.result.event.userInfo.openId
      }).get().then((res) => {
        if (res.data.length) {
          app.globalData.userInfo = {}
          app.globalData.userInfo = Object.assign(app.globalData.userInfo, res.data[0])
          this.setData({
            avatarUrl: app.globalData.userInfo.userPhoto,
            nickName: app.globalData.userInfo.nickName,
            id: app.globalData.userInfo._id,
            logged: true
          })
          this.getMessage()
        } else {
          this.setData({
            disabled: false
          })
        }
      })
    })
  },

  onGetUserInfo: function (ev) {
    let userInfo = ev.detail.userInfo
    if (!this.data.logged && userInfo) {
      db.collection('users').add({
        data: {
          userPhoto: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          signature: '',
          phoneNumber: '',
          wxNumber: '',
          links: '',
          time: new Date(),
          isLocation: true,
          latitude: this.latitude,
          longitude: this.longitude,
          location: db.Geo.Point(this.longitude, this.latitude),
          friendList: []
        }
      }).then((res) => {
        db.collection('users').doc(res._id).get().then((res) => {
          app.globalData.userInfo = Object.assign(app.globalData.userInfo, res.data);
          this.setData({
            avatarUrl: app.globalData.userInfo.avatarUrl,
            nickName: app.globalData.userInfo.nickName,
            id: app.globalData.userInfo._id,
            logged: true
          })
        })
      }).catch((res) => {
        console.log(2, res)
      });
    }

  },
  getMessage: function () {
    console.log('getMessage')
    db.collection('message')
      .where({
        userID: app.globalData.userInfo._id
      })
      .watch({
        onChange: function (snapshot) {
          console.log(snapshot)
          if (snapshot.docChanges.length) {
            let list = snapshot.docChanges[0].doc.list
            if (list.length) {
              wx.showTabBarRedDot({
                index: 2
              })
              app.globalData.userMessage = list
            } else {
              wx.hideTabBarRedDot({
                index: 2
              })
              app.globalData.userMessage = []
            }
          }
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
      })
  },
  getLocation: function () {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.latitude = res.latitude
        this.longitude = res.longitude
      }
    })
  }
})