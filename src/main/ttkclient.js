import { app, Menu, ipcMain, BrowserWindow } from 'electron'
import path from 'path'
import { initSetting, readSetting, writeSetting } from './setting'
import online from './online'
import Notify from './notify'
import mainWin from './mainWin'
import emailWin from './emailWin'
import errorWin from './errorWin'
import aboutWin from './aboutWin'
import shortcut from './shortcut'
import settingWin from './settingWin'
import ttkclientTray from './ttkclientTray'
import closeWin from './closeWin'
import Screenshots from 'electron-screenshots'
import autoUpdater from './autoUpdate'

export default class ttkclient {
  // app对象是否ready
  _ready = null
  // 托盘图标
  $tray = null
  // 主窗口
  $mainWin = null
  // 邮箱窗口
  $emailWin = null
  // 错误窗口
  $errorWin = null
  // 设置窗口
  $settingWin = null
  // 关于窗口
  $aboutWin = null
  // 关闭提示窗口
  $closeWin = null
  // 截图对象
  $screenshots = null
  // 网络情况，默认为null，必须等到页面报告状态
  online = null
  //自动更新问题
  $autoUpdater = null
  // 默认配置
  setting = {
    autoupdate: true,
    enableCapture: true,
    enableFlicker: true,
    keymap: {
      'screenshots-capture': ['Control', 'Alt', 'A']
    }
  }

  constructor() {
    if (!app.requestSingleInstanceLock()) return app.quit()

    // flash
    // app.commandLine.appendSwitch('ppapi-flash-path', `file://${path.join(app.getAppPath(), './resources/pepflashplayer.dll')}`);
    // app.commandLine.appendSwitch('ppapi-flash-path', app.getPath('pepperFlashSystemPlugin'));
    // app.commandLine.appendSwitch('ppapi-flash-version', '32.0.0.363');

    this.init().then(() => {
      app.setAppUserModelId('com.electron.ttkclient')
      // 移除窗口菜单
      Menu.setApplicationMenu(null)
      this.initMainWin()
      this.initTray()
      this.initScreenshots()
      this.initNotify()
      this.bindShortcut()
      // this.initAutoUpdaterCheck()
    })
  }

  /**
   * 初始化
   * @return {Promise} setting
   */
  async init() {
    online(this)()
    this.setting = await initSetting(this)()
    // 重复打开应用就显示窗口
    app.on('second-instance', (event, commandLine, workingDirectory) => this.showMainWin())

    /* app.setLoginItemSettings({
      openAtLogin: true, // Boolean 在登录时启动应用
      openAsHidden: true, // Boolean (可选) mac 表示以隐藏的方式启动应用。~~~~
      // path: '', String (可选) Windows - 在登录时启动的可执行文件。默认为 process.execPath.
      // args: [] String Windows - 要传递给可执行文件的命令行参数。默认为空数组。注意用引号将路径换行。
    }) */

    // 所有窗口关闭之后退出应用
    app.once('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        if (this.$tray && !this.$tray.isDestroyed()) {
          this.$tray.destroy()
          this.$tray = null
        }
        app.quit()
      }
    })
    return app.whenReady()
  }

  /**
   * 初始化主窗口
   */
  initMainWin() {
    this.$mainWin = mainWin(this)()
  }

  /**
   * 初始化托盘图标
   */
  initTray() {
    this.$tray = new ttkclientTray({ ttkclient: this })
  }

  /**
   * 初始化截图
   */
  initScreenshots() {
    this.$screenshots = new Screenshots()
  }


  /**
   * 自动更新检测
   */

  initAutoUpdaterCheck() {
    this.$autoUpdater = new autoUpdater();
  }

  /**
   * 初始化消息提示
   */
  initNotify() {
    this.$notify = new Notify()
    ipcMain.on('notify', (e, body) => this.$notify.show(body))
    this.$notify.on('click', () => this.showMainWin())
  }

  /**
   * 从文件中读取设置信息
   * @return {Promise} setting
   */
  readSetting() {
    return readSetting(this)()
  }

  /**
   * 写入设置到文件
   * @return {Promise} setting
   */
  writeSetting() {
    return writeSetting(this)()
  }

  /**
   * 退出应用
   */
  quit() {
    const windows = BrowserWindow.getAllWindows()
    windows.forEach(item => item.destroy())
    if (process.platform !== 'darwin') {
      if (this.$tray && !this.$tray.isDestroyed()) {
        this.$tray.destroy()
        this.$tray = null
      }
      app.quit()
    }
  }

  /**
   * 绑定快捷键
   */
  bindShortcut() {
    shortcut(this)()
  }

  /**
   * 显示主窗口
   */
  showMainWin() {
    if (this.$mainWin) {
      if (this.online) {
        if (this.$mainWin.isMinimized()) this.$mainWin.restore()
        this.$mainWin.show()
        this.$mainWin.focus()
      } else if (this.online === false) {
        /**
         * this.online === null不显示
         * 因为可能此时还没有初始化online
         * 即$mainWin还没有触发dom-ready
         */
        this.showErrorWin()
      }
    }
  }

  /**
   * 截图
   */
  screenshotsCapture() {
    if (this.$screenshots) {
      this.$screenshots.startCapture()
    }
  }

  /**
   * 显示邮箱窗口
   * @param {Object} storage
   */
  showEmailWin(storage) {
    this.$emailWin = emailWin(this)(storage)
  }

  /**
   * 显示错误窗口
   */
  showErrorWin() {
    this.$errorWin = errorWin(this)()
  }

  /**
   * 隐藏错误窗口
   */
  hideErrorWin() {
    if (this.$errorWin) {
      this.$errorWin.close()
    }
  }

  /**
   * 显示设置窗口
   */
  showSettingWin() {
    this.$settingWin = settingWin(this)()
  }

  /**
   * 关闭设置窗口
   */
  hideSettingWin() {
    if (this.$settingWin) {
      this.$settingWin.close()
    }
  }

  resetTrayMenu() {
    if (this.$tray && !this.$tray.isDestroyed()) {
      this.$tray.setMenu()
    }
  }

  /**
   * 显示关于窗口
   */
  showAboutWin() {
    this.$aboutWin = aboutWin(this)()
  }

  /**
   * 显示关闭窗口
   */
  showCloseWin() {
    this.$closeWin = closeWin(this)()
  }
}
