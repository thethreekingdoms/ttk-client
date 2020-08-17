import fs from 'fs'
import path from 'path'
import logo from './logo'
import download from './download'
import autoUpdate from './autoUpdate'
import contextMenu from './contextMenu'
import { app, BrowserWindow, shell, ipcMain, Menu, dialog } from 'electron'
import PDFWindow from 'electron-pdf-window'


let lastUrl
let time = Date.now()
const isMac = process.platform === 'darwin'

/**
 * 打开外部链接
 * @param {String} url
 */
function openExternal(url) {
  if (url === 'about:blank') return
  if (url === '//erp.jchl.com/#/edfx-app-root/ttk-zs-app-login') return
  if (url.indexOf('//erp.jchl.com/vendor/download') === 0) return
  if (url.indexOf('//erp.jchl.com/vendor/attachment') === 0) return
  // 防止短时间快速点击链接
  if (lastUrl === url && Date.now() - time < 800) return
  lastUrl = url
  time = Date.now()
  shell.openExternal(url)
}

export default ttkclient => () => {
  if (ttkclient.$mainWin) {
    ttkclient.showMainWin()
    return
  }
  // 创建浏览器窗口
  const $win = new BrowserWindow({
    title: '金财管家客户端',
    width: 630,
    height: 380,
    minWidth: 630,
    minHeight: 380,
    useContentSize: true,
    center: true,
    frame: false,
    show: false,
    backgroundColor: '#0066b3',
    icon: logo,
    resizable: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  $win.webContents.openDevTools();
  $win.maximize()
  /*if(isMac) { // Menu
    const menu = Menu.buildFromTemplate(createMenu())
    Menu.setApplicationMenu(menu)
  }*/

  /**
   * 优雅的显示窗口
   */
  $win.once('ready-to-show', () => {
    $win.show()
    $win.focus()

    /**
     * 先让主窗口显示后在执行检查更新
     * 防止对话框跑到主窗口后面
     * 导致窗口点击不了
     */
    autoUpdate(ttkclient)
  })

  /**
   * 窗体关闭事件处理
   * 默认只会隐藏窗口
   */
  /*$win.on('close', e => {
    e.preventDefault()
    $win.hide()
  })*/

  $win.webContents.on('dom-ready', () => {
    // 页面初始化图标不跳动
    if (ttkclient.$tray) ttkclient.$tray.flicker(false)
    const filename = path.join(app.getAppPath(), './dist/preload/mainWin.js')
    // 读取js文件并执行
    fs.access(filename, fs.constants.R_OK, err => {
      if (err) return
      fs.readFile(filename, (error, data) => {
        if (error || $win.webContents.isDestroyed()) return
        $win.webContents.executeJavaScript(data.toString(), () => {
          if (!$win.webContents.isDestroyed()) $win.webContents.send('dom-ready')
        })
      })
    })
  })

  // 右键菜单
  $win.webContents.on('context-menu', (e, params) => {
    e.preventDefault()
    contextMenu($win, params)
  })

  // 浏览器中打开链接
  $win.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    openExternal(url)
  })

  // 主窗口导航拦截
  $win.webContents.on('will-navigate', (e, url) => {
    e.preventDefault()
    openExternal(url)
  })

  /**
  * 程序坞图标打开窗口
  */
  app.on('activate', () => {
    $win.show()
    $win.focus()
  })

  ipcMain.on('MAINWIN:window-minimize', () => $win.minimize())

  ipcMain.on('MAINWIN:window-maximization', () => {
    if ($win.isMaximized()) {
      $win.unmaximize()
    } else {
      $win.maximize()
    }
  })

  // ipcMain.on('MAINWIN:window-close', () => $win.hide())
  ipcMain.on('MAINWIN:window-close', () => {
    if (isMac) {
      dialog.showMessageBox({
        type: "info", //图标类型
        title: "关闭提示", //信息提示框标题
        message: "点击确定将退出此程序", //信息提示框内容
        buttons: ["确定", "取消"], //下方显示的按钮
        icon: logo,
        cancelId: 2 //点击x号关闭返回值
      }, function (index) {
        if (index == 0) {
          app.quit()
        }
      })
    } else {
      ttkclient.showCloseWin()
    }
  })
  ipcMain.on('MAINWIN:open-email', (e, url) => ttkclient.showEmailWin(url))

  ipcMain.on('MAINWIN:window-show', () => {
    $win.show()
    $win.focus()
  })

  ipcMain.on('MAINWIN:badge', (e, count) => {
    app.setBadgeCount(count)
    if (ttkclient.$tray) ttkclient.$tray.flicker(!!count)
    if (app.dock) {
      app.dock.show()
      app.dock.bounce('critical')
    }
  })

  ipcMain.on('icpRender-pdfLoad', function (event, args) {
    const newwin = new BrowserWindow({
      title: '',
      width: 600,
      height: 400,
      parent: $win,
    })
    newwin.loadURL(args)
    const pdfWin = new PDFWindow({
      width: 600,
      height: 400,
      title: '文件正在加载...'
    })
    $win.showPdf = function (pdfUrl) {
      newwin.hide()
      pdfWin.loadURL(pdfUrl)
      pdfWin.maximize();
      $win.showPdf = null
    }
    return newwin
  })

  ipcMain.on('icpRender-pdfPrint', function (event, args) {
    const pdfWin = new PDFWindow({
      width: 600,
      height: 400,
      title: '文件正在加载...'
    })
    pdfWin.loadURL(args)
    $win.showPdf = function (pdfUrl) {
      pdfWin.loadURL(pdfUrl)
      pdfWin.maximize();
      $win.showPdf = null
    }
  })

  ipcMain.on('icpRender-message', function (event, args) {
    if (args === 'icpRender-message') {
      $win.maximize();
    }
  })

  ipcMain.on('icpRender-newWin', function (event, args) {
    const newwin = new BrowserWindow({
      title: '',
      width: 600,
      height: 400,
      parent: $win,
    })
    newwin.maximize();
    newwin.loadURL(args)
    return newwin
  })

  ipcMain.on('icpRender-download', function (event, args) {
    $win.webContents.downloadURL(args)
  })

  download($win)
  // 加载URL地址
  // $win.loadURL('http://test.aierp.cn:8089/#/edfx-app-root/ttk-zs-app-login')
  console.log(process.env.NODE_ENV)
  const loadFileUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/aboutWin.html'
    : `file://${path.join(app.getAppPath(), './dist/renderer/index.html')}`
  // const loadFileUrl = path.join(__dirname, '../renderer/index.html')
  $win.loadURL(loadFileUrl)


  return $win
}


function createMenu() {
  // Menu
  const template = [{
    label: '编辑',
    submenu: [{
      label: '撤销',
      accelerator: 'CmdOrCtrl+Z',
      role: 'undo'
    }, {
      label: '重做',
      accelerator: 'Shift+CmdOrCtrl+Z',
      role: 'redo'
    }, {
      type: 'separator'
    }, {
      label: '复制',
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    }, {
      label: '粘贴',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste'
    }]
  }, {
    label: '帮助',
    role: 'help',
    submenu: [{
      label: '学习更多',
      click: function () {
        electron.shell.openExternal('http://electron.atom.io')
      }
    }]
  }];


  return template
}
