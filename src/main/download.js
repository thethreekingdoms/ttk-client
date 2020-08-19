import { app } from 'electron'
import path from 'path'
import os from 'os'
import fs from 'fs'
const isMac = process.platform === 'darwin'
export default $win => {
  // 文件下载拦截
  const files = []
  /*$win.webContents.session.on('will-download', (event, item, webContents) => {
    const time = Date.now()
    const clientId = `${time}_${files.filter(({ clientId }) => clientId.indexOf(time) === 0).length}`
    files.push({ clientId, item })
    const file = {
      clientId,
      name: item.getFilename(),
      fileSize: item.getTotalBytes(),
      finishSize: item.getReceivedBytes(),
      url: item.getURL(),
      state: item.getState(),
      setSavePath: `file://${path.join(app.getAppPath(), `./dist/renderer/${item.getFilename()}`)}`
    }
    if (!$win.isDestroyed()) {
      webContents.send('MAINWIN:download-start', file)
    }
    // 监听下载过程，计算并设置进度条进度
    item.on('updated', (e, state) => {
      file.state = state
      file.finishSize = item.getReceivedBytes()
      if (!$win.isDestroyed()) {
        webContents.send('MAINWIN:download-updated', file)
        $win.setProgressBar(file.finishSize / file.fileSize)
      }
    })

    // 监听下载结束事件
    item.on('done', (e, state) => {
      file.state = state
      file.finishSize = item.getReceivedBytes()
      if (!$win.isDestroyed()) {
        webContents.send('MAINWIN:download-done', file)
        $win.setProgressBar(-1)
      }
      if (app.dock) {
        app.dock.bounce('informational')
      }
    })
  })*/

  $win.webContents.session.on('will-download', (event, item, webContents) => {
    //设置文件存放位置，如果用户没有设置保存路径，Electron将使用默认方式来确定保存路径（通常会提示保存对话框）
    const pdfLoad = $win.showPdf && $win.showPdf.constructor === Function
    let tmpDir = os.tmpdir(), pdfUrl
    if(isMac) {
      tmpDir = os.tmpDir()
    }
    console.log(tmpDir)
    if(pdfLoad) {
      pdfUrl = `${tmpDir}/${item.getFilename()}`
      item.setSavePath(pdfUrl)
      const pdfFile = fs.exists(pdfUrl, h => {
        if(h) fs.unlinkSync(pdfUrl)
      })
    }
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
        //回显 调用渲染进程方法
        if(pdfLoad && pdfUrl) {
          $win.showPdf(pdfUrl)
        }
        $win.webContents.send('downstate', state)
      } else {
        console.log(`Download failed: ${state}`)
        //回显 调用渲染进程方法
        $win.webContents.send('downstate', state)
      }
    })
  })
}
