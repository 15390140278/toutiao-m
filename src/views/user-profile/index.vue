<template>
  <div class="user-profile">
<!--    导航栏-->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
<!--    /导航栏-->
    <input
      type="file"
      hidden ref="file"
      @change="onFileChange"
    >
<!--    个人信息-->
    <van-cell
      title="头像"
      is-link
      @click="$refs.file.click()"
    >
      <van-image
        class="avatar"
        fit="cover"
        round
        :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUpdateNameShow = true"
    />
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isUpdateGenderShow = true"
    />
    <van-cell title="生日" :value="user.birthday" is-link />
<!--    /个人信息-->
<!--    编辑昵称弹出层-->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%"
      position="bottom"
    >
      <update-name
        v-if="isUpdateNameShow"
        v-model="user.name"
        @close="isUpdateNameShow = false"
      />
    </van-popup>
<!--    /编辑昵称弹出层-->
<!--    编辑性别弹出层-->
    <van-popup
      v-model="isUpdateGenderShow"
      position="bottom"
    >
      <update-gender
        v-if="isUpdateGenderShow"
        v-model="user.gender"
        @close="isUpdateGenderShow = false"
      />
    </van-popup>
<!--    /编辑性别弹出层-->
<!--    编辑生日弹出层-->
    <van-popup
      v-model="isUpdateBirthdayShow"
      position="bottom"
    >
      <update-birthday
        v-if="isUpdateBirthdayShow"
        v-model="user.birthday"
        @close="isUpdateBirthdayShow = false"
      />
    </van-popup>
<!--    /编辑生日弹出层-->
    <!--    编辑头像弹出层-->
    <van-popup
      v-model="isUpdateAvatarShow"
      position="bottom"
      style="height: 100%;"
    >
      <update-avatar
        v-if="isUpdateAvatarShow"
        :img="img"
        @close="isUpdateAvatarShow = false"
        @update-avatar="user.photo = $event"
      />
    </van-popup>
    <!--    /编辑头像弹出层-->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdateAvatar from './components/update-avatar'
export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdateAvatar
  },
  data () {
    return {
      user: {},
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdateAvatarShow: false,
      img: null
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        console.log(data)
        this.user = data.data
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    onFileChange () {
      //  获取文件对象
      const file = this.$refs.file.files[0]
      //  基于文章对象获取blob数据
      this.img = window.URL.createObjectURL(file)
      this.isUpdateAvatarShow = true
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
