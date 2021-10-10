<template>
  <div class="comment-reply">
    <van-nav-bar
      :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'"
        >
      <van-icon name="cross" slot="left" @click="$emit('close')" />
    </van-nav-bar>
    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <CommentItem :comment="comment" />
      <!-- /当前评论项 -->

      <!-- 评论的回复列表 -->
      <!-- <van-cell title="全部回复"> -->
        <CommentList :source="comment.com_id" type="c" :list='CommentRep'/>
      <!-- </van-cell> -->
      <!-- /评论的回复列表 -->
    </div>

    <!-- 底部区域 -->
    <div class="reply-bottom">
      <van-button class="write-btn" size="small" round @click="isPostShow=true">写评论</van-button>
    </div>
    <!-- /底部区域 -->

<!-- 发布评论 -->
<van-popup v-model="isPostShow" position="bottom">
   <CommentPost
   :target="comment.com_id"
   type='c'
   @postcomment='getComment' 
   />
</van-popup>
<!-- /发布评论 -->
    <!-- 评论的回复列表 -->

    <!-- /评论的回复列表 -->
  </div>
</template>

<script>
import CommentItem from "./comment-item";
import CommentList from "./comment-list.vue";
import CommentPost from './comment-post.vue'
export default {
  name: "CommentReply",
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isPostShow:false,
      CommentRep:[]
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getComment(data){
      console.log(data);
      this.isPostShow=false,
      this.CommentRep.unshift(data.new_obj)
      this.comment.reply_count++
    }
  }
};
</script>

<style scoped lang="less">
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}

.reply-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .write-btn {
    width: 60%;
  }
}
</style>
