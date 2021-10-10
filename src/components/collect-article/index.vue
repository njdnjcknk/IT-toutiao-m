<template>
  <van-button
    :icon="isarticle ? 'star' : 'star-o'"
    :class="{ collected: isarticle }"
    :loading="loading"
    @click="onCollect"
  ></van-button>
</template>
<script>
import { addCollect, deleteCollect } from "@/api/article.js";
export default {
  name: "CollectArticle",
  model: {
    prop: "isarticle",
    event: "getarticle"
  },
  props: {
    isarticle: {
      type: Boolean,
      required: true
    },
    articleid: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false //loading 状态
    };
  },
  methods: {
    async onCollect() {
      //如果没有登录提示
      if (!this.$store.state.user) return this.$toast("请登录！");
      this.loading = true;
      try {
        if (this.isarticle) {
          await deleteCollect(this.articleid);
        } else {
          await addCollect(this.articleid);
        }
        // 更新视图
        // 自定义事件修改数据并不是立即的
        this.$emit("getarticle", !this.isarticle);

        //  this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
        if (!this.isarticle) {
          this.$toast.success("收藏成功");
        } else {
          this.$toast.fail("取消收藏");
        }
      } catch (err) {
        console.log(err);
        this.$toast("收藏失败");
      }
      this.loading = false;
    }
  },
  created() {}
};
</script>
<style scoped lang="less">
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>
