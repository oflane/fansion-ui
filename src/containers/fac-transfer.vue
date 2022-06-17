<template>
  <div class="fac-transfer clearfix">
    <div class="fac-transfer-left">
      <div class="fac-transfer-header clearfix">
        <el-link @click="handleAllChecked" type="primary">全选</el-link><search css="pull-right" size="small" v-model="query" v-if="filterable"/>
      </div>
      <div class="fac-transfer-body">
        <el-checkbox-group v-model="checked" v-show="!hasNoMatch && data.length > 0" class="fac-transfer-list">
          <el-checkbox class="fac-transfer-item" :key="item[keyProp]" v-for="item in filteredData" :label="item[keyProp]">
            <slot :data="{item}">
              {{item[labelProp]}}
            </slot>
          </el-checkbox>
        </el-checkbox-group>
        <p class="el-transfer-empty" v-show="hasNoMatch">无匹配数据</p>
        <p class="el-transfer-empty" v-show="data.length === 0 && !hasNoMatch">无备选数据</p>
      </div>
    </div>
    <div class="fac-transfer-right">
      <div class="fac-transfer-header">
        <span >已选{{ checkedSummary }}个</span><el-link @click="handleClear" type="primary" class="pull-right">清空</el-link>
      </div>
      <div class="fac-transfer-body">
        <div class="fac-transfer-list">
          <div class="fac-transfer-item" :key="item[keyProp]" v-for="(item, $index) in selected">
            <label class="fac-transfer-item-label">
              <slot :data="{item}">
                {{item[labelProp]}}
              </slot>
            </label>
            <i class="el-icon-circle-close pull-right" @click="itemRemove(item, $index, $event)"></i>
          </div>
        </div>
        <p class="el-transfer-empty" v-show="selected.length === 0">未选中任何数据</p>
      </div>
    </div>
  </div>
</template>

<script>
  import search from '../controls/search'

  const matchData = (data, selected, keyProp) => {
    const checked = []
    const dataKeys = data.map(item => item[keyProp])
    selected.forEach(item => {
      const key = item[keyProp]
      if (dataKeys.indexOf(key) > -1) {
        checked.push(key)
      }
    })
    return checked
  }

  export default {
    name: 'FacTransfer',
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      },
      selected: {
        type: Array,
        default () {
          return []
        }
      },
      filterable: Boolean,
      filterMethod: Function,
      props: {
        default () {
          return {
            label: 'label',
            key: 'value'
          }
        }
      }
    },
    components: {
      search
    },
    data () {
      const checked = matchData(this.data, this.selected, this.keyProp)
      return {
        checked,
        query: ''
      }
    },

    watch: {
      checked (val, oldVal) {
        console.log(val)
        const data = this.data
        const keyProp = this.keyProp
        const selected = this.selected
        if (val.length > oldVal.length) {
          val.forEach(v => {
            if (oldVal.findIndex(ov => ov === v) < 0) {
              const it = data.find(item => item[keyProp] === v)
              selected.push(it)
            }
          })
        } else {
          oldVal.forEach(v => {
            if (val.findIndex(ov => ov === v) < 0) {
              const idx = selected.findIndex(item => item[keyProp] === v)
              selected.splice(idx, 1)
            }
          })
        }
      },
      data () {
        this.checked = matchData(this.data, this.selected, this.keyProp)
      },
      selected () {
        this.checked = matchData(this.data, this.selected, this.keyProp)
      }
    },

    computed: {
      filteredData () {
        return this.data.filter(item => {
          if (typeof this.filterMethod === 'function') {
            return this.filterMethod(this.query, item)
          } else {
            const label = item[this.labelProp] || item[this.keyProp].toString()
            return label.toLowerCase().indexOf(this.query.toLowerCase()) > -1
          }
        })
      },
      checkedSummary () {
        const checkedLength = this.selected.length
        const dataLength = this.data.length
        return `${checkedLength}/${dataLength}`
      },
      hasNoMatch () {
        return this.query.length > 0 && this.filteredData.length === 0
      },

      labelProp () {
        return this.props.label || 'label'
      },

      keyProp () {
        return this.props.key || 'id'
      }
    },
    methods: {
      itemRemove (item, index) {
        const key = item[this.keyProp]
        const nn = this.checked.filter(v => v !== key)
        if (nn.length === this.checked.length) {
          this.selected.splice(index, 1)
        } else {
          this.checked = nn
        }
      },
      handleAllChecked () {
        const vm = this
        vm.checked = vm.data.map(item => {
          return item[this.keyProp]
        })
      },
      handleClear () {
        this.checked = []
        this.selected = []
      }
    }
  }
</script>
<style lang="less">
.fac-transfer{
  min-height: 300px;
  display: flex;
  border: 1px solid #eaeefb;
  background: #fff;
  color: #606266;
}
.fac-transfer-left{
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 50%;
}
.fac-transfer-right{
  border-left: 1px solid #eaeefb;
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 50%;
}
.fac-transfer-header {
  padding: 15px 30px;
  line-height: 32px;
  vertical-align: middle;
}
.fac-transfer-body{
  overflow: auto;
  height: 100%;
}
.fac-transfer-list{
  margin: 0;
  padding: 6px 0;
  list-style: none;
  overflow: auto;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;

  .fac-transfer-item{
    height: 40px;
    line-height: 40px;
    padding: 5px 30px;
    display: block!important;
    overflow: hidden;
    position: relative;
    &.el-checkbox {
      color: #606266;
      .el-checkbox__label {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding-left: 24px;
        line-height: 30px;
      }
    }
    .fac-transfer-item-label{
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      line-height: 30px;
      color: #606266;
    }
    .el-checkbox__input {
      position: absolute;
      top: 13px;
    }
    .el-icon-circle-close{
      font-size: 16px;
      position: absolute;
      top: 12px;
      right:30px;
      cursor: pointer;
    }
  }
}
.el-transfer-empty{
  text-align: center;
}
</style>
