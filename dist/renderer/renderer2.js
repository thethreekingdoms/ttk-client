const { ipcRenderer } = require("electron");
ipcRenderer.on("updateMessage",function(event,data){
    var Upd_percent=0;
    data = data || {};
    var message = data.updateInfo || {};
    console.log(data,message);
    if(data.action=="updateAva"){
        document.getElementById("update-app").style.display = "block";
        if(message.version) {
            console.log("正在更新到最新版本：v "+message.version);
            document.getElementById("update-version").innerText = message.version || '';
        }
    }
    else if(data.action=="updateNotAva"){
        document.getElementById("nextVersion").style.display="none";
        document.getElementById("update-version").style.display="none";
        document.getElementById("update-progress").style.display="none"
        document.getElementById("update-btn").innerText="暂无可更新的版本";
        // console.log("暂无可更新的版本：v "+message.version);
        // document.getElementById("update-app").style.display = "block";
    }
    else if(data.action=="download-progress"){
        document.getElementById("update-version").innerText = message.version || '';
        document.getElementById("update-progress").value = Number(message.percent);
        Upd_percent = Number(message.percent);
    }
    else if(data.action=="downloadProgress"){
         // 下载完成 开始安装
         if(Upd_percent == 100){
            document.getElementById("update-version").innerText = message.version || '';
            document.getElementById("update-btn").innerText = "安装重启中...";
            ipcRenderer.send('isUpdateNow');
        }
        else if(Upd_percent==0){
            document.getElementById("update-btn").innerText = "安装包已下载,立即更新";
            Upd_percent = Number(100);
            document.getElementById("update-version").innerText = message.version || '';
            ipcRenderer.send('isUpdateNow');
        }
    }
    else if(data.action=="error"){
        Upd_lock = false;
        document.getElementById("update-btn").innerText = "立即更新";

        if(data.errorInfo.errno == -4058){
            document.getElementById("update-app").style.display = "none";
        }
    }
})