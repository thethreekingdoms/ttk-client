import fs from 'fs'
import path from 'path'
import logo from './logo'
import contextMenu from './contextMenu'
import { app, BrowserWindow } from 'electron'

export default ttkclient => url => {
  if (ttkclient.$emailWin) {
    ttkclient.$emailWin.show()
    ttkclient.$emailWin.focus()
    return ttkclient.$emailWin
  }
  if (!url) return
  const $win = new BrowserWindow({
    title: 'mail',
    width: 980,
    height: 640,
    minWidth: 720,
    minHeight: 450,
    useContentSize: true,
    resizable: true,
    menu: false,
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
    ttkclient.$emailWin = null
  })

  $win.webContents.on('dom-ready', () => {
    ttkclient.$mainWin.webContents.session.cookies.get({ domain: '.ttkclient.com' }, (err, cookies) => {
      if (err) return
      cookies.forEach(cookie => {
        if (cookie.domain !== '.ttkclient.com') return
        $win.webContents.session.cookies.set(
          {
            ...cookie,
            url: 'https://mail.ttkclient.com'
          },
          err => {
            // 回调函数为必传，否则会报错
            console.log('ttkclient emailWin cookies log:', err)
          }
        )
      })
    })

    const filename = path.join(app.getAppPath(), './dist/preload/emailWin.js')
    // 读取js文件并执行
    fs.access(filename, fs.constants.R_OK, err => {
      if (err) return
      fs.readFile(filename, (error, data) => {
        if (error || $win.webContents.isDestroyed()) return
        $win.webContents.executeJavaScript(data.toString()).then(() => {
          if (!$win.webContents.isDestroyed()) {
            $win.webContents.send('dom-ready')
          }
        })
      })
    })
  })

  // 右键菜单
  $win.webContents.on('context-menu', (e, params) => {
    e.preventDefault()
    contextMenu($win, params)
  })

  // 加载URL地址
  $win.loadURL(url)
  return $win
}