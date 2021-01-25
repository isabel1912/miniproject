// miniprogram/pages/detail/detail.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    isFriend: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.userID) {
      let userID = options.userID
      db.collection('users').doc(userID).get().then((res) => {
        this.setData({
          detail: res.data
        })
        let friendList = res.data.friendList;
        if (friendList.includes(app.globalData.userInfo._id)) {
          this.setData({
            isFriend: true
          })
        } else {
          this.setData({
            isFriend: false
          },()=>{
            if(userID == app.globalData.userInfo._id){
              this.setData({
                isFriend:true
              })
            }
          })
        }
      })
    }
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

  },
  handleAddFriend: function () {
    if (app.globalData.userInfo) {
      console.log(this.data.detail._id)
      db.collection('message').where({
        userID: this.data.detail._id
      }).get().then((res) => {
        if (res.data.length) {
          // 更新
          if (res.data[0].list.includes(app.globalData.userInfo._id)) {
            // 已申请
            wx.showToast({
              title: '重复申请',
            })
          } else {
            wx.cloud.callFunction({
              name: 'update',
              data: {
                collection: 'message',
                where: {
                  userID: this.data.detail._id
                },
                data: `{list : _.unshift('${app.globalData.userInfo._id}')}`
              }
            }).then((res) => {
              wx.showToast({
                title: '申请成功2',
              })
            })
          }
        } else {
          // 添加
          db.collection('message').add({
            data: {
              userID: this.data.detail._id,
              list: [app.globalData.userInfo._id]
            }
          }).then((res) => {
            wx.showToast({
              title: '申请成功',
            })
          })
        }
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