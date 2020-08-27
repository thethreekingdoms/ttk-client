import path from 'path'
import logo from './logo'
import contextMenu from './contextMenu'
// import { autoUpdater } from 'electron-updater'
import { app, BrowserWindow, ipcMain, dialog, ipcRenderer } from 'electron'

// var log = require('electron-log')
// log.transports.console.level = false
// log.transports.console.level = 'silly'
const pkg = require('../../package.json')
const feedUrl = "https://ttk-prod-client-update.oss-cn-beijing.aliyuncs.com/download/"
const autoUpdater = require('electron-updater').autoUpdater;

export default ttkclient => () => {
  if (ttkclient.$updateWin) {
    ttkclient.$updateWin.show()
    ttkclient.$updateWin.focus()
    return ttkclient.$updateWin
  }
  const $win = new BrowserWindow({
    title: "升级",
    width: 630,
    height: 398,
    useContentSize: true,
    resizable: false,
    menu: false,
    frame: false,
    parent: ttkclient.$mainWin,
    modal: process.platform !== 'darwin',
    show: false,
    icon: logo,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // $win.webContents.openDevTools();
  $win.on('ready-to-show', () => {
    $win.show()
    $win.focus()
  })

  // 窗口关闭后手动让$window为null
  $win.on('closed', () => {
    ttkclient.$updateWin = null
  })

  $win.webContents.on('dom-ready', () => {
    if (!$win.webContents.isDestroyed()) $win.webContents.send('dom-ready')
  })


  $win.webContents.on('did-finish-load', () => {
    $win.webContents.send('staticData', { "version": pkg.version });
  })


  handleUpdate($win)
  // 右键上下文菜单
  $win.webContents.on('context-menu', (e, params) => {
    e.preventDefault()
    contextMenu($win, params)
  })  // update start
  // let sendUpdateMessage = (message, data) => {
  //   $win.webContents.send('message', { message, data, feedUrl });
  // };

  ipcMain.on('main-window-onlaod', (event, arg) => {
    event.sender.send('main-window-hidden', 'hidden')
  })

  // 加载URL地址
  const URL = process.env.NODE_ENV === 'development'
    ? 'https://erp.jchl.com/#/edfx-app-root/edfx-app-agreement'
    : `file://${path.join(app.getAppPath(), './dist/renderer/updateWin.html')}`

  $win.loadURL(URL)
  return $win
}
/**
 * 自动更新检测
 */


function handleUpdate(e) {
  // 通过main进程发送事件给renderer进程，提示更新信息
  function sendUpdateMessage(obj) {
    e.webContents.send('updateMessage', obj)
  }

  autoUpdater.setFeedURL(feedUrl);
  // 监测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
  const message = {
    error: '检查更新出错',
    checking: '正在检查更新......',
    updateAva: '监测到新版本，正在下载......',
    updateNotAva: '现在使用的就是最新版本，不用下载'
  }

  // 当更新出现错误时触发
  autoUpdater.on('error', (err) => {
    sendUpdateMessage({ action: 'error', errorInfo: err })
  })

  // 当开始检查更新的时候触发
  autoUpdater.on('checking-for-update', () => {
    sendUpdateMessage({ action: 'checking' })
  })

  // 当发现一个可用更新的时候触发，更新下载包会自动开始
  autoUpdater.autoDownload = false;
  autoUpdater.on('update-available', (info) => {
    sendUpdateMessage({ action: 'updateAva', updateInfo: info })
  })

  // 当没有可用更新的时候触发
  autoUpdater.on('update-not-available', (info) => {
    sendUpdateMessage({ action: 'updateNotAva', updateInfo: info })
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', (progressObj) => {
    // console.log('download ...')
    sendUpdateMessage({ action: 'download-progress', updateInfo: progressObj })
  })

  /**
   * event Event
   * releaseNotes String - 新版本更新公告
   * releaseName String - 新的版本号
   * releaseDate Date - 新版本发布的日期
   * updateUrl String - 更新地址
   */
  autoUpdater.on('update-downloaded', (info) => {
    sendUpdateMessage({ action: 'downloadProgress', updateInfo: info })
    // 下载太快可能无法触发downloadProgress事件，所以手动通知一下
    // e.webContents.send('downloadProgress', { percent: 100 })
    // 可以手动选择是否立即退出并更新
    ipcMain.on('isUpdateNow', (e, arg) => {
      autoUpdater.quitAndInstall()
    })
  })

  ipcMain.on('checkForUpdate', () => {
    autoUpdater.checkForUpdates();
  })

  ipcMain.on('downloadUpdate', () => {
    // console.log('begin download package')
    autoUpdater.downloadUpdate();
  })
  ipcMain.on('window-close', () => {
    // console.log('close close')
    e.hide();
  })
  // $win.on('closed', () => {
   
  // })


  // //执行自动更新检查
  // autoUpdater.checkForUpdates();
  // console.log('2222222');
}

