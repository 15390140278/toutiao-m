<template>
  <van-button
    :icon="isCollected ? 'star' : 'star-o'"
    :class="{
      collected: isCollected
    }"
    :loading="loading"
    @click="onCollect"
  />

</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'

export default {
  name: 'CollectArticle',
  model: {
    prop: 'isCollected'
  },
  props: {
    isCollected: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async onCollect () {
      this.loading = true
      try {
        if (this.isCollected) {
          await deleteCollect(this.articleId)
        } else {
          await addCollect(this.articleId)
        }
        this.$emit('input', !this.isCollected)
        this.$toast(!this.isCollected ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast.fail('操作失败')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.collected {
  .van-icon {
  color: #ffa500;
}
}
</style>
