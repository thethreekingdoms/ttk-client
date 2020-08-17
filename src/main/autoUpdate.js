import {
  app,
  dialog,
  shell
} from 'electron'
import axios from 'axios'
import { autoUpdater } from 'electron-updater'

export default ttkclient => () => {
  autoUpdater.on('update-downloaded', info => {
    dialog.showMessageBox(ttkclient.$mainWin, {
      type: 'question',
      title: '立即更新',
      message: `新版本${info.version}已经下载完成，是否立即更新？`,
      noLink: true,
      buttons: ['是', '否']
    }, index => {
      if (index === 0) {
        autoUpdater.quitAndInstall()
      }
    })
  })

  autoUpdater.on('error', e => {
    axios.get('http://test.aierp.cn:8089/vendor/releases/latest')
      .then(({ data }) => {
        // 检查版本号
        // 如果本地版本小于远程版本则更新
        if (data.tag_name.slice(1) > app.getVersion()) {
          dialog.showMessageBox(ttkclient.$mainWin, {
            type: 'question',
            title: '版本更新',
            message: '已有新版本更新，是否立即前往下载最新安装包？',
            noLink: true,
            buttons: ['是', '否']
          }, index => {
            if (index === 0) {
              shell.openExternal('http://test.aierp.cn:8089/vendor/releases/latest')
            }
          })
        }
      })
  })

  if (ttkclient.setting.autoupdate) {
    autoUpdater.checkForUpdates()
  }
}
