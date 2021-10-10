<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->
    <!-- 文件选择 -->
    <input type="file" hidden ref="file" @change="onFileChange" />
    <!-- 文件选择 -->
    <!-- 个人信息 -->
    <van-cell
      class="avatar-cell"
      title="头像"
      is-link
      center
      @click="$refs.file.click()"
    >
      <van-image class="avatar" round fit="cover" :src="profileList.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="profileList.name"
      is-link
      @click="isUpdateNameShow = true"
    />
    <van-cell
      title="性别"
      :value="profileList.gender === 0 ? '男' : '女'"
      is-link
      @click="isUpdateGenderShow = true"
    />
    <van-cell
      title="生日"
      :value="profileList.birthday"
      is-link
      @click="isUpdateBirthdayShow = true"
    />
    <!-- /个人信息 -->
    <!-- 编辑昵称 -->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%;"
      position="bottom"
    >
      <UpdateName
        @close="isUpdateNameShow = false"
        v-model="profileList.name"
        v-if="isUpdateNameShow"
      />
    </van-popup>
    <!-- /编辑昵称 -->
    <!-- 编辑性别 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <UpdateGender
        @close="isUpdateGenderShow = false"
        v-model="profileList.gender"
        v-if="isUpdateGenderShow"
      />
    </van-popup>
    <!-- /编辑性别 -->
    <!-- 编辑生日 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <UpdateBirthday
        v-model="profileList.birthday"
        @close="isUpdateBirthdayShow = false"
        v-if="isUpdateBirthdayShow"
      />
    </van-popup>
    <!-- /编辑生日 -->
    <!-- 图片编辑 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      position="bottom"
      style="height: 100%;"
    >
      <UpdatePhoto
        :img="img"
        @close="isUpdatePhotoShow = false"
        v-if="isUpdatePhotoShow"
        @updataphoto="profileList.photo = $event"
      />
    </van-popup>
    <!-- 图片编辑 -->
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user";
import UpdateName from "./components/update-name.vue";
import UpdateGender from "./components/update-gender.vue";
import UpdateBirthday from "./components/update-birthday.vue";
import UpdatePhoto from "./components/update-photo.vue";
export default {
  name: "UserProfile",
  components: {
    UpdateName, //昵称弹出层组件
    UpdateGender, //性别弹出层组件
    UpdateBirthday, //生日弹出层组件
    UpdatePhoto
  },
  props: {},
  data() {
    return {
      profileList: {},
      isUpdateNameShow: false, //修改昵称弹出层
      isUpdateGenderShow: false, //修改性别弹出层
      isUpdateBirthdayShow: false, //修改生日弹出层
      isUpdatePhotoShow: false,
      img: null
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getUserProfiles();
  },
  mounted() {},
  methods: {
    async getUserProfiles() {
      try {
        const { data } = await getUserProfile();
        this.profileList = data.data;
      } catch (err) {
        console.log(err);
        this.$toast("获取失败");
      }
    },
    onFileChange() {
      const file = this.$refs.file.files[0];
      this.isUpdatePhotoShow = true;
      this.img = window.URL.createObjectURL(file);
      this.$refs.file.value = "";
    }
  }
};
</script>

<style scoped lang="less">
.user-profile {
  .avatar-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
    .avatar {
      width: 60px;
      height: 60px;
    }
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
