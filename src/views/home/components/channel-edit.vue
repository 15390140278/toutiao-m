<template>
  <div class="channel-edit">
<!--    我的频道-->
    <div>
      <van-cell :border="false">
        <div slot="title" class="title-text">我的频道</div>
        <van-button
          class="edit-btn"
          type="danger"
          plain
          round
          size="small"
          @click="isEdit = ! isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button>
      </van-cell>
      <van-grid class="my-grid"
        :gutter="10">
        <van-grid-item
          class="grid-item"
          v-for="(channel, index) in myChannels"
          :key="index"
          @click="onMyChannelClick(channel, index)"
        >
          <van-icon
            v-show="isEdit && !fiexdChannels.includes(channel.id)"
            slot="icon"
            name="clear">
          </van-icon>
          <span
            class="text"
            :class="{ active: index === active }"
            slot="text">
            {{ channel.name }}</span>
        </van-grid-item>
      </van-grid>
    </div>
<!--    /我的频道-->
<!--    频道推荐-->
    <div>
      <van-cell :border="false">
        <div slot="title" class="title-text">推荐频道</div>
      </van-cell>
      <van-grid class="recommend-grid"
        :gutter="10">
        <van-grid-item class="grid-item"
          icon="plus"
          v-for="(recommendChannel, index) in recommendChannels"
          :key="index"
          :text="recommendChannel.name"
          @click="onAddChannel(recommendChannel)"
        />
      </van-grid>
    </div>
<!--    /频道推荐-->
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false,
      fiexdChannels: [0] // 固定频道，不允许删除
    }
  },
  computed: {
    recommendChannels () {
      return this.allChannels.filter(channel => {
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
    },
    // recommendChannels () {
    //   const channels = []
    //   this.allChannels.forEach(channel => {
    //     const ret = this.myChannels.find(mychannel => {
    //       return mychannel.id === channel.id
    //     })
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })
    //   return channels
    // }
    ...mapState(['user'])
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        console.log(data)
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel (channel) {
      console.log(channel)
      this.myChannels.push(channel)
      if (this.user) {
        try {
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length
          })
        } catch (err) {
          this.$toast('保存失败')
        }
      } else {
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        if (this.fiexdChannels.includes(channel.id)) {
          return
        }
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1)
        }
        this.myChannels.splice(index, 1)
        this.deleteChannel(channel)
      } else {
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {
      if (this.user) {
        try {
          await deleteUserChannel(channel.id)
        } catch (err) {
          this.$toast('操作失败')
        }
      } else {
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      background-color: #f4f5f6;
      .van-grid-item__text, .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        white-space: nowrap;
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
