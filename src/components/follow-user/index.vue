<template>
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    size="small"
    :loading="loading"
    @click="onFollow"
  >已关注</van-button>
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="loading"
    @click="onFollow"
  >关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'FollowUser',
  model: {
    prop: 'isFollowed', //  默认是value
    event: 'update-is_followed'//  默认是input
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
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
    async onFollow () {
      this.loading = true
      try {
        if (this.isFollowed) {
          const { data } = await deleteFollow(this.userId)
          console.log(data)
        } else {
          const { data } = await addFollow(this.userId)
          console.log(data)
        }
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (err) {
        let message = '关注失败'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己'
        } else if (err.response && err.response.status === 401) {
          message = '请先登录'
        }
        this.$toast(message)
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">

</style>
