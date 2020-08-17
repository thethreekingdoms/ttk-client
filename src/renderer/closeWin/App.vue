<template>
  <div class="close-win">
    <p class="close-win-text">点击确定将退出此程序</p>
    <div class="close-win-opt">
      <button class="close-win-opt-cancel" @click="close('self')">取消</button>
      <button class="close-win-opt-close" @click="close('all')">确定</button>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  name: "App",
  created() {},
  methods: {
    close(type) {
      ipcRenderer.send("CLOSEWIN:close", type);
    }
  }
};
</script>

<style lang="less">
// @import "~normalize.css";

.close-win {
  &-text {
    font-size: 14px;
  }

  &-opt {
    height: 55px;
    display: flex;
    padding-right: 10px;
    justify-content: flex-end;
    align-items: flex-end;

    &-cancel {
      cursor: pointer;
      padding: 3px 10px;
    }

    &-close {
      margin-left: 10px;
      color: #fff;
      background-color: #0066b3;
      border-color: #0066b3;
      cursor: pointer;
      border-radius: 2px;
      box-shadow: none;
      padding: 3px 10px;
    }
  }
}

</style>
