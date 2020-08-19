import fs from 'fs'
import path from 'path'
import { app } from 'electron'

/**
 * 初始化设置选项
 */
export const initSetting = ttkclient => () => {
  const filename = path.join(app.getPath('userData'), 'setting.json')
  return new Promise((resolve, reject) => {
    fs.access(filename, fs.constants.R_OK | fs.constants.W_OK, async err => {
      if (err) {
        if (err.code === 'ENOENT') {
          return resolve(await ttkclient.writeSetting())
        } else {
          return reject(err)
        }
      }
      resolve(await ttkclient.readSetting())
    })
  })
}

/**
 * 从文件中读取设置信息
 */
export const readSetting = ttkclient => () => {
  const filename = path.join(app.getPath('userData'), 'setting.json')
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) return reject(err)
      try {
        const setting = JSON.parse(data)
        if (typeof setting.keymap['screenshots-capture'] === 'string') {
          setting.keymap['screenshots-capture'] = setting.keymap['screenshots-capture'].split('+')
        }
        resolve({ ...ttkclient.setting, ...setting })
      } catch (e) {
        resolve(ttkclient.setting)
      }
    })
  })
}

/**
 * 写入设置到文件
 */
export const writeSetting = ttkclient => () => {
  const filename = path.join(app.getPath('userData'), 'setting.json')
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(ttkclient.setting, null, 2), err => {
      if (err) return reject(err)
      resolve(ttkclient.setting)
    })
  })
}
