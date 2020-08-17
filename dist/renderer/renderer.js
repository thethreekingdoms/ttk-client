// const { ipcRenderer } = require("electron");

// const ipcRenderer = require('electron').ipcRenderer;
var _app          = document.getElementById("app");
var Upd_app       = document.getElementById("update-app");
var Upd_progress  = document.getElementById("update-progress");
var Upd_version   = document.getElementById("update-version");
var Upd_cv        = document.getElementById("current-version");
var Upd_btn       = document.getElementById("update-btn");
var Upd_lock      = false;
var Upd_percent   = 0;

ipcRenderer.on("staticData",function(event,data){
    // 获取配置项数据
    if(data.version) {
        Upd_cv.innerText=data.version;
        Upd_version.innerText = data.version || '';
        if(typeof window.updateVerson == 'function') _app.innerText = data.version
    }
})

ipcRenderer.on("updateMessage",function(event,data){
    data = data || {};
    var message = data.updateInfo || {};
    console.log(data,message);
    if(data.action=="updateAva"){
        Upd_app.style.display = "block";
        if(message.version) {
            // console.log("正在更新到最新版本：v "+message.version);
            Upd_version.innerText = message.version || '';
        }
    }
    else if(data.action=="updateNotAva"){
        document.getElementById("updateTips").style.display="none";
        console.log("暂无可更新的版本：v "+message.version);
        // Upd_app.style.display = "block";
    }
    else if(data.action=="download-progress"){
        Upd_version.innerText = message.version || '';
        Upd_progress.value = Number(message.percent);
        Upd_percent = Number(message.percent);
    }
    else if(data.action=="downloadProgress"){
         // 下载完成 开始安装
         if(Upd_percent == 100){
            Upd_version.innerText = message.version || '';
            Upd_btn.innerText = "安装重启中...";
            ipcRenderer.send('isUpdateNow');
        }
        else if(Upd_percent==0){
            Upd_btn.innerText = "安装包已下载,立即更新";
            Upd_percent = Number(100);
            Upd_version.innerText = message.version || '';
            ipcRenderer.send('isUpdateNow');
        }
    }
    else if(data.action=="error"){
        Upd_lock = false;
        Upd_btn.innerText = "立即更新";

        if(data.errorInfo.errno == -4058){
            Upd_app.style.display = "none";
        }
    }
})


// clearTimeout(__timer)
var __timer= setTimeout(function(){
    autoUpdate()
},3000);



function autoUpdate(){
    if(Upd_lock) return false;
    Upd_lock = true;
    Upd_btn.innerText = "版本更新中.";
    ipcRenderer.send('checkForUpdate');
}