<!--
 --对话框选择组件
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-8-24
 -->
<template>
  <div class="reference" v-clickoutside="handleClickoutside">
    <el-input
      ref="input"
      v-focusInput="focusInput"
      v-model="nativeLabel"
      :readonly="readonly"
      :disabled="disabled"
      :placeholder="placeholder"
      :name="name"
      :size="size"
      :com="listenerTrans"
      @compositionstart.native="handleComposition"
      @compositionupdate.native="handleComposition"
      @compositionend.native="handleComposition"
      @focus="handleFocus"
      @keydown.up.native.prevent="highlight(highlightedIndex - 1)"
      @keydown.down.native.prevent="highlight(highlightedIndex + 1)"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false"
      @keydown.native.tab="handleClickoutside"
      @keydown.enter.stop.native="handleKeyEnter"
    >
      <span slot="suffix">
        <i class="el-icon-circle-close is-show-close" @click="deleteSelected" v-show="clearIcon"></i>
        <i class="el-input__icon fa fa-list is-clickable" @click.stop="handleIconClick"></i>
      </span>
    </el-input>
    <reference-suggestions
      :class="[popperClass ? popperClass : '']"
      ref="suggestions"
      :suggestions="suggestions"
    >
    </reference-suggestions>
  </div>
</template>
<script>
import refs from '../refs'
import fase from 'fansion-base'
import Emitter from 'element-ui/lib/mixins/emitter'
import Clickoutside from 'element-ui/lib/utils/clickoutside'
import ReferenceSuggestions from './reference-suggestions.vue'
import Vue from 'vue'
/**
 * 引入基础对象及方法
 */
const Elm = fase.mixins.elm
const {gson, furl, gext} = fase.rest
const {sure, isNotEmpty, isFunction} = fase.util
/**
 * 关闭参照全局方法
 * @param data 返回数据
 */
Vue.prototype.$closeReference = function (data) {
  this.$dialogs.getCurrent().$reference.closeReference(data)
}
/**
 * 打开参照对话框
 * @param vm vue对象
 * @param conf 对象化框配置对象
 */
const openReference = (vm, conf) => {
  if (!conf.dialog && (conf.component && !conf.component.dialog)) {
    if (!conf.container || typeof conf.container === 'string') {
      conf.container = refs.getContainer(conf.container)
    }
  }
  const dop = vm.getDialogOptions()
  const params = Object.assign({}, conf.params || {}, dop.params || {})
  const d = Object.assign({}, conf, vm.getDialogOptions(), {params})
  vm.$dialogs.show(d)
}

/**
 * 翻译方法
 * @param vm 业务引用值
 */
function trans (vm) {
  const value = vm.value
  if (!value) {
    return
  }
  const trans = vm.trans
  const cb = (res) => {
    if (!res) {
      return
    }
    // 处理回调结果的集中情况
    if (isFunction(res)) {
      res = res()
    }
    if (Array.isArray(res)) {
      if (res.length === 0) {
        return
      }
      res = res[0]
    }
    const r = typeof res === 'string' ? (res.startsWith('{') ? sure(res = JSON.parse(res)) && (res.label || res.value) : res) : res.label || res.value
    r && vm.$emit('update:showLabel', r)
  }
  const params = {value}
  trans && (typeof trans === 'string' ? gext(furl(trans, params), params, cb) : trans(value, cb))
}

/**
 * 初始化业务引用回调
 * @param vm 参照组件
 * @param ref 业务引用对象
 */
function intRefCb (vm, ref) {
  !vm.suggest && ref && (vm.suggestTarget = ref.suggest || ref.component.suggest)
  // 数据源
  ref && (vm.staticData = ref.ds || ref.component.ds)
  const trans = vm.translate || ref ? (ref.translate || ref.component.translate) : null
  vm.trans = trans || ((val, cb) => vm.transByData(val, (res) => Array.isArray(res) && res.length > 0 && cb(res[0])))
}

/**
 * 初始化
 * @param vm vue对象
 * @param cb 回调方法
 */
function initRef (vm, cb) {
  const ref = vm.ref
  if (!ref) {
    return
  }
  typeof ref === 'string' ? refs.get(ref, (r) => {
    vm.ref = r
    intRefCb(vm, r)
    cb && cb(vm)
  }) : sure(intRefCb(vm, ref)) && (cb && cb(vm))
}
/**
 * 对话框选择组件
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2018-1-22
 */
export default {
  name: 'FacReference',
  componentName: 'Reference',
  components: {
    ReferenceSuggestions
  },
  directives: {
    Clickoutside,
    focusInput: {
      inserted: function (el, binding) {
        if (binding.value) {
          setTimeout(() => {
            el.querySelector('input').focus()
          })
        }
      }
    }
  },
  mixins: [Elm, Emitter],
  props: {
    popperClass: String,
    placeholder: {
      type: String,
      default: '请选择'
    },
    disabled: Boolean,
    readonly: Boolean,
    name: String,
    size: String,
    value: String,
    showLabel: String,
    triggerOnFocus: {
      type: Boolean,
      default: true
    },
    suggest: [String, Array, Function],
    translate: [String, Function],
    filter: {
      type: Function,
      default: (filterString) => (item) => (item.label && item.label.toLowerCase().indexOf(filterString.toLowerCase()) >= 0)
    },
    refTo: [String, Object],
    refParam: Object,
    readFields: {
      type: [String, Array],
      default: _ => []
    },
    writeFields: {
      type: [String, Array],
      default: _ => []
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data: function () {
    const vm = this
    const ref = vm.refTo
    const suggestTarget = vm.suggest

    const nativeLabel = this.showLabel
    return {
      nativeLabel,
      inputHovering: false,
      ref,
      suggestTarget,
      isFocus: false,
      isOnComposition: false,
      suggestions: [],
      loading: false,
      highlightedIndex: -1
    }
  },
  computed: {
    suggestionVisible () {
      const suggestions = this.suggestions
      const isValidData = Array.isArray(suggestions) && suggestions.length > 0
      return (isValidData || this.loading) && this.isFocus
    },
    clearIcon () {
      return this.clearable &&
        !this.readonly &&
        this.inputHovering &&
        !this.disabled &&
        isNotEmpty(this.showLabel)
    },
    listenerTrans () {
      const {value, showLabel} = this
      if (value && !showLabel && this.trans) {
        console.log(`value:${value},label:${showLabel}`)
        trans(this)
      }
      return {value, showLabel}
    }
  },
  watch: {
    suggestionVisible (val) {
      this.broadcast('ReferenceSuggestions', 'visible', [val, this.$refs.input.$refs.input.offsetWidth])
    },
    refTo (refTo) {
      const vm = this
      vm.trans = vm.translate
      vm.ref = refTo
      initRef(vm, trans)
    },
    translate (v) {
      const vm = this
      vm.trans = v
      initRef(vm, trans)
    },
    value (v) {
      console.log(v)
    },
    showLabel (v) {
      if (this.nativeLabel !== v) {
        this.nativeLabel = v
      }
    },
    nativeLabel (v) {
      this.handleChangeLabel(v)
    }
  },
  mounted () {
    const vm = this
    initRef(vm, trans)
    vm.$on('item-click', item => {
      this.select(item)
    })
  },
  beforeDestroy () {
    this.$refs.suggestions.$destroy()
  },
  methods: {
    getData (queryString) {
      this.loading = true
      queryString = queryString || ''
      if (queryString.length === 0) {
        this.suggestions = []
      } else {
        this.fetchSuggestions(queryString, (suggestions) => {
          this.loading = false
          if (Array.isArray(suggestions)) {
            this.suggestions = suggestions
          } else {
            console.error('autocomplete suggestions must be an array')
          }
        })
      }
    },
    handleComposition (event) {
      /**
       * chrome下composition事件会比input事件的触发事件晚，再次调用handleChange方法，
       * 会把当次修改的值，而不是全部的值传递过去，导致过滤的数据不对，手动在input事件的回
       * 调里面延迟一下compositionend的判断触发
       */
      this.isOnComposition = event.type !== 'compositionend'
    },
    handleChangeLabel (label) {
      const vm = this
      if (label === this.showLabel) {
        return
      }
      setTimeout(() => {
        if (vm.isOnComposition || (!vm.triggerOnFocus && !label)) {
          this.suggestions = []
          return
        }
        if (!vm.readonly) {
          vm.getData(label)
        }
      }, 0)
    },

    handleFocus () {
      this.isFocus = true
      this.$emit('focus')
    },
    handleKeyEnter () {
      if (this.suggestionVisible && this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
        this.select(this.suggestions[this.highlightedIndex])
      } else if (this.showLabel && (this.suggestions.length === 1 && this.suggestions[0].label === this.showLabel)) {
        this.select(this.suggestions[0])
      } else {
        this.select({})
      }
    },
    handleClickoutside () {
      if (!this.suggestTarget) {
        return
      }
      const vm = this
      setTimeout(() => {
        if (!vm.showLabel && this.suggestions.length === 1 && vm.suggestions[0].label === vm.showLabel) {
          this.select(this.suggestions[0])
        }
      }, 100)
      this.isFocus = false
    },
    select (item) {
      if (item && this.value !== item.value) {
        this.writeFields.forEach((f, i) => {
          if (i >= this.readFields.length) {
            this.model[f] = null
          } else {
            this.model[f] = item[f]
          }
        })

        this.$emit('input', item.value)
        this.$emit('update:showLabel', item.label)
        this.$emit('change', item)
      }
      if (this.readonly) {
        return
      }
      this.$nextTick(_ => {
        this.suggestions = []
      })
      this.highlight(-1)
    },
    highlight (index) {
      if (!this.suggestionVisible || this.loading) { return }
      if (index < 0) {
        this.highlightedIndex = -1
        return
      }
      if (index >= this.suggestions.length) {
        index = this.suggestions.length - 1
      }
      const suggestion = this.$refs.suggestions.$el.querySelector('.el-autocomplete-suggestion__wrap')
      const suggestionList = suggestion.querySelectorAll('.el-autocomplete-suggestion__list li')

      const highlightItem = suggestionList[index]
      const scrollTop = suggestion.scrollTop
      const offsetTop = highlightItem.offsetTop

      if (offsetTop + highlightItem.scrollHeight > (scrollTop + suggestion.clientHeight)) {
        suggestion.scrollTop += highlightItem.scrollHeight
      }
      if (offsetTop < scrollTop) {
        suggestion.scrollTop -= highlightItem.scrollHeight
      }
      this.highlightedIndex = index
      this.$el.querySelector('.el-input__inner').setAttribute('aria-activedescendant', `${this.id}-item-${this.highlightedIndex}`)
    },
    fetchSuggestions: function (inputString, cb) {
      const vm = this
      const suggest = vm.suggestTarget
      if (!inputString) {
        cb.call(vm, [])
        return
      }
      if (suggest) {
        if (typeof suggest === 'string') {
          gson(suggest, {keyword: inputString}, cb)
        } else if (isFunction(suggest)) {
          const rs = suggest(inputString, cb, vm.refParam)
          Array.isArray(rs) && rs.length > 0 && cb(rs.filter(vm.filter(inputString)))
        } else {
          cb(suggest.filter(vm.filter(inputString)))
        }
      } else if (vm.staticData) {
        if (isFunction(vm.staticData)) {
          const rs = vm.staticData(inputString, cb, vm.refParam)
          Array.isArray(rs) && rs.length > 0 && cb(rs.filter(vm.filter(inputString)))
        } else {
          cb(vm.staticData.filter(vm.filter(inputString)))
        }
      } else {
        cb.call(vm, [])
      }
    },
    transByData: function (inputString, cb) {
      const vm = this
      if (inputString && vm.staticData) {
        if (isFunction(vm.staticData)) {
          const rs = vm.staticData(inputString, cb, vm.refParam)
          Array.isArray(rs) && rs.length > 0 && cb(rs.filter((item) => (item.value && item.value.toLowerCase().indexOf(inputString.toLowerCase()) >= 0)))
        } else {
          cb(vm.staticData.filter((item) => (item.value && item.value.toLowerCase().indexOf(inputString.toLowerCase()) >= 0)))
        }
      } else {
        cb.call(vm, [])
      }
    },
    handleIconClick () {
      this.isFocus = false
      this.showReference()
    },
    setParams (params, isClear = true) {
      if (this.refParam === params) {
        return
      }
      this.refParam = params
      if (isClear) {
        this.$emit('input', null)
        this.$emit('update:showLabel', null)
      }
      this.refresh = true
    },
    getDialogOptions () {
      const vm = this
      return {
        params: vm.refParam,
        dep: '#' + vm.getElmID(),
        refresh: vm.refresh,
        '@open': ($event) => {
          vm.$dialogs.getCurrent().$reference = vm
          console.log($event)
          $event && $event.reset && $event.reset()
        }
      }
    },
    showReference () {
      const vm = this
      const ref = this.refTo
      if (typeof ref === 'string') {
        refs.get(ref, (conf) => {
          openReference(vm, conf)
        })
        return
      }
      const conf = ref.component ? ref : {component: ref}
      openReference(vm, conf)
    },
    closeReference (item) {
      if (item) {
        this.select(item)
      }
      this.$dialogs.closeCurrent(item)
      this.$emit('afterReference', item, this)
    },
    /**
     * @desc: 清空操作  1.已经选中过数据，现在清空数据 2.还未选中数据，只是清除掉输入框中的值
     */
    deleteSelected () {
      if (this.value) {
        this.select({})
      } else {
        this.$emit('input', null)
        this.$emit('update:showLabel', null)
      }
      this.suggestions = []
    }
  },
  created: function () {
    if (!this.readFields) {
      this.readFields = []
    } else if (typeof this.readFields === 'string') {
      this.readFields = this.readFields.split(',')
    }
    if (!this.writeFields) {
      this.writeFields = []
    } else if (typeof this.writeFields === 'string') {
      this.writeFields = this.writeFields.split(',')
    }
  }
}
</script>
<style lang="less" scoped>
.reference {
  position: relative;
  display: inline-block;
  width:100%;
}
</style>
