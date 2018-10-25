<!--
 --可配置按钮栏组件
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-8-2
 -->
<template>
  <div class="button-bar">
    <template v-for="item in buttons">
      <el-dropdown v-if="item.group" trigger="click" @command="handleCommand">
        <el-button :type="item.type">
          {{item.name}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="i in item.group" :command="i.click" :key="i.id">{{i.value}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button v-else :type="item.type" @click="handleCommand(item.click)" v-bind="item">{{item.name}}</el-button>
    </template>
  </div>
</template>
<script>
  export default {
    props: {
      conf: [Object, Array],
      page: Object
    },
    data () {
      let buttons
      if (Array.isArray(this.conf)) {
        buttons = this.conf
      } else {
        buttons = this.conf.buttons
      }

      return {
        buttons
      }
    },
    watch: {
      conf (conf) {
        if (Array.isArray(conf)) {
          this.buttons = conf
        } else {
          this.buttons = conf.buttons
        }
      }
    },
    methods: {
      handleCommand (cmd) {
        let f = this.page[cmd]
        if (f) {
          f.call(this.page)
        } else {
          console.log(`Can not find method "${cmd}"`)
        }
      }
    }
  }
</script>
<style lang="less">
  .button-bar{
    overflow: auto;
    width: 100%;
    .el-button--primary {
      color: #fff;
      background-color: #20a0ff;
      border-color: #20a0ff;
    }
    .el-button {
      border: 0px;
      border-radius: 0px;
      min-width: 80px;
    }
    .el-button+.el-button {
      margin-left: 6px;
    }
    .el-button+.el-dropdown {
      margin-left: 6px;
    }
  }
</style>
