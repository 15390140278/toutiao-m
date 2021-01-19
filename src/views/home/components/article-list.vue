<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh">
      <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="请求失败，点击重新加载">
        <article-item :article="article"
          v-for="(article, index) in list"
          :key="index"
        />
<!--      <van-cell-->
<!--        v-for="(article, index) in list"-->
<!--        :key="index"-->
<!--        :title="article.title" />-->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: null,
      error: false,
      isRefreshLoading: false,
      refreshSuccessText: '刷新成功'
    }
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  methods: {
    async onLoad () {
      try {
        //  1请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp ? this.timestamp : Date.now(),
          with_top: 1
        })
        console.log(data)
        // if (Math.random() > 0.5) {
        //   JSON.parse('jdsfdsfs')
        // }
        //  2把请求结果放到list中
        const { results } = data.data
        this.list.push(...results)
        //  3加载状态设置为结束
        this.loading = false
        //  4判断数据是否全部加载完成
        if (results.length) {
          console.log(results.length)
          this.timestamp = data.data.pre_timestamp
        } else {
          this.finished = true
        }
      } catch (err) {
        console.log('请求失败', err)
        this.error = true
        this.loading = false
      }
    },
    async onRefresh () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          with_top: 1
        })
        // if (Math.random() > 0.5) {
        //   JSON.parse('jdsfdsfs')
        // }
        const { results } = data.data
        this.list.unshift(...results)
        this.isRefreshLoading = false
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        console.log('请求失败', err)
        this.isRefreshLoading = false
        this.refreshSuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
