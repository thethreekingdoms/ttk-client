// const { ipcRenderer } = require("electron");
var Upd_lock = false;
var _initSTATUS = true;
var Upd_percent = 0;

ipcRenderer.on("staticData", function (event, data) {
    // 获取配置项数据
    if (data.version) {
        // document.getElementById("current-version").innerText = data.version;
        // document.getElementById("update-version").innerText = data.version || '';
        if (typeof window.updateVerson == 'function') document.getElementById("app").innerText = data.version;
    }
})

ipcRenderer.on("updateMessage", function (event, data) {
    data = data || {};
    var message = data.updateInfo || {};
    if(!_initSTATUS) return
    // console.log(data,message);
    if (data.action == "updateAva") {
        document.getElementById("update-app").style.display = "block";
        document.getElementById("updateTips2").style.display = "block";
        if (message.version) {
            // console.log("正在更新到最新版本：v "+message.version);
            document.getElementById("update-version").innerText = message.version || '';
        }
    }
    else if (data.action == "updateNotAva") {
        document.getElementById("updateTips").style.display = "none";
        // console.log("暂无可更新的版本：v "+message.version);
        // document.getElementById("update-app").style.display = "block";
    }
    else if (data.action == "download-progress") {
        // document.getElementById("update-version").innerText = message.version || '';
        document.getElementById("update-progress").value = Number(message.percent);
        Upd_percent = Number(message.percent);
    }
    else if (data.action == "downloadProgress") {
        // 下载完成 开始安装
        document.getElementById("updateTips").style.display = "none";
        document.getElementById("updateTips2").style.display = "none";
        if (Upd_percent == 100) {
            // document.getElementById("update-version").innerText = message.version || '';
            ipcRenderer.send('isUpdateNow');
        }
        else if (Upd_percent == 0) {
            // document.getElementById("update-btn").innerText = "安装包已下载,立即更新";
            Upd_percent = Number(100);
            // document.getElementById("update-version").innerText = message.version || '';
            ipcRenderer.send('isUpdateNow');
        }
    }
    else if (data.action == "error") {
        Upd_lock = false;
        document.getElementById("update-btn").innerText = "立即更新";

        if (data.errorInfo.errno == -4058) {
            document.getElementById("update-app").style.display = "none";
        }
    }
})
// clearTimeout(__timer)

var __timeout__ = null
window.onload=()=>{
    __timeout__= setTimeout(function () {
        autoUpdate()
    }, 1000);
}

window.onunload=()=>{
    clearTimeout(__timeout__)
}


function autoUpdate() {
    if (Upd_lock) return false;
    Upd_lock = true;
    // console.log('auto updater')
    ipcRenderer.send('checkForUpdate');
}
function autoUpdate2() {
    document.getElementById("updateTips2").style.display = "none";
    document.getElementById("updateTips").style.display = "block";
    // ipcRenderer.send('isUpdateNow');
    ipcRenderer.send("downloadUpdate");
}
function cancelUpdate() {
    document.getElementById("updateTips2").style.display = "none";
    _initSTATUS=false;
}

