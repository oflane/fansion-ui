<!--
 --对话框选择组件输入提示部分
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-8-24
 -->
<template>
  <transition name="el-zoom-in-top" @after-leave="doDestroy">
    <div
      v-show="showPopper"
      class="el-autocomplete-suggestion"
      :class="{ 'is-loading': parent.loading }"
      :style="{ width: dropdownWidth }"
    >
      <el-scrollbar
        tag="ul"
        wrap-class="el-autocomplete-suggestion__wrap"
        view-class="el-autocomplete-suggestion__list"
      >
        <li v-if="parent.loading"><i class="el-icon-loading"></i></li>
        <template v-for="(item, index) in suggestions" v-else>
          <li
            v-if="!parent.customItem"
            :class="{'highlighted': parent.highlightedIndex === index}"
            @click="select(item)"
          >
            {{item.label}}
          </li>
          <component
            v-else
            :class="{'highlighted': parent.highlightedIndex === index}"
            @click="select(item)"
            :is="parent.customItem"
            :item="item"
            :index="index">
          </component>
        </template>
      </el-scrollbar>
    </div>
  </transition>
</template>
<script>
  import Popper from 'element-ui/lib/utils/vue-popper'
  /**
   * 对话框选择组件输入提示部分
   * @author Paul.Yang E-mail:yaboocn@qq.com
   * @version 1.0 2018-1-22
   */
  export default {
    mixins: [Popper],
    componentName: 'ReferenceSuggestions',
    data () {
      return {
        parent: this.$parent,
        dropdownWidth: ''
      }
    },
    props: {
      suggestions: Array,
      template: [String, Function],
      options: {
        default () {
          return {
            forceAbsolute: true,
            gpuAcceleration: false
          }
        }
      }
    },
    methods: {
      format: function (item) {
        if (!this.template) {
          return item.label
        } else if (typeof this.template === 'string') {
          /* eslint-disable no-eval */
          return eval(this.template)
        } else {
          return this.template(item)
        }
      },
      select (item) {
        this.$parent.$emit('item-click', item)
      }
    },
    updated () {
      this.$nextTick(() => {
        this.updatePopper()
      })
    },
    mounted () {
      this.popperElm = this.$el
      this.referenceElm = this.$parent.$refs.input.$refs.input
    },
    created () {
      this.$on('visible', (val, inputWidth) => {
        this.dropdownWidth = inputWidth + 'px'
        this.showPopper = val
      })
    }
  }
</script>
