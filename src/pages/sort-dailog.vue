<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->
<!--
 --排序对话框
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2018-1-15
 -->
<template>
    <el-dialog :visible.sync="visible">
        <fac-layout :conf="layout">
            <el-tree ref="leftTree" :data="rows"
                     node-key="id"
                     default-expand-all
                     draggable slot="content"
                     :allow-drop="allowDrop"
                     highlight-current
            />
            <template slot="button">
                <div class="center">
                    <div class="el-row">
                        <el-button type="primary" icon="fa fa-arrow-up" circle @click="top"/>
                    </div>
                    <div class="el-row">
                        <el-button type="primary" icon="fa fa-chevron-up" circle @click="up"/>
                    </div>
                    <div class="el-row">
                        <el-button type="primary" icon="fa fa-chevron-down" circle @click="down"/>
                    </div>
                    <div class="el-row">
                        <el-button type="primary" icon="fa fa-arrow-down" circle @click="bottom"/>
                    </div>
                    <div class="el-row">
                        <el-button type="danger" icon="fa fa-refresh" circle @click="reload"/>
                    </div>
                </div>
            </template>
        </fac-layout>
        <div slot="footer">
            <el-button type="primary" @click="onOk">确定</el-button>
            <el-button @click="onCancel">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
  const reloadData = (vm) => vm.model.map((v, i) => ({id: `node${i}`, label: v[vm.labelKey], data: v}))
  export default {
    name: 'SortDialog',
    dialog: true,
    props: {
      labelKey: {
        type: String,
        default: 'label'
      },
      model: Array
    },
    data () {
      const layout = {
        body: {
          class: 'layout-body cleafix',
          children: [
            {
              class: 'lr-left-content',
              slot: 'content'
            },
            {
              class: 'lr-right-float',
              slot: 'button'
            }
          ]
        }
      }
      const rows = reloadData(this)
      return {
        visible: true,
        rows,
        layout
      }
    },
    methods: {
      /**
       * 显示对话框
       */
      show () {
        this.visible = true
      },
      /**
       * 判断是否显示
       * @returns {boolean}
       */
      isVisible () {
        return this.visible
      },
      /**
       * 隐藏对话框
       */
      hide (flag) {
        this.visible = false
        !flag && this.$emit('cancel')
      },
      getCurrent () {
        return this.$refs.leftTree.getCurrentNode()
      },
      move (target) {
        const vm = this
        const current = vm.getCurrent()
        if (!current) {
          vm.$message({
            type: 'warning',
            message: '未选中任何数据!'
          })
          return
        }
        const rows = vm.rows
        let i = rows.indexOf(current)
        if (Math.abs(target) === 1) {
          target = i + target
        }
        let [r] = rows.splice(i, 1)
        r = {...r}
        delete r.$treeNodeId
        rows.splice(target, 0, r)
      },
      top () {
        this.move(0)
      },
      bottom () {
        this.move(this.rows.length)
      },
      up () {
        this.move(-1)
      },
      down () {
        this.move(1)
      },
      /**
       * 刷新
       */
      reload () {
        reloadData(this)
      },
      /**
       * 确定按钮
       */
      onOk () {
        const vm = this
        const {model, rows} = vm
        rows.forEach((v, i) => (model[i] = v.data))
        this.$dialogs.closeCurrent()
        this.$emit('ok')
      },
      /**
       * 取消按钮
       */
      onCancel () {
        this.$dialogs.closeCurrent()
      },
      allowDrop (draggingNode, dropNode, type) {
        return type !== 'inner'
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-dialog{
    width: 400px
  }
  /deep/ .layout-body {
      margin: 0;
      .lr-left-content {
        min-height: 400px;
        max-height: 480px;
        overflow: auto;
        margin-right: 80px;
        padding: 30px;
        .el-tree-node__content{
          height:32px;
        }
      }

      .lr-right-float {
        position: absolute;
        right: 0;
        top: 0;
        width: 80px;
        height: 100%;
        border-left: 1px solid #cccccc;
        display: flex;
        justify-content: center;
        text-align: center;
        align-items:center;
        .el-row{
          margin: 6px 0;
        }
        .center {
          height:260px;
          width: 60px;
          top:0;
          left:0;
          right:0;
          bottom: 0;
          margin: 0 auto;
        }
      }
  }
</style>
