<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :immediate-check='false'
  >
    <CommentItem
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @repalyClick="$emit('repalyClick', $event)"
    />
  </van-list>
</template>
<script>
import { getComments } from "@/api/comment.js";
import CommentItem from "./comment-item";
export default {
  name: "CommentList",
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    // 其他属性...
    // 定义自定义属性list，去接收外面的commentList 变量
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      // 自定义 Prop 数据验证
      validator(value) {
        return ["a", "c"].includes(value);
      },
      default: "a"
    }
  },
  data() {
    return {
      // list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null,
      limit: 10
    };
  },
  created() {
    this.loading=true
    this.onLoad();
  },
  methods: {
    async onLoad() {
      try {
        // 1. 请求获取数据
        const { data } = await getComments({
          type: this.type, //  评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id，文章id或评论id,【可能有大数字，所以执行一下toString 方法】
          offset: this.offset, // 评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        });
        // 2. 将数据添加到列表中(一定要注意是追加数据，否则列表高度不增加，形成死循环)
        const { results } = data.data;
        this.list.push(...results);
        this.$emit("onload-success", data.data);
        // 3. 将 loading 设置为 false
        this.loading = false;
        // 4. 判断是否还有数据
        if (results.length) {
          // 有就更新获取下一页的数据页码
          this.offset = data.data.last_id;
        } else {
          // 没有就将 finished 设置结束
          this.finished = true;
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
