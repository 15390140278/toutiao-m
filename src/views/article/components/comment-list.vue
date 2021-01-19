<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error="error"
    error-text="加载失败，请点击重试"
    :immediate-check="false"
    @load="onLoad"
  >
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click', $event)"
    />
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'

export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
      error: false
    }
  },
  created () {
    this.loading = true
    this.onLoad()
  },
  methods: {
    async onLoad () {
      try {
      //  1.请求获取数据
        const { data } = await getComments({
          type: this.type,
          source: this.source.toString(), //  axios会自动将source转为字符串，但是拼接url时会将引号编码，导致url格式不对，因此手动toString
          offset: this.offset,
          limit: this.limit
        })
        //  2.将数据添加到列表中
        console.log(data)
        const { results } = data.data
        this.list.push(...results)
        this.$emit('onload-success', data.data)
        //  3.将loading设为false
        this.loading = false
        //  4.判断是否还有数据
        if (results.length) {
          //    有就更新获取下一页的数据页码
          this.offset = data.data.last_id
        } else {
          //    没有就将finished设置结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
