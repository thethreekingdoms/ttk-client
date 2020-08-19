import path from 'path'
import logo from './logo'
import contextMenu from './contextMenu'
// import { autoUpdater } from 'electron-updater'
import { app, BrowserWindow, ipcMain, dialog } from 'electron'
// var log = require('electron-log')
// log.transports.console.level = false
// log.transports.console.level = 'silly'


export default ttkclient => () => {
  if (ttkclient.$aboutWin) {
    ttkclient.$aboutWin.show()
    ttkclient.$aboutWin.focus()
    return ttkclient.$aboutWin
  }
  const $win = new BrowserWindow({
    title: "金财管家",
    width: 320,
    height: 400,
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
  // $win.webContents.openDevTools();
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
  // let sendUpdateMessage = (message, data) => {
  //   $win.webContents.send('message', { message, data, feedUrl });
  // };

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
