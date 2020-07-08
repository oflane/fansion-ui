<!--
 --对话框选择组件
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-8-24
 -->
<template>
  <div class="reference" v-clickoutside="handleClickoutside">
    <el-input
      ref="input"
      :value="showLabel"
      :readonly="readonly"
      :disabled="disabled"
      :placeholder="placeholder"
      :name="name"
      :size="size"
      :com="listenerTrans"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown.up.native.prevent="highlight(highlightedIndex - 1)"
      @keydown.down.native.prevent="highlight(highlightedIndex + 1)"
      @keydown.enter.stop.native="handleKeyEnter"
    >
      <i class="el-input__icon fa fa-list is-clickable" @click="handleIconClick($event)"　slot="suffix">
      </i>
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
  const gson = fase.rest.gson
  const getData = fase.data.getData
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
    if (!conf.dialog) {
      if (!conf.container || typeof conf.container === 'string') {
        conf.container = refs.getContainer(conf.container)
      }
    }
    Object.assign(conf, vm.getDialogOptions())
    vm.$dialogs.show(conf)
  }

  /**
   * 翻译方法
   * @param value 业务引用值
   */
  function trans (vm) {
    const value = vm.value
    const trans = vm.trans
    const cb = (res) => {
      const r = !res || typeof res === 'string' ? res : res.value || res.label
      r && vm.$emit('update:showLabel', r)
    }
    trans && (typeof trans === 'string' ? gson(trans, {value}, cb) : trans(value, cb))
  }

  /**
   * 初始化业务引用回调
   * @param vm
   * @param ref 业务引用对象
   */
  function intRefCb (vm, ref) {
    if (!vm.suggest) {
      const s = ref.params ? getData(ref.params, 'suggest') : null
      const suggestTarget = s ? s : getData(ref.component, 'suggest')
      vm.suggestTarget = suggestTarget
      if (!vm.trans && Array.isArray(suggestTarget)) {
        vm.trans = (value, cb) => {
          const rs = suggestTarget.filter(v => v.value === value)
          rs.length > 0 && cb(rs[0].label)
        }
      }
    }
  }

  /**
   * 初始化
   * @param vm vue对象
   * @param cb 回调方法
   */
  function initRef(vm, cb){
    const ref = vm.ref
    if (!ref) {
      return
    }
    typeof ref === 'string' ? refs.get(ref, (r) => {
      vm.ref = r
      intRefCb(vm, r)
      cb && cb(vm)
    }) : intRefCb(vm, ref) || cb && cb(vm)
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
    directives: { Clickoutside },
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
        default: function (filterString) {
          return function (item) {
            return (item.label.indexOf(filterString.toLowerCase()) === 0)
          }
        }
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
      }
    },
    data: function () {
      const vm = this
      let ref = vm.refTo
      let suggestTarget = vm.suggest
      let trans = vm.translate
      return {
        ref,
        trans,
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
        let isValidData = Array.isArray(suggestions) && suggestions.length > 0
        return (isValidData || this.loading) && this.isFocus
      },
      listenerTrans () {
        const {value,showLabel} = this
        if (value && !showLabel && this.trans) {
          console.log(`value:${value},label:${showLabel}`)
          trans(this)
        }
        return {value,showLabel}
      }
    },
    watch: {
      suggestionVisible (val) {
        this.$emit('ReferenceSuggestions', 'visible', [val, this.$refs.input.$refs.input.offsetWidth])
      },
      refTo (refTo) {
        const vm = this
        vm.ref = refTo
        initRef(vm, trans)
      },
      value (v) {
        console.log(v)
      },
      showLabel (v) {
        console.log(v)
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
        this.fetchSuggestions(queryString, (suggestions) => {
          this.loading = false
          if (Array.isArray(suggestions)) {
            this.suggestions = suggestions
          } else {
            console.error('autocomplete suggestions must be an array')
          }
        })
      },
      handleComposition (event) {
        if (event.type === 'compositionend') {
          this.isOnComposition = false
          this.handleChange(event.data)
        } else {
          this.isOnComposition = true
        }
      },
      handleChange (value) {
        this.$emit('input', value)
        if (this.isOnComposition || (!this.triggerOnFocus && !value)) {
          this.suggestions = []
          return
        }
        this.getData(value)
      },
      handleFocus () {
        this.isFocus = true
        this.$emit('focus')
      },
      handleBlur () {
        // 因为 blur 事件处理优先于 select 事件执行
        setTimeout(_ => {
          this.isFocus = false
        }, 100)
      },
      handleKeyEnter () {
        if (this.suggestionVisible && this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
          this.select(this.suggestions[this.highlightedIndex])
        } else if (this.label && (this.suggestions.length === 1 && this.suggestions[0].label === this.label)) {
          this.select(this.suggestions[0])
        } else {
          this.select({})
        }
      },
      handleClickoutside () {
        if (!this.suggestTarget) {
          return
        }
        if (!this.label) {
          if (this.suggestions.length === 1 && this.suggestions[0].label === this.label) {
            this.select(this.suggestions[0])
          } else {
            this.select({})
          }
        }
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
        this.highlightedIndex = index
        if (!this.suggestionVisible || this.loading) { return }
        if (index < 0) index = 0
        if (index >= this.suggestions.length) {
          index = this.suggestions.length - 1
        }
        const suggestion = this.$refs.suggestions.$el.querySelector('.el-autocomplete-suggestion__wrap')
        const suggestionList = suggestion.querySelectorAll('.el-autocomplete-suggestion__list li')

        let highlightItem = suggestionList[index]
        let scrollTop = suggestion.scrollTop
        let offsetTop = highlightItem.offsetTop

        if (offsetTop + highlightItem.scrollHeight > (scrollTop + suggestion.clientHeight)) {
          suggestion.scrollTop += highlightItem.scrollHeight
        }
        if (offsetTop < scrollTop) {
          suggestion.scrollTop -= highlightItem.scrollHeight
        }
      },
      fetchSuggestions: function (inputString, cb) {
        const suggest = this.suggestTarget
        if (!this.suggest) {
          return
        }
        if (!inputString) {
          cb.call(this, [])
          return
        }
        if (typeof suggest === 'string') {
          gson(suggest, {filter: inputString}).then(cb)
        } else if (typeof suggest === 'function') {
          suggest(inputString, cb, this.refParam)
        } else {
          cb(this.suggest.filter(this.filter(inputString)))
        }
      },
      handleIconClick (e) {
        this.showReference()

      },
      setParams (params, isClear = true) {
        if (this.refParams === params) {
          return
        }
        this.refParams = params
        if (isClear) {
          this.model[this.field] = null
          this.model[this.labelField] = null
        }
        this.refresh = true
      },
      getDialogOptions () {
        let o = this
        let options = {
          params: o.refParams,
          dep: '#' + o.getElmID(),
          refresh: o.refresh,
          '@open': ($event) => {
            o.$dialogs.getCurrent().$reference = o
            console.log($event)
            $event && $event.reset && $event.reset()
          }
        }
        return options
      },
      showReference () {
        let _self = this
        let ref = this.refTo
        if (typeof ref === 'string') {
          refs.get(ref, (conf) => {
            openReference(_self, conf)
          })
          return
        }
        let conf = ref.component ? ref : {component: ref}
        openReference(_self, conf)
      },
      closeReference (item) {
        if (item) {
          this.select(item)
        }
        this.$dialogs.closeCurrent()
        this.$emit('afterReference', item, this)
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
