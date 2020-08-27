TTK桌面版，基于 electron开发，支持 Windows、Linux 和 macOS

## 安装步骤



## 手动构建

```bash
# 安装依赖
npm install

# 打包源码
npm run build

# 生成安装包
npm run pack
```

## 贡献指南


## 截图效果


## 功能说明

1. 本版本是基于网页版和 electron 制作的
2. 本版本与网页版的区别
   - 解决了网页版内容区域无法最大化的问题
   - 除了少数的功能未能够完全实现，其余的使用体验和 PC 版基本一致
3. 支持屏幕截图，并且支持多显示器截图。截图快捷键为`ctrl+alt+a`
4. 添加应用分类，[Linux 系统分类](https://specifications.freedesktop.org/menu-spec/latest/apa.html#main-category-registry)
5. 目前已经支持 Linux、macOS 和 Windows 三个平台
6. 产品中 window.open 打开新的浏览器页签，在客户端中请参考如下示例代码：
```
// openNewWin 打开新窗口的标志
// url 打开新窗口需要加载内容的地址
window.parent.postMessage({ openNewWin: true, url: 'https://jcdz.jchl.com' }, '*')
```
6. 产品中下载其它工具等文件，在客户端中请参考如下示例代码：
```
// downloadsth 下载的标志
// url 下载地址
window.parent.postMessage({ downloadsth: true, url: '' }, '*')
```

## 更新说明

1. 支持屏幕截图，并且支持多显示器截图。截图快捷键为`ctrl+alt+a`
2. 支持网络错误页面提示，网络恢复自动跳转到登陆页面
3. 修改网络错误页面，支持快捷键设置
4. 更新截图功能，支持多显示器截图，目前确认支持 Ubuntu16，Ubuntu17 不支持，其他 Linux 系统未测试，其中使用了[electron-screenshots]模块来实现截图；修复设置页面不修改快捷键时，点击保存时提示错误的 BUG
5. 整个项目采用 webpack 打包，采用 electron-builder 来构建应用，分别构建生成三大平台安装包
6. 添加关于页面，文件下载进度支持，消息提示不弹出问题修复，修复 Linux 更新问题
7. 修复消息提示 node-notifier 图标显示问题
8. 修改消息提示太多不能关闭导致卡顿问题，支持 rpm 打包，升级截图工具
9. 修复视频点击之后页面跳转问题，支持一下 Mac，升级一下 electron
10. 支持自动更新检测设置
11. 支持截图开启和关闭功能
12. 支持新消息托盘图标闪烁开关设置

## TODO

- [x] 支持网络断开时显示错误页
- [x] 添加关于页面
- [x] 消息提示在 windows 上不出来的 BUG，或者替换为 node-notifier 模块
- [x] windows 弹出下载提示问题

## 关于支持加密信息的说明


## 关于 Linux 程序占用资源过高的问题

程序托盘闪烁功能可能会导致占用资源过高，所以新版本可关闭新消息托盘闪烁功能

