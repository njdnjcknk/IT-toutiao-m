<template>
    <van-button
            :loading="loading"
            v-if="value"
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            @click="onFollow"
            >关注</van-button
          >
          <van-button
            v-else
            class="follow-btn"
            round
            size="small"
            @click="onFollow"
            >已关注
            </van-button>
</template>

<script>
import { addFollow, deleteFollow } from "@/api/user";
export default {
   name: 'FollowUser',
data() {
  return {
    loading:false
  }
},
//  model: {可以自定义v-model的value属性名和input事件名
//     prop: 'checked',
//     event: 'change'
//   },
props:{
    // 是否关注了
  value:{
    type:Boolean,
    required:true
  },
    // 用户ID 
  user_id:{
    type:[Number,String,Object],
    required:true
  }
},
methods: {
   async onFollow() {
      //如果没有登录提示
      if (!this.$store.state.user) return this.$toast("请登录！");
       this.loading = true // 展示关注按钮的 loading 状态
      try {
        if (this.value) {
          // 已关注
          await deleteFollow(this.user_id);
        } else {
          // 未关注
          await addFollow(this.user_id);
        }
        // this.is_follow = !this.is_follow;
        // 更新父组件试图
this.$emit('input',!this.value );
      } catch (err) {
        if (err && err.response.status === 400) {
          this.$toast("你不能关注自己");
        } else {
          this.$toast("操作失败");
        }
      }
      this.loading = false;
    }
},
}
</script>

<style>

</style>