<template>
  <div id="updateTips">
    <div id="app"></div>
    <div id="update-app">
      <div class="process">
        <div class="masks"></div>
        <div class="contents">
          <div class="before">
            当前版本:
            <span id="current-version">{{version}}</span>
          </div>
          <div class="nextVersion" id="nextVersion">
            发现最新版本:
            <span id="update-version"></span>
          </div>
          <progress id="update-progress" value="0" max="100"></progress>
          <div class="update-btn">
            <button class="btn" id="update-btn" @click="autoUpdate()">立即更新</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { webFrame, ipcRenderer, shell } from "electron";
import { version } from "#/package.json";

export default {
  name: "App",
  data() {
    return {
      version,
    };
  },
  created() {
    ipcRenderer.on("dom-ready", (e) => {
      this.setZoomLevel();
    });
  },
  methods: {
    setZoomLevel() {
      // 设置缩放限制
      webFrame.setZoomFactor(100);
      webFrame.setZoomLevel(0);
      webFrame.setVisualZoomLevelLimits(1, 1);
    },
    onLoadScipt() {
      var _app = document.getElementById("app");
      var Upd_app = document.getElementById("update-app");
      var Upd_progress = document.getElementById("update-progress");
      var Upd_version = document.getElementById("update-version");
      var Upd_cv = document.getElementById("current-version");
      var Upd_btn = document.getElementById("update-btn");
      var Upd_lock = false;
      var Upd_percent = 0;

      ipcRenderer.on("staticData", function (event, data) {
        // 获取配置项数据
        if (data.version) {
          Upd_cv.innerText = data.version;
          Upd_version.innerText = data.version || "";
          if (typeof window.updateVerson == "function")
            _app.innerText = data.version;
        }
      });

      ipcRenderer.on("updateMessage", function (event, data) {
        data = data || {};
        var message = data.updateInfo || {};
        console.log(data, message);
        if (data.action == "updateAva") {
          Upd_app.style.display = "block";
          if (message.version) {
            // console.log("正在更新到最新版本：v "+message.version);
            Upd_version.innerText = message.version || "";
          }
        } else if (data.action == "updateNotAva") {
          //   document.getElementById("updateTips").style.display = "none";
        //   console.log("暂无可更新的版本：v " + message.version);
          // Upd_app.style.display = "block";
        } else if (data.action == "download-progress") {
          Upd_version.innerText = message.version || "";
          Upd_progress.value = Number(message.percent);
          Upd_percent = Number(message.percent);
        } else if (data.action == "downloadProgress") {
          // 下载完成 开始安装
          if (Upd_percent == 100) {
            Upd_version.innerText = message.version || "";
            Upd_btn.innerText = "安装重启中...";
            ipcRenderer.send("isUpdateNow");
          } else if (Upd_percent == 0) {
            Upd_btn.innerText = "安装包已下载,立即更新";
            Upd_percent = Number(100);
            Upd_version.innerText = message.version || "";
            ipcRenderer.send("isUpdateNow");
          }
        } else if (data.action == "error") {
          debugger;
          Upd_lock = false;
          Upd_btn.innerText = "您已升级到最新版本";

          if (data.errorInfo.errno == -4058) {
            // document.getElementById("nextVersion").stle.display = "none";
            // Upd_progress.style.display = "none";
          }
        }
      });
    },

    autoUpdate() {
      document.getElementById("update-btn").innerText = "版本更新中.";
      ipcRenderer.send("checkForUpdate");
    //   this.onLoadScipt();
    },
  },
};
</script>

<style lang="less">
@import "~normalize.css";
.process {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-align: center;
  z-index: 9999;
}
.process .masks {
  position: relative;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
.process .contents {
  position: absolute;
  left: 0;
  right: 0;
  display: block;
  top: 50%;
  width: 500px;
  height: 300px;
  margin: 0 auto;
  margin-top: -150px;
  border-radius: 10px;
  padding: 25px;
  box-sizing: border-box;
}
.process .contents .before {
  text-align: left;
}
.process .contents .nextVersion {
  font-size: 12px;
  color: #c00000;
  display: none;
}
.process .contents progress {
  width: 450px;
  height: 30px;
  color: #f00;
  background: red;
  border-radius: 15px;
  overflow: hidden;
  margin-top: 50px;
  transition: all 0.3s;
  display: none;
}
.process .contents progress::-webkit-progress-bar {
  background-color: #f2f2f2;
}
.process .contents progress::-webkit-progress-value {
  background: #a21211;
}
.process .contents progress::-moz-progress-bar {
  background-color: #f00;
}
.process .contents .update-btn {
  margin-top: 80px;
  text-align: center;
}
.process .contents .update-btn .btn {
  border: 0;
  outline: none;
  width: 150px;
  padding: 8px 0;
  margin: 0 auto;
  border-radius: 10px;
  color: #000;
  font-size: 18px;
  text-align: center;
  cursor: pointer;
}
</style>
