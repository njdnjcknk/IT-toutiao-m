<template>
  <van-button
    :icon="attitudeNum  === 1 ? 'good-job' : 'good-job-o'"
    :class="{ liked: attitudeNum  === 1 }"
    :loading="loading"
    @click="onCollect"
  ></van-button>
</template>

<script>
import { addLike, deleteLike } from "@/api/article.js";
export default {
  name: "LikeArticle",
  data() {
    return {
      loading: false
    };
  },
  props: {
    attitudeNum : {
      type: Number,
      required: true
    },
    articleid: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    async onCollect() {
      this.loading = true;
      try {
        let status = -1;
        if (this.attitudeNum  === 1) {
          await deleteLike(this.articleid);
        } else {
          await addLike(this.articleid);
          status = 1;
        }
        //更新师徒
        this.$emit("update:attitudeNum", status);
        if (status === 1) {
          this.$toast.success("赞一个");
        } else {
          this.$toast.fail("取消点赞");
        }
      } catch (err) {
        this.$toast.fail("操作失败，请重试！");
      }
      this.loading = false;
    }
  }
};
</script>

<style scoped lang="less">
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>
