<!--
 --列表节点
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-8-2
 -->
<template>
  <li class="list-node" @click="click" @dblclick="dblclick">
    <el-checkbox
      v-if="showCheckbox"
      v-model="node.checked"
      :indeterminate="node.indeterminate"
      :disabled="!!node.disabled"
      @click.native.stop
      @change="handleCheckChange"
    >
    </el-checkbox>
    <node-content :node="node"></node-content>
    <span class="fac-list-node-drag" v-if="$parent.sortable" draggable
          @dragstart.stop="handleDragStart"
          @dragover.stop="handleDragOver"
          @dragend.stop="handleDragEnd"
          @drop.stop="handleDrop">
      <i class="fa fa-grip-vertical"/>
    </span>
  </li>
</template>

<script type="text/jsx">
export default {
  name: 'FacListNode',
  props: {
    page: Object,
    fac: Object,
    node: {
      default() {
        return {};
      }
    },
    index: Number,
    renderContent: Function,

    showCheckbox: {
      type: Boolean,
      default: false
    }
  },
  components: {
    NodeContent: {
      props: {
        node: {
          required: true
        }
      },
      render(h) {
        const parent = this.$parent;
        const labelField = parent.labelField
        const node = this.node;
        const { data, store } = node;
        return (
          parent.renderContent
            ? parent.renderContent.call(parent._renderProxy, h, { _self: tree.$vnode.context, node, data, store })
            : parent.$scopedSlots.default
              ? parent.$scopedSlots.default({ node, data })
              : <span class="fac-list-node__label">{ node[labelField] }</span>
        );
      }
    }
  },
  methods: {
    click (e) {
      this.$parent.$emit('click', index, e)
    },
    dblclick (e) {
      this.$parent.$emit('dblclick', index, e)
    },
    handleDragStart(event) {
      if (!this.sortable) return;
      this.$parent.$emit('list-node-drag-start', event, this);
    },

    handleDragOver(event) {
      if (!this.sortable) return;
      this.$parent.$emit('list-node-drag-over', event, this);
      event.preventDefault();
    },

    handleDrop(event) {
      event.preventDefault();
    },

    handleDragEnd(event) {
      if (!this.sortable) return;
      this.$parent.$emit('list-node-drag-end', event, this);
    }
  }
}
</script>
