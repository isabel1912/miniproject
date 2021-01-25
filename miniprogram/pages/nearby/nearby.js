// miniprogram/pages/nearby/nearby.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({
  /**
   * 页面的初始数据
   */
  data: {
    latitude: 23.096994,
    longitude: 113.324520,
    iconPath: '',
    markers: [],
    customCalloutMarkerIds: [],
    num: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageInit()
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
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const latitude = res.latitude
        const longitude = res.longitude
        this.setData({
          latitude: latitude,
          longitude: longitude
        })
      }
    })
    this.getNearUsers()
  },
  getNearUsers: function () {
    db.collection('users').where({
      location: _.geoNear({
        geometry: db.Geo.Point(this.data.longitude, this.data.latitude),
        minDistance: 0,
        maxDistance: 5000,
      }),
      isLocation: true
    }).field({
      longitude: true,
      latitude: true,
      userPhoto: true
    }).get().then((res) => {
      let data = res.data
      let result = []
      if (data.length) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].userPhoto.includes('cloud://')) {
            wx.cloud.getTempFileURL({
              fileList: [data[i].userPhoto],
              success: res => {
                result.push({
                  id: data[i]._id,
                  latitude: data[i].latitude,
                  longitude: data[i].longitude,
                  iconPath: res.fileList[0].tempFileURL,
                  width: 30,
                  height: 30
                })
                this.setData({
                  markers: result
                })
              },
              fail: console.error
            })
          } else {
            result.push({
              id: data[i]._id,
              latitude: data[i].latitude,
              longitude: data[i].longitude,
              iconPath: data[i].userPhoto,
              width: 30,
              height: 30
            })
          }
          this.setData({
            markers: result
          })
        }
      }
    })
  },
  markertap:function(ev){
    wx.navigateTo({
      url: '/pages/detail/detail?userID=' + ev.markerId,
    })
  }
})