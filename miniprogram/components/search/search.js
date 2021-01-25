// components/searchComponents.js
const app = getApp()
const db = wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  options: {
    styleIsolation: 'isolation'
  },
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFocus: false,
    historyList: [],
    searchList: [],
    value: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handlefocus: function () {
      this.setData({
        isFocus: true
      })
      wx.getStorage({
        key: 'searchHistory',
        success: (res) => {
          console.log(res.data)
          this.setData({
            historyList: res.data
          })
        }
      })
    },
    handleblur: function () {

    },
    handleConfirm: function (ev) {
      let val = ev.detail.value
      let cloneHistoryList = [...this.data.historyList]
      cloneHistoryList.unshift(val)
      if (!val == '') {
        wx.setStorage({
          key: "searchHistory",
          data: [...new Set(cloneHistoryList)]
        })
        this.getSearchList(val)
      }
    },
    handleCancel: function () {
      this.setData({
        isFocus: false,
        value: ''
      })
    },
    clearHistory: function () {
      wx.removeStorage({
        key: 'searchHistory',
        success: (res) => {
          this.setData({
            historyList: []
          })
        }
      })
    },
    getSearchList: function (val) {
      if (!val == '') {
        db.collection('users').where({
          nickName: db.RegExp({
            regexp: val,
            options: 'i',
          })
        }).field({
          userPhoto: true,
          nickName: true,
          options: true
        }).get().then((res) => {
          this.setData({
            searchList: res.data
          })
        })
      }
    },
    handleResearch: function (ev) {
      let val = ev.target.dataset.text
      this.setData({
        value: val
      })
      this.getSearchList(val)
    }
  }
})
