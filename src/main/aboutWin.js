import path from 'path'
import logo from './logo'
import contextMenu from './contextMenu'
import { autoUpdater } from 'electron-updater'
import { app, BrowserWindow, ipcMain, dialog } from 'electron'

const feedUrl = `http://127.0.0.1:8080/packages/download/`;
// const feedUrl = `https://huaworld.oss-cn-beijing.aliyuncs.com/DOWNLOAD/win32`;

export default ttkclient => () => {
  if (ttkclient.$aboutWin) {
    ttkclient.$aboutWin.show()
    ttkclient.$aboutWin.focus()
    return ttkclient.$aboutWin
  }
  const $win = new BrowserWindow({
    title: "金财管家",
    width: 1024,
    height: 768,
    useContentSize: true,
    resizable: false,
    menu: false,
    parent: ttkclient.$mainWin,
    modal: process.platform !== 'darwin',
    show: false,
    icon: logo,
    webPreferences: {
      nodeIntegration: true
    }
  })
  $win.webContents.openDevTools();
  $win.on('ready-to-show', () => {
    $win.show()
    $win.focus()
  })

  // 窗口关闭后手动让$window为null
  $win.on('closed', () => {
    ttkclient.$aboutWin = null
  })

  $win.webContents.on('dom-ready', () => {
    if (!$win.webContents.isDestroyed()) $win.webContents.send('dom-ready')
  })

  // 右键上下文菜单
  $win.webContents.on('context-menu', (e, params) => {
    e.preventDefault()
    contextMenu($win, params)
  })  // update start
  let sendUpdateMessage = (message, data) => {
    $win.webContents.send('message', { message, data, feedUrl });
  };

  // let checkForUpdates = () => {
  //   autoUpdater.setFeedURL(feedUrl);

  //   autoUpdater.on('error', function (message) {
  //     sendUpdateMessage('error', message)
  //   });
  //   autoUpdater.on('checking-for-update', function (message) {
  //     sendUpdateMessage('checking-for-update', message)
  //   });
  //   autoUpdater.on('update-available', function (message) {
  //     sendUpdateMessage('update-available', message)
  //   });
  //   autoUpdater.on('update-not-available', function (message) {
  //     dialog.showMessageBox({
  //       type: 'info',
  //       title: '应用有新版本',
  //       message: '发现新版本，是否现在更新?',
  //       buttons: ['是', '否']
  //     }, (buttonIndex) => {
  //       if (buttonIndex === 0) {
  //         autoUpdater.downloadUpdate()
  //         sendUpdateMessage('update-not-available', message)
  //       }

  //     })
  //     // sendUpdateMessage('update-not-available', message)
  //   });

  //   // 更新下载进度事件
  //   autoUpdater.on('download-progress', function (progressObj) {
  //     sendUpdateMessage('downloadProgress', progressObj)
  //   })
  //   autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
  //     ipcMain.on('updateNow', (e, arg) => {
  //       // let exePath = path.dirname(remote.app.getPath('exe'));
  //       // console.log(exePath, '================================================================');
  //       //some code here to handle event
  //       autoUpdater.quitAndInstall();
  //       ttkclient.quit()
  //     })
  //     sendUpdateMessage('isUpdateNow');
  //   });

  //   //执行自动更新检查
  //   autoUpdater.checkForUpdates();
  // };


  /**
   * 自动更新
   */
  function autoUpdate() {
    // 通过main进程发送事件给renderer进程，提示更新信息
    function sendUpdateMessage(obj) {
      $win.webContents.send('updateMessage', obj)
    }

    console.log("autoUpdate start...")

    // 监测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
    const message = {
      error: '检查更新出错',
      checking: '正在检查更新......',
      updateAva: '监测到新版本，正在下载......',
      updateNotAva: '现在使用的就是最新版本，不用下载'
    }

    // 当更新出现错误时触发
    autoUpdater.on('error', (err) => {
      // sendUpdateMessage('error')
      sendUpdateMessage({ action: 'error', errorInfo: err })
    })

    // 当开始检查更新的时候触发
    autoUpdater.on('checking-for-update', () => {
      // sendUpdateMessage('checking')
      sendUpdateMessage({ action: 'checking' })
    })

    // 当发现一个可用更新的时候触发，更新下载包会自动开始
    autoUpdater.autoDownload = true
    autoUpdater.on('update-available', (info) => {
      // sendUpdateMessage('updateAva')
      sendUpdateMessage({ action: 'updateAva', updateInfo: info })
    })

    // 当没有可用更新的时候触发
    autoUpdater.on('update-not-available', (info) => {
      // sendUpdateMessage('updateNotAva')
      sendUpdateMessage({ action: 'updateNotAva', updateInfo: info })
    })

    // 更新下载进度事件
    autoUpdater.on('download-progress', (progressObj) => {
      $win.webContents.send('downloadProgress', progressObj)
    })

    /**
     * event Event
     * releaseNotes String - 新版本更新公告
     * releaseName String - 新的版本号
     * releaseDate Date - 新版本发布的日期
     * updateUrl String - 更新地址
     */
    autoUpdater.on('update-downloaded', (info) => {
      // 下载太快可能无法触发downloadProgress事件，所以手动通知一下
      $win.webContents.send('downloadProgress', { percent: 100 })
      // 可以手动选择是否立即退出并更新
      ipcMain.on('isUpdateNow', (e, arg) => {
        // some code here to handle event
        autoUpdater.quitAndInstall()
      })
    })

    ipcMain.on('checkForUpdate', () => {
      // 执行自动更新检查
      autoUpdater.checkForUpdates()
    })

    ipcMain.on('downloadUpdate', () => {
      // 下载
      autoUpdater.downloadUpdate()
    })

    //执行自动更新检查
    autoUpdater.checkForUpdates();
  }


  // // 通过main进程发送事件给renderer进程，提示更新信息
  // function sendUpdateMessage(text) {
  //   $win.webContents.send('message', text)
  // }



  ipcMain.on('ABOUTWIN:checkForUpdates', () => {
    // autoUpdater.checkForUpdates()
    // checkForUpdates()
    console.log("===开始升级===")
    autoUpdate();
  })

  ipcMain.on('main-window-onlaod', (event, arg) => {
    event.sender.send('main-window-hidden', 'hidden')
  })

  // 加载URL地址
  const URL = process.env.NODE_ENV === 'development'
    ? 'https://erp.jchl.com/#/edfx-app-root/edfx-app-agreement'
    : `file://${path.join(app.getAppPath(), './dist/renderer/aboutWin.html')}`

  $win.loadURL(URL)
  return $win
}
