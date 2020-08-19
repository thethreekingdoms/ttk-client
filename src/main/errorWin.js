import path from 'path'
import logo from './logo'
import { app, BrowserWindow, ipcMain } from 'electron'

export default ttkclient => () => {
  if (ttkclient.$errorWin) {
    ttkclient.$errorWin.show()
    ttkclient.$errorWin.focus()
    return ttkclient.$errorWin
  }

  const $win = new BrowserWindow({
    title: '网络错误',
    width: 600,
    height: 320,
    useContentSize: true,
    resizable: false,
    center: true,
    frame: false,
    menu: false,
    transparent: true,
    show: false,
    closable: false,
    skipTaskbar: true,
    icon: logo,
    webPreferences: {
      nodeIntegration: true
    }
  })

  $win.on('ready-to-show', () => {
    $win.show()
    $win.focus()
  })

  $win.on('closed', () => {
    ttkclient.$errorWin = null
  })

  ipcMain.on('ERRORWIN:retry', () => {
    ttkclient.hideErrorWin()
    if (ttkclient.$mainWin) {
      ttkclient.$mainWin.reload()
      ttkclient.showMainWin()
    }
  })

  ipcMain.on('ERRORWIN:close', () => {
    ttkclient.hideErrorWin()
  })

  // 加载URL地址
  const URL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8080/errorWin.html'
      : `file://${path.join(app.getAppPath(), './dist/renderer/errorWin.html')}`

  $win.loadURL(URL)
  return $win
}
