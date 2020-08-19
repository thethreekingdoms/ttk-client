import { globalShortcut } from 'electron'

export default ttkclient => () => {
  const actions = {
    'screenshots-capture': () => ttkclient.screenshotsCapture()
  }
  const keymap = ttkclient.setting.keymap

  if (!ttkclient.setting.enableCapture) delete actions['screenshots-capture']

  // 注销所有的快捷键
  globalShortcut.unregisterAll()
  Object.keys(actions).forEach(key => {
    if (keymap[key] && keymap[key].length) {
      globalShortcut.register(keymap[key].join('+'), actions[key])
    }
  })
}
