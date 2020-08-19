<template lang="pug">
.app
  .app-logo
    img.app-logo-image(src='~./logo.png')
    .app-logo-title 金财管家 {{ version }}

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
      homepage
    }
  },
  created() {
    ipcRenderer.on('dom-ready', e => {
      this.setZoomLevel()
    })
  },
  methods: {
    setZoomLevel() {
      // 设置缩放限制
      webFrame.setZoomFactor(100)
      webFrame.setZoomLevel(0)
      webFrame.setVisualZoomLevelLimits(1, 1)
    },
    openURL() {
      // shell.openExternal(this.homepage)
      ipcRenderer.send('icpRender-newWin', this.homepage)
    }
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
