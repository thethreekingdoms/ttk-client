import { ipcMain } from 'electron'

export default ttkclient => () => {
  ipcMain.on('online', (e, online) => {
    if (online === false) {
      // 第一次启动窗口
      if (ttkclient.online === null) {
        ttkclient.showErrorWin()
      }
    } else {
      ttkclient.hideErrorWin()
    }
    ttkclient.online = online
  })
}
