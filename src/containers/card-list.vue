<!--
 --卡片列表
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-8-2
 -->
<template>
  <el-row>
    <div v-if="!model||mode.length==0">没有任何记录</div>
    <template v-for="item in model">
      <el-card :class="cardClass">
        <img :src="item[card.img]" class="image" v-if="card.img != null">
        <div class="card-content">
          <span>{{item.card.title}}</span>
          <div class="bottom clearfix">
            <time class="time">{{ currentDate }}</time>
            <el-button type="text" class="button">操作按钮</el-button>
          </div>
        </div>
      </el-card>
    </template>
  </el-row>
</template>

<script>
import fac from 'fansion-fac'
import fase from 'fansion-base'

/**
 * 获取工具方法
 */
const {toRender} = fase.render
const {confs2Comps} = fac.comps

export default {
  name: 'FacCardList',
  props: {
    page: Object,
    fac: Object,
    model: Array,
    conf: [String, Object],
    comps: [Array, Object],
    before: String,
    end: String,
    css: String
  },
  created () {
    let cardTemplate
    if (typeof this.conf !== 'string') {
      let cardClass = this.css ? this.css : 'card'
      let card = this.conf
      let image = card.img ? `<img :src="item.${card.img}" class="image"/>` : ''
      let title = card.titleHtml || `{{item.${card.title || 'title'}}}`
      let time = card.time ? `<time class="time">{{new Date(item.${card.time}).format('yyyy-MM-dd hh:mm')}}</time>` : ''
      let bottom = time !== '' || card.buttons ? `<div class="bottom clearfix">${time}${card.buttons}</div>` : ''
      cardTemplate = `<el-card class="${cardClass}" body-style="padding:0px;">${image}
          <div class="card-content">
              <span class="title">${title}</span>
              ${bottom}
          </div>
        </el-card>`
    } else {
      cardTemplate = this.conf
    }
    let components = {}
    confs2Comps(this.comps, components)
    let before = this.before || ''
    let end = this.end || ''
    toRender(this, `<el-row class="fac-card-list">${before}<div class="card-list-empty-block" v-if="!model||model.length==0"><span class="no-data" >暂无数据</span></div><template v-for="item in model">${cardTemplate}</template>${end}</el-row>`, components)
  }
}
</script>

<style lang="less">
  .fac-card-list{
    background: #fff;
    min-height:   60px;
    padding: 20px 20px;
    .card{
      border-radius: 0;
      display:inline-block;
      margin: 10px 10px;
    }
    .card-content{
      padding: 10px;
      .el-button--text{
        padding: 2px;
      }
      .time{
        padding: 2px;
        float:left;
      }
      .title{
        font-weight: bold;
        display: inline-block;
        width: 240px;
        height:30px;
        vertical-align:middle;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .buttons{
        float:right;
      }
    }
  }
  .card-list-empty-block{
    position: relative;
    min-height: 60px;
    text-align: center;
    width: 100%;
    height: 100%;

    .no-data{
      position: absolute;
      left: 50%;
      top: 50%;
      -ms-transform: translate(-50%,-50%);
      transform: translate(-50%,-50%);
      color: #5e7382;
    }
  }
</style>
