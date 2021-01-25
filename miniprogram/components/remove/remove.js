// components/remove/remove.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    messageId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    userMessage: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleRemove: function () {
      let that = this
      wx.showModal({
        title: '提示',
        content: '确认删除？',
        success(res) {
          if (res.confirm) {
            that.removeMessage()
          } else if (res.cancel) { }
        }
      })
    },
    handleAddFriend: function () {
      let that = this
      wx.showModal({
        title: '好友申请',
        content: '是否同意',
        success(res) {
          if (res.confirm) {
            db.collection('users').doc(app.globalData.userInfo._id).update({
              data: {
                friendList: _.unshift(that.data.messageId)
              }
            }).then((res) => { })
            wx.cloud.callFunction({
              name: 'update',
              data: {
                collection: 'users',
                doc: that.data.messageId,
                data: `{friendList: _.unshift('${app.globalData.userInfo._id}')}`
              }
            }).then((res) => { })
            that.removeMessage()
          } else if (res.cancel) { }
        }
      })
    },
    removeMessage: function () {
      console.log(3,this)
      db.collection('message').where({
        userID: app.globalData.userInfo._id
      }).get().then((res) => {
        let list = res.data[0].list
        list = list.filter((val, i) => {
          return val != this.data.messageId
        })
        wx.cloud.callFunction({
          name: 'update',
          data: {
            collection: 'message',
            where: {
              userID: app.globalData.userInfo._id
            },
            data: {
              list
            }
          }
        }).then((res) => {
          // 组件触发事件
          this.triggerEvent('myevent', list)
        })
      })
    }
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      db.collection('users').doc(this.data.messageId).field({
        userPhoto: true,
        nickName: true
      }).get().then((res) => {
        this.setData({
          userMessage: res.data
        })
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    }
  }
})
