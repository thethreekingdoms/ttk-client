import path from 'path'
import logo from './logo'
import contextMenu from './contextMenu'
import { autoUpdater } from 'electron-updater'
import { app, BrowserWindow, ipcMain } from 'electron'

export default ttkclient => () => {
  if (ttkclient.$settingWin) {
    ttkclient.$settingWin.show()
    ttkclient.$settingWin.focus()
    return ttkclient.$settingWin
  }
  const $win = new BrowserWindow({
    title: '设置',
    width: 320,
    height: 330,
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

  $win.on('ready-to-show', () => {
    $win.show()
    $win.focus()
  })

  // 窗口关闭后手动让$window为null
  $win.on('closed', () => {
    ttkclient.$settingWin = null
  })

  $win.webContents.on('dom-ready', () => {
    $win.webContents.send('dom-ready', ttkclient.setting)
  })

  // 右键上下文菜单
  $win.webContents.on('context-menu', (e, params) => {
    e.preventDefault()
    contextMenu($win, params)
  })

  ipcMain.on('SETTINGWIN:setting', async (e, setting) => {
    ttkclient.setting = setting
    await ttkclient.writeSetting()
    ttkclient.bindShortcut()
    ttkclient.resetTrayMenu()
    if (ttkclient.setting.autoupdate) {
      autoUpdater.checkForUpdates()
    }
    ttkclient.hideSettingWin()
  })

  ipcMain.on('main-window-onlaod', (event, arg) => {
    event.sender.send('main-window-hidden', 'hidden')
  })

  // 加载URL地址
  const URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/settingWin.html'
    : `file://${path.join(app.getAppPath(), './dist/renderer/settingWin.html')}`

  $win.loadURL(URL)
  return $win
}
