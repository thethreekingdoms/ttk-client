import path from 'path'
import logo from './logo'
import { app, BrowserWindow, ipcMain } from 'electron'


export default ttkclient => () => {
  if (ttkclient.$closeWin) {
    ttkclient.$closeWin.show()
    ttkclient.$closeWin.focus()
    return ttkclient.$closeWin
  }
  const $win = new BrowserWindow({
    title: "",
    width: 380,
    height: 120,
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
//   $win.webContents.openDevTools();

  $win.on('ready-to-show', () => {
    $win.show()
    $win.focus()
  })

  // 窗口关闭后手动让$window为null
  $win.on('closed', () => {
    ttkclient.$closeWin = null
  })

  $win.webContents.on('dom-ready', () => {
    if (!$win.webContents.isDestroyed()) $win.webContents.send('dom-ready')
  })

  ipcMain.on('CLOSEWIN:close', (event, arg) => {
    if(arg == 'self') {
        $win.hide()
    } else if(arg == 'all') {
        ttkclient.quit()
    }
  })

  // 加载URL地址
  const URL = process.env.NODE_ENV === 'development'
    ? 'https://erp.jchl.com/#/edfx-app-root/edfx-app-agreement'
    : `file://${path.join(app.getAppPath(), './dist/renderer/closeWin.html')}`

  $win.loadURL(URL)
  return $win
}
