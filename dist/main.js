!function(e){var t={};function n(i){if(t[i])return t[i].exports;var o=t[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(i,o,function(t){return e[t]}.bind(null,o));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=10)}([function(e,t){e.exports=require("electron")},function(e,t){e.exports=require("path")},function(e,t){e.exports=function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}},function(e,t){e.exports=require("electron-updater")},function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("os")},function(e,t){e.exports=require("electron-pdf-window")},function(e,t){e.exports=require("events")},function(e,t){e.exports=require("axios")},function(e,t){e.exports=require("electron-screenshots")},function(e,t,n){"use strict";n.r(t);var i=n(2),o=n.n(i),s=n(0),a=n(1),r=n.n(a),l=n(4),c=n.n(l);var d=r.a.join(s.app.getAppPath(),"./resources/logo.png");var p=n(7),u=n.n(p);class h extends u.a{constructor(...e){super(...e),o()(this,"$notify",null)}show(e){this.close(),this.$notify=new s.Notification({title:"客户端",body:e,icon:d}),this.$notify.on("click",()=>{this.close(),this.emit("click")}),this.$notify.show()}close(){this.$notify&&(this.$notify.close(),this.$notify=null)}}var w=n(5),f=n.n(w);const m="darwin"===process.platform;var g=n(8),y=n.n(g),b=n(3),W=e=>()=>{b.autoUpdater.on("update-downloaded",t=>{s.dialog.showMessageBox(e.$mainWin,{type:"question",title:"立即更新",message:`新版本${t.version}已经下载完成，是否立即更新？`,noLink:!0,buttons:["是","否"]},e=>{0===e&&b.autoUpdater.quitAndInstall()})}),b.autoUpdater.on("error",t=>{y.a.get("http://test.aierp.cn:8089/vendor/releases/latest").then(({data:t})=>{t.tag_name.slice(1)>s.app.getVersion()&&s.dialog.showMessageBox(e.$mainWin,{type:"question",title:"版本更新",message:"已有新版本更新，是否立即前往下载最新安装包？",noLink:!0,buttons:["是","否"]},e=>{0===e&&s.shell.openExternal("http://test.aierp.cn:8089/vendor/releases/latest")})})}),e.setting.autoupdate&&b.autoUpdater.checkForUpdates()},$=(e,t)=>{const n={copy:{id:1,label:"复制"},cut:{id:2,label:"剪切"},paste:{id:3,label:"粘贴"},selectall:{id:4,label:"全选"}},{selectionText:i,isEditable:o,editFlags:a}=t,r=Object.keys(n).map(e=>{const{id:t,label:s}=n[e];let r=!1,l=!1;const{canCopy:c,canCut:d,canPaste:p,canSelectAll:u}=a;switch(e){case"copy":l=!!i,r=c;break;case"cut":l=!!o,r=l&&!!i&&d;break;case"paste":l=!!o,r=l&&p;break;case"selectall":l=!!o,r=l&&u}return{id:t,label:s,role:e,enabled:r,visible:l}}).filter(e=>e.visible).sort((e,t)=>e.id>t.id);if(r.length&&!e.isDestroyed()){s.Menu.buildFromTemplate(r).popup(e)}},k=n(6),M=n.n(k);let C,v=Date.now();const x="darwin"===process.platform;function P(e){"about:blank"!==e&&"//erp.jchl.com/#/edfx-app-root/ttk-zs-app-login"!==e&&0!==e.indexOf("//erp.jchl.com/vendor/download")&&0!==e.indexOf("//erp.jchl.com/vendor/attachment")&&(C===e&&Date.now()-v<800||(C=e,v=Date.now(),s.shell.openExternal(e)))}var I=e=>()=>{if(e.$mainWin)return void e.showMainWin();const t=new s.BrowserWindow({title:"金财管家客户端",width:630,height:380,minWidth:630,minHeight:380,useContentSize:!0,center:!0,frame:!1,show:!1,backgroundColor:"#0066b3",icon:d,resizable:!0,webPreferences:{nodeIntegration:!0}});t.webContents.openDevTools(),t.maximize(),t.once("ready-to-show",()=>{t.show(),t.focus(),W(e)}),t.webContents.on("dom-ready",()=>{e.$tray&&e.$tray.flicker(!1);const n=r.a.join(s.app.getAppPath(),"./dist/preload/mainWin.js");c.a.access(n,c.a.constants.R_OK,e=>{e||c.a.readFile(n,(e,n)=>{e||t.webContents.isDestroyed()||t.webContents.executeJavaScript(n.toString(),()=>{t.webContents.isDestroyed()||t.webContents.send("dom-ready")})})})}),t.webContents.on("context-menu",(e,n)=>{e.preventDefault(),$(t,n)}),t.webContents.on("new-window",(e,t)=>{e.preventDefault(),P(t)}),t.webContents.on("will-navigate",(e,t)=>{e.preventDefault(),P(t)}),s.app.on("activate",()=>{t.show(),t.focus()}),s.ipcMain.on("MAINWIN:window-minimize",()=>t.minimize()),s.ipcMain.on("MAINWIN:window-maximization",()=>{t.isMaximized()?t.unmaximize():t.maximize()}),s.ipcMain.on("MAINWIN:window-close",()=>{x?s.dialog.showMessageBox({type:"info",title:"关闭提示",message:"点击确定将退出此程序",buttons:["确定","取消"],icon:d,cancelId:2},(function(e){0==e&&s.app.quit()})):e.showCloseWin()}),s.ipcMain.on("MAINWIN:open-email",(t,n)=>e.showEmailWin(n)),s.ipcMain.on("MAINWIN:window-show",()=>{t.show(),t.focus()}),s.ipcMain.on("MAINWIN:badge",(t,n)=>{s.app.setBadgeCount(n),e.$tray&&e.$tray.flicker(!!n),s.app.dock&&(s.app.dock.show(),s.app.dock.bounce("critical"))}),s.ipcMain.on("icpRender-pdfLoad",(function(e,n){const i=new s.BrowserWindow({title:"",width:600,height:400,parent:t});i.loadURL(n);const o=new M.a({width:600,height:400,title:"文件正在加载..."});return t.showPdf=function(e){i.hide(),o.loadURL(e),o.maximize(),t.showPdf=null},i})),s.ipcMain.on("icpRender-pdfPrint",(function(e,n){const i=new M.a({width:600,height:400,title:"文件正在加载..."});i.loadURL(n),t.showPdf=function(e){i.loadURL(e),i.maximize(),t.showPdf=null}})),s.ipcMain.on("icpRender-message",(function(e,n){"icpRender-message"===n&&t.maximize()})),s.ipcMain.on("icpRender-newWin",(function(e,n){const i=new s.BrowserWindow({title:"",width:600,height:400,parent:t});return i.maximize(),i.loadURL(n),i})),s.ipcMain.on("icpRender-download",(function(e,n){t.webContents.downloadURL(n)})),(e=>{e.webContents.session.on("will-download",(t,n,i)=>{const o=e.showPdf&&e.showPdf.constructor===Function;let s,a=f.a.tmpdir();if(m&&(a=f.a.tmpDir()),console.log(a),o){s=`${a}/${n.getFilename()}`,n.setSavePath(s);c.a.exists(s,e=>{e&&c.a.unlinkSync(s)})}n.on("updated",(e,t)=>{"interrupted"===t?console.log("Download is interrupted but can be resumed"):"progressing"===t&&(n.isPaused()?console.log("Download is paused"):console.log("Received bytes: "+n.getReceivedBytes()))}),n.once("done",(t,n)=>{"completed"===n?(console.log("Download successfully"),o&&s&&e.showPdf(s),e.webContents.send("downstate",n)):(console.log("Download failed: "+n),e.webContents.send("downstate",n))})})})(t),console.log("production");const n="file://"+r.a.join(s.app.getAppPath(),"./dist/renderer/index.html");return t.loadURL(n),t};var U=e=>()=>{if(e.$aboutWin)return e.$aboutWin.show(),e.$aboutWin.focus(),e.$aboutWin;const t=new s.BrowserWindow({title:"金财管家",width:1024,height:768,useContentSize:!0,resizable:!1,menu:!1,parent:e.$mainWin,modal:"darwin"!==process.platform,show:!1,icon:d,webPreferences:{nodeIntegration:!0}});t.webContents.openDevTools(),t.on("ready-to-show",()=>{t.show(),t.focus()}),t.on("closed",()=>{e.$aboutWin=null}),t.webContents.on("dom-ready",()=>{t.webContents.isDestroyed()||t.webContents.send("dom-ready")}),t.webContents.on("context-menu",(e,n)=>{e.preventDefault(),$(t,n)});s.ipcMain.on("ABOUTWIN:checkForUpdates",()=>{console.log("===开始升级==="),function(){function e(e){t.webContents.send("updateMessage",e)}console.log("autoUpdate start..."),b.autoUpdater.on("error",t=>{e({action:"error",errorInfo:t})}),b.autoUpdater.on("checking-for-update",()=>{e({action:"checking"})}),b.autoUpdater.autoDownload=!0,b.autoUpdater.on("update-available",t=>{e({action:"updateAva",updateInfo:t})}),b.autoUpdater.on("update-not-available",t=>{e({action:"updateNotAva",updateInfo:t})}),b.autoUpdater.on("download-progress",e=>{t.webContents.send("downloadProgress",e)}),b.autoUpdater.on("update-downloaded",e=>{t.webContents.send("downloadProgress",{percent:100}),s.ipcMain.on("isUpdateNow",(e,t)=>{b.autoUpdater.quitAndInstall()})}),s.ipcMain.on("checkForUpdate",()=>{b.autoUpdater.checkForUpdates()}),s.ipcMain.on("downloadUpdate",()=>{b.autoUpdater.downloadUpdate()}),b.autoUpdater.checkForUpdates()}()}),s.ipcMain.on("main-window-onlaod",(e,t)=>{e.sender.send("main-window-hidden","hidden")});const n="file://"+r.a.join(s.app.getAppPath(),"./dist/renderer/aboutWin.html");return t.loadURL(n),t};class S{constructor({ttkclient:e}){o()(this,"_ttkclient",null),o()(this,"_flickerTimer",null),o()(this,"$tray",null),o()(this,"messageTrayIcon","darwin"===process.platform?r.a.join(s.app.getAppPath(),"./resources/tray/n-16x16.png"):"win32"===process.platform||s.screen.getPrimaryDisplay().scaleFactor>1?r.a.join(s.app.getAppPath(),"./resources/tray/n-64x64.png"):r.a.join(s.app.getAppPath(),"./resources/tray/n-20x20.png")),o()(this,"noMessageTrayIcon","darwin"===process.platform?r.a.join(s.app.getAppPath(),"./resources/tray/16x16.png"):"win32"===process.platform||s.screen.getPrimaryDisplay().scaleFactor>1?r.a.join(s.app.getAppPath(),"./resources/tray/64x64.png"):r.a.join(s.app.getAppPath(),"./resources/tray/20x20.png")),this._ttkclient=e,this.$tray=new s.Tray(this.noMessageTrayIcon),this.$tray.setToolTip("金财管家"),this.initEvent(),this.setMenu()}initEvent(){this.$tray.on("click",()=>this._ttkclient.showMainWin()),this.$tray.on("double-click",()=>this._ttkclient.showMainWin())}setMenu(){const e=[{label:"打开主窗口",click:()=>this._ttkclient.showMainWin()},{label:"系统设置",click:()=>this._ttkclient.showSettingWin()},{label:"关于",click:()=>this._ttkclient.showAboutWin()},{label:"退出",click:()=>this._ttkclient.quit()}];this._ttkclient.setting.enableCapture&&e.splice(1,0,{label:"屏幕截图",click:()=>this._ttkclient.screenshotsCapture()}),this.$tray.setContextMenu(s.Menu.buildFromTemplate(e))}flicker(e){const{enableFlicker:t}=this._ttkclient.setting;if(e){let e=this.messageTrayIcon;if(t){if(null!==this._flickerTimer)return;this._flickerTimer=setInterval(()=>{this.$tray.setImage(e),e=e===this.messageTrayIcon?this.noMessageTrayIcon:this.messageTrayIcon},1e3)}else this.$tray.setImage(e)}else clearInterval(this._flickerTimer),this._flickerTimer=null,this.$tray.setImage(this.noMessageTrayIcon)}isDestroyed(){return this.$tray.isDestroyed()}destroy(){return this.$tray.destroy()}}var j=n(9),A=n.n(j);new class{constructor(){if(o()(this,"_ready",null),o()(this,"$tray",null),o()(this,"$mainWin",null),o()(this,"$emailWin",null),o()(this,"$errorWin",null),o()(this,"$settingWin",null),o()(this,"$aboutWin",null),o()(this,"$closeWin",null),o()(this,"$screenshots",null),o()(this,"online",null),o()(this,"$autoUpdater",null),o()(this,"setting",{autoupdate:!0,enableCapture:!0,enableFlicker:!0,keymap:{"screenshots-capture":["Control","Alt","A"]}}),!s.app.requestSingleInstanceLock())return s.app.quit();this.init().then(()=>{s.app.setAppUserModelId("com.electron.ttkclient"),s.Menu.setApplicationMenu(null),this.initMainWin(),this.initTray(),this.initScreenshots(),this.initNotify(),this.bindShortcut()})}async init(){var e;return(e=this,()=>{s.ipcMain.on("online",(t,n)=>{!1===n?null===e.online&&e.showErrorWin():e.hideErrorWin(),e.online=n})})(),this.setting=await(e=>()=>{const t=r.a.join(s.app.getPath("userData"),"setting.json");return new Promise((n,i)=>{c.a.access(t,c.a.constants.R_OK|c.a.constants.W_OK,async t=>{if(t)return"ENOENT"===t.code?n(await e.writeSetting()):i(t);n(await e.readSetting())})})})(this)(),s.app.on("second-instance",(e,t,n)=>this.showMainWin()),s.app.once("window-all-closed",()=>{"darwin"!==process.platform&&(this.$tray&&!this.$tray.isDestroyed()&&(this.$tray.destroy(),this.$tray=null),s.app.quit())}),s.app.whenReady()}initMainWin(){this.$mainWin=I(this)()}initTray(){this.$tray=new S({ttkclient:this})}initScreenshots(){this.$screenshots=new A.a}initAutoUpdaterCheck(){this.$autoUpdater=new W}initNotify(){this.$notify=new h,s.ipcMain.on("notify",(e,t)=>this.$notify.show(t)),this.$notify.on("click",()=>this.showMainWin())}readSetting(){return(e=this,()=>{const t=r.a.join(s.app.getPath("userData"),"setting.json");return new Promise((n,i)=>{c.a.readFile(t,(t,o)=>{if(t)return i(t);try{const t=JSON.parse(o);"string"==typeof t.keymap["screenshots-capture"]&&(t.keymap["screenshots-capture"]=t.keymap["screenshots-capture"].split("+")),n({...e.setting,...t})}catch(t){n(e.setting)}})})})();var e}writeSetting(){return(e=this,()=>{const t=r.a.join(s.app.getPath("userData"),"setting.json");return new Promise((n,i)=>{c.a.writeFile(t,JSON.stringify(e.setting,null,2),t=>{if(t)return i(t);n(e.setting)})})})();var e}quit(){s.BrowserWindow.getAllWindows().forEach(e=>e.destroy()),"darwin"!==process.platform&&(this.$tray&&!this.$tray.isDestroyed()&&(this.$tray.destroy(),this.$tray=null),s.app.quit())}bindShortcut(){var e;(e=this,()=>{const t={"screenshots-capture":()=>e.screenshotsCapture()},n=e.setting.keymap;e.setting.enableCapture||delete t["screenshots-capture"],s.globalShortcut.unregisterAll(),Object.keys(t).forEach(e=>{n[e]&&n[e].length&&s.globalShortcut.register(n[e].join("+"),t[e])})})()}showMainWin(){this.$mainWin&&(this.online?(this.$mainWin.isMinimized()&&this.$mainWin.restore(),this.$mainWin.show(),this.$mainWin.focus()):!1===this.online&&this.showErrorWin())}screenshotsCapture(){this.$screenshots&&this.$screenshots.startCapture()}showEmailWin(e){var t;this.$emailWin=(t=this,e=>{if(t.$emailWin)return t.$emailWin.show(),t.$emailWin.focus(),t.$emailWin;if(!e)return;const n=new s.BrowserWindow({title:"mail",width:980,height:640,minWidth:720,minHeight:450,useContentSize:!0,resizable:!0,menu:!1,show:!1,icon:d,webPreferences:{nodeIntegration:!0}});return n.on("ready-to-show",()=>{n.show(),n.focus()}),n.on("closed",()=>{t.$emailWin=null}),n.webContents.on("dom-ready",()=>{t.$mainWin.webContents.session.cookies.get({domain:".ttkclient.com"},(e,t)=>{e||t.forEach(e=>{".ttkclient.com"===e.domain&&n.webContents.session.cookies.set({...e,url:"https://mail.ttkclient.com"},e=>{console.log("ttkclient emailWin cookies log:",e)})})});const e=r.a.join(s.app.getAppPath(),"./dist/preload/emailWin.js");c.a.access(e,c.a.constants.R_OK,t=>{t||c.a.readFile(e,(e,t)=>{e||n.webContents.isDestroyed()||n.webContents.executeJavaScript(t.toString()).then(()=>{n.webContents.isDestroyed()||n.webContents.send("dom-ready")})})})}),n.webContents.on("context-menu",(e,t)=>{e.preventDefault(),$(n,t)}),n.loadURL(e),n})(e)}showErrorWin(){var e;this.$errorWin=(e=this,()=>{if(e.$errorWin)return e.$errorWin.show(),e.$errorWin.focus(),e.$errorWin;const t=new s.BrowserWindow({title:"网络错误",width:600,height:320,useContentSize:!0,resizable:!1,center:!0,frame:!1,menu:!1,transparent:!0,show:!1,closable:!1,skipTaskbar:!0,icon:d,webPreferences:{nodeIntegration:!0}});t.on("ready-to-show",()=>{t.show(),t.focus()}),t.on("closed",()=>{e.$errorWin=null}),s.ipcMain.on("ERRORWIN:retry",()=>{e.hideErrorWin(),e.$mainWin&&(e.$mainWin.reload(),e.showMainWin())}),s.ipcMain.on("ERRORWIN:close",()=>{e.hideErrorWin()});const n="file://"+r.a.join(s.app.getAppPath(),"./dist/renderer/errorWin.html");return t.loadURL(n),t})()}hideErrorWin(){this.$errorWin&&this.$errorWin.close()}showSettingWin(){var e;this.$settingWin=(e=this,()=>{if(e.$settingWin)return e.$settingWin.show(),e.$settingWin.focus(),e.$settingWin;const t=new s.BrowserWindow({title:"设置",width:320,height:330,useContentSize:!0,resizable:!1,menu:!1,parent:e.$mainWin,modal:"darwin"!==process.platform,show:!1,icon:d,webPreferences:{nodeIntegration:!0}});t.on("ready-to-show",()=>{t.show(),t.focus()}),t.on("closed",()=>{e.$settingWin=null}),t.webContents.on("dom-ready",()=>{t.webContents.send("dom-ready",e.setting)}),t.webContents.on("context-menu",(e,n)=>{e.preventDefault(),$(t,n)}),s.ipcMain.on("SETTINGWIN:setting",async(t,n)=>{e.setting=n,await e.writeSetting(),e.bindShortcut(),e.resetTrayMenu(),e.setting.autoupdate&&b.autoUpdater.checkForUpdates(),e.hideSettingWin()}),s.ipcMain.on("main-window-onlaod",(e,t)=>{e.sender.send("main-window-hidden","hidden")});const n="file://"+r.a.join(s.app.getAppPath(),"./dist/renderer/settingWin.html");return t.loadURL(n),t})()}hideSettingWin(){this.$settingWin&&this.$settingWin.close()}resetTrayMenu(){this.$tray&&!this.$tray.isDestroyed()&&this.$tray.setMenu()}showAboutWin(){this.$aboutWin=U(this)()}showCloseWin(){var e;this.$closeWin=(e=this,()=>{if(e.$closeWin)return e.$closeWin.show(),e.$closeWin.focus(),e.$closeWin;const t=new s.BrowserWindow({title:"",width:380,height:120,useContentSize:!0,resizable:!1,menu:!1,parent:e.$mainWin,modal:"darwin"!==process.platform,show:!1,icon:d,webPreferences:{nodeIntegration:!0}});t.on("ready-to-show",()=>{t.show(),t.focus()}),t.on("closed",()=>{e.$closeWin=null}),t.webContents.on("dom-ready",()=>{t.webContents.isDestroyed()||t.webContents.send("dom-ready")}),s.ipcMain.on("CLOSEWIN:close",(n,i)=>{"self"==i?t.hide():"all"==i&&e.quit()});const n="file://"+r.a.join(s.app.getAppPath(),"./dist/renderer/closeWin.html");return t.loadURL(n),t})()}}}]);
//# sourceMappingURL=main.js.map