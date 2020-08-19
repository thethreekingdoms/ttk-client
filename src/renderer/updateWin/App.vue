<template>
  <div>
    <div id="updateTips" style="display: none;">
      <div id="app"></div>
      <div id="update-app">
        <div class="process">
          <div class="masks"></div>
          <div class="contents">
            <div class="bgTitle">
              <div class="before">
                <span id="current-version" style="display: none;">当前版本:</span>
                <span class="s1">系统更新</span>
              </div>
              <div class="nextVersion" id="nextVersion" style="display: none;">发现最新版本:</div>
              <div style="font-size: 12px; overflow: hidden;color: #fff;">
                <div class="s2"></div>
              </div>
            </div>
            <div class="bgCenter">
              <div
                style="font-size: 16px;color: #333333;letter-spacing: 0.79px; text-align: left;padding-left: 25px;"
              >正在下载安装</div>
              <progress id="update-progress" value="0" max="100"></progress>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="updateTips2">
      <div id="update-app2">
        <div class="process">
          <div class="masks"></div>
          <div class="contents">
            <div class="bgTitle">
              <div class="before">
                <span class="s1">系统更新</span>
              </div>

              <div style="font-size: 12px; overflow: hidden;color: #fff;">
                <div class="s2"></div>
              </div>
            </div>
            <div class="bgCenter2">
              <div>
                金财管家
                <span id="update-version"></span>
              </div>
              <div>内容1：</div>
              <div>修复了一些已知问题。</div>
            </div>
            <div class="bgFooter">
              <div class="update-btn">
                <button class="btn" id="update-btn" @click="autoUpdate2()">立即更新</button>
                <button class="btn2" id="update-cancel" @click="cancelUpdate()">稍后再说</button>
              </div>
            </div>
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
    autoUpdate() {
      // document.getElementById("update-btn").innerText = "版本更新中.";
      ipcRenderer.send("checkForUpdate");
      //   this.onLoadScipt();
    },
    autoUpdate2() {
      // ipcRenderer.send("isUpdateNow");
      document.getElementById("updateTips2").style.display = "none";
      document.getElementById("updateTips").style.display = "block";
      // ipcRenderer.send('isUpdateNow');
      ipcRenderer.send("downloadUpdate");
    },
    cancelUpdate() {
      ipcRenderer.send("window-close");
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
  width: 630px;
  margin: 0 auto;
  margin-top: -150px;
  background-color: #ffffff;
  box-sizing: border-box;
  border: 1px solid #d3d3d3;
}
.bgTitle {
  background: #0280e1;
  height: 97px;
}
.bgCenter {
  height: 225px;
  margin-top: 80px;
}
.bgCenter2 {
  height: 225px;
  margin-top: 80px;
  text-align: left;
  margin: 10px 25px;
  overflow-y: auto;
  overflow-x: hidden;
}

.process .contents .before {
  text-align: left;
  color: #fff;
}
.s1 {
  font-family: "Microsoft YaHei";
  font-size: 13px;
  color: #ffffff;
  letter-spacing: 0.64px;
  padding-left: 8px;
}
.s2 {
  background-image: url("../../../resources/banner.jpg");
  background-position: center;
  margin: 10px auto;
  height: 45px;
  background-repeat: no-repeat;
}
.process .contents .nextVersion {
  font-size: 12px;
  color: #0280e1;
}
.process .contents progress {
  width: 581px;
  height: 14px;
  color: #0280e1;
  border-radius: 3.5px;
  overflow: hidden;
  transition: all 0.3s;
  background: #d3d3d3;
}
.process .contents progress::-webkit-progress-bar {
  background-color: #f2f2f2;
}
.process .contents progress::-webkit-progress-value {
  background: #0280e1;
}
.process .contents progress::-moz-progress-bar {
  background-color: #0280e1;
}
.process .contents .update-btn {
  width: 95%;
  /* height: 35px; */
  border-radius: 2px;
  font-size: 16px;
  text-align: right;
  margin-bottom: 20px;
  margin-right: 20px;
}
.process .contents .update-btn .btn {
  height: 35px;
  background-color: #0280e1;
  color: #fff;
  cursor: pointer;
  width: 95px;
  border: 1px solid #0280e1;
}
.process .contents .update-btn .btn:hover {
  background-color: #065a9a;
}
.process .contents .update-btn .btn2 {
  height: 35px;
  background-color: #ffffff;
  color: #000;
  cursor: pointer;
  width: 95px;
  border: 1px solid #0280e1;
}
</style>
