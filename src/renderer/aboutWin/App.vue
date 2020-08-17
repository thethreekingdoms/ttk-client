<template lang="pug">
.app
  .app-logo
    img.app-logo-image(src='~./logo.png')
    .app-logo-title 金财管家 {{ version }}

  .app-update
    button.app-update-button(@click='checkForUpdates') 检查更新

  .app-info
    .app-info-title {{ author }}
    .app-info-desc {{ description }}
  .app-info
    .app-info-desc(@click='openURL') 服务协议
</template>

<script>
import {
  version,
  description,
  author,
  license,
  homepage
} from '#/package.json'

import {
  webFrame,
  ipcRenderer,
  shell
} from 'electron'

export default {
  name: 'App',
  data() {
    return {
      version,
      description,
      author,
      license,
      homepage,
      dialogUpdateNow: false,
      downloading: false,
      hasNewVersion: false,
      noNewVersion: false,
      downloadPercent: 0,
      showError: false,
      errorInfo: {},
      versionInfoList: []
    }
  },
  destroyed() {
    // 移除事件监听
    ipcRenderer.removeAllListeners('updateMessage')
    ipcRenderer.removeAllListeners('downloadProgress')
    ipcRenderer.removeAllListeners('isUpdateNow')
  },
  created() {
    ipcRenderer.on('dom-ready', e => {
      this.setZoomLevel()
    }),
      ipcRenderer.on('message', (event, { message, data, feedUrl }) => {
        console.log(message, data, feedUrl, '==========');
        switch (message) {
          case 'isUpdateNow':
            if (confirm('现在更新？')) {
              ipcRenderer.send('updateNow');
            }
            break;

          case 'update-not-available':
            console.log('连接异常！！！');
            break;
          default:
            console.log(message)
            // document.querySelector('h1').innerHTML = message;
            break;
        }
      });
  },
  methods: {
    setZoomLevel() {
      // 设置缩放限制
      webFrame.setZoomFactor(100)
      webFrame.setZoomLevel(0)
      webFrame.setVisualZoomLevelLimits(1, 1)
    },
    checkForUpdates() {
      console.log("====开始更新程序====");
      ipcRenderer.send('ABOUTWIN:checkForUpdates');
      // 添加自动更新事件的监听
      ipcRenderer.on('updateMessage', (event, obj) => {
        if (obj.action === 'updateAva') {
          this.hasNewVersion = true
          this.saveVersionInfoList(obj.updateInfo)
          this.versionInfoList = this.getVersionInfoList()
        } else if (obj.action === 'error') {
          this.showError = true
          this.errorInfo = obj.errorInfo
        } else if (obj.action === 'updateNotAva') {
          this.noNewVersion = true
        } else {
          // console.log(text)
        }
      })
    },
    openURL() {
      // shell.openExternal(this.homepage)
      ipcRenderer.send('icpRender-newWin', this.homepage)
    },
    getVersionInfoList() {
      return !localStorage.getItem('versionInfoList') ? [] : JSON.parse(localStorage.getItem('versionInfoList'))
    },
    saveVersionInfoList(updateInfo) {
      let versionInfoListOri = this.getVersionInfoList()
      versionInfoListOri.some((item, index, array) => {
        // 判断是不是已经存在这个版本的信息,如果存在就删除它
        if (updateInfo.version === item.version) {
          array.splice(index, 1)
          return true
        }
      })
      // 将新的版本信息加入列表中
      versionInfoListOri.push(updateInfo)
      localStorage.setItem('versionInfoList', JSON.stringify(versionInfoListOri))
    },
    downloadAndUpdate() {
      this.downloading = true

      // 开始下载
      ipcRenderer.send('downloadUpdate')
      ipcRenderer.on('downloadProgress', (event, progressObj) => {
        this.progress = JSON.stringify(progressObj)
        // console.log(progressObj)
        this.downloadPercent = progressObj.percent.toFixed(0) || 0
        // if(this.downloadPercent === 100) { // 这样写为啥不好使呢？
        if (progressObj.percent === 100) {
          this.downloading = false
          // 询问是否立即更新
          this.dialogUpdateNow = true
        }
      })
    },
    updateNow() {
      // 立刻退出并更新
      ipcRenderer.send('isUpdateNow')
    },
  }
}
</script>

<style lang="less">
@import '~normalize.css';

@font-family: 'PingFang-SC-Medium', 'Source Han Sans', 'Segoe UI',
  'Lucida Grande', Helvetica, Arial, 'Microsoft YaHei', FreeSans, Arimo,
  'Droid Sans', 'wenquanyi micro hei', 'Hiragino Sans GB', 'Hiragino Sans GB W3',
  sans-serif;

*,
*:before,
*:after {
  box-sizing: border-box;
}

html,
body {
  font-family: @font-family;
  color: #333;
  overflow: hidden;
}

.app {
  padding: 40px 15px 15px 15px;

  &-logo {
    text-align: center;

    &-image {
      margin: 0 auto;
      display: block;
      width: 96px;
      height: 96px;
    }

    &-title {
      margin: 10px auto;
      font-size: 18px;
      font-weight: 600;
    }
  }

  &-update {
    text-align: center;
    margin: 10px auto;

    &-button {
      display: inline-block;
      padding: 7px 14px;
      background-color: #fff;
      font-size: 14px;
      border-radius: 3px;
      border: 1px solid #ccc;
      cursor: pointer;
      outline: none;

      &:hover {
        background-color: #f3f3f3;
      }

      &:active {
        box-shadow: inset 0 2px 20px rgba(0, 0, 0, 0.1);
      }
    }
  }

  &-desc {
    margin: 30px auto;
    text-align: center;
    font-size: 15px;
    color: #555;
    word-break: break-all;
  }

  &-info {
    display: flex;
    margin: 10px auto;
    font-size: 15px;

    &-title {
      font-weight: 600;
      color: #777;
      width: 100%;
      display: block;
      text-align: center;
    }

    &-desc {
      flex: 1;
      display: block;
      width: 100%;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #08f;
      cursor: pointer;
    }
  }
}
</style>
