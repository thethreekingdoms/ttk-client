import { Tray, Menu } from 'electron'
import { getMessageTrayIcon, getNoMessageTrayIcon } from './logo'

export default class ttkclientTray {
  _ttkclient = null
  // 图标闪烁定时
  _flickerTimer = null

  // 托盘对象
  $tray = null
  // 图标文件
  messageTrayIcon = getMessageTrayIcon()
  noMessageTrayIcon = getNoMessageTrayIcon()

  constructor({ ttkclient }) {
    this._ttkclient = ttkclient
    // 生成托盘图标及其菜单项实例
    this.$tray = new Tray(this.noMessageTrayIcon)
    // 设置鼠标悬浮时的标题
    this.$tray.setToolTip('金财管家')
    this.initEvent()
    this.setMenu()
  }

  /**
   * 初始化事件
   */
  initEvent() {
    this.$tray.on('click', () => this._ttkclient.showMainWin())
    this.$tray.on('double-click', () => this._ttkclient.showMainWin())
  }

  /**
   * 设置菜单
   */
  setMenu() {
    const menu = [
      {
        label: '显示窗口',
        click: () => this._ttkclient.showMainWin()
      },
      // {
      //   label: '系统设置',
      //   click: () => this._ttkclient.showSettingWin()
      // },
      {
        label: '升级',
        click: () => this._ttkclient.showUpdateWin()
      },
      {
        label:'关于金财管家',
        click: () => this._ttkclient.showAboutWin()
      },
      {
        label: '退出程序',
        click: () => this._ttkclient.quit()
      }
    ]

    if (this._ttkclient.setting.enableCapture && false) {
      menu.splice(1, 0, {
        label: '屏幕截图',
        click: () => this._ttkclient.screenshotsCapture()
      })
    }

    // 绑定菜单
    this.$tray.setContextMenu(Menu.buildFromTemplate(menu))
  }

  /**
   * 控制图标是否闪烁
   * @param {Boolean} is
   */
  flicker(is) {
    const { enableFlicker } = this._ttkclient.setting
    if (is) {
      let icon = this.messageTrayIcon
      if (enableFlicker) {
        // 防止连续调用多次，导致图标切换时间间隔不是1000ms
        if (this._flickerTimer !== null) return
        this._flickerTimer = setInterval(() => {
          this.$tray.setImage(icon)
          icon = icon === this.messageTrayIcon ? this.noMessageTrayIcon : this.messageTrayIcon
        }, 1000)
      } else {
        this.$tray.setImage(icon)
      }
    } else {
      clearInterval(this._flickerTimer)
      this._flickerTimer = null
      this.$tray.setImage(this.noMessageTrayIcon)
    }
  }

  /**
   * 判断托盘是否销毁
   */
  isDestroyed() {
    return this.$tray.isDestroyed()
  }

  /**
   * 销毁托盘图标
   */
  destroy() {
    return this.$tray.destroy()
  }
}
