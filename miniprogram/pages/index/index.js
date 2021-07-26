//index.js
const app = getApp()
const db = wx.cloud.database()

Page({
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

  onLoad: function () {
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
  onShow: function () {
    this.pageInit()
  },
  onReady: function () {
    this.pageInit()
  },

  pageInit: function () {
    this.getBannerImgs()
    console.log(this.getBannerImgs())
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

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        logged: true
      })
    }
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          // url: '../userConsole/userConsole',
          url: '../index/index',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  handleLinks: function (ev) {
    // data: "{links:_.inc(1)}"
    let id = ev.currentTarget.dataset.id;
    console.log(ev)
    console.log(ev.target)
    wx.cloud.callFunction({
      name: 'update',
      data: {
        collection: 'users',
        doc: id,
        data: "{links:_.inc(1)}"
      }
    }).then((res) => {
      console.log(res)
      console.log(res.result)
      this.onReady();
    })
  },
  handleCurrent: function (ev) {
    let current = ev.target.dataset.current;
    if (current === this.data.current) {
      return false;
    }
    this.setData({
      current
    }, () => {
      this.pageInit()
    })
  },
  handleDetail: function (ev) {
    let id = ev.target.dataset.id
    console.log(ev)
    wx.navigateTo({
      url: '/pages/detail/detail?userID=' + id
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
