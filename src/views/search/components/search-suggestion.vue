<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(item, index) in suggestionlist"
      :key="index"
      @click="$emit('search', item)"
    >
      <span slot="title" v-html="highlight(item)"></span>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from "@/api/search.js";
// lodash 支持按需加载，有利于打包结果优化
import { debounce } from "lodash";
export default {
  name: "SearchSuggestion",
  components: {},
  props: {
    searchtext: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestionlist: []
    };
  },
  computed: {},
  watch: {
    searchtext: {
      // debounce 函数
      // 参数1：一个函数
      // 参数2：延迟时间，单位是毫秒
      // 返回值：防抖之后的函数
      // debounce(函数,时长)  返回一个防抖函数
      handler: debounce(function(val) {
        this.loadSearchSuggestion(val);
      }, 1500),
      immediate: true //页面刷新立即侦听
    }
  },
  created() {},
  mounted() {},
  methods: {
    async loadSearchSuggestion(val) {
      try {
        const { data } = await getSearchSuggestion(val);
        // console.log(data);
        this.suggestionlist = data.data.options;
      } catch (err) {
        this.$toast("获取失败,稍后重试");
      }
    },
    highlight(text) {
      //需要被替换的字符串
      const htmlstr = `<span class='active'>${this.searchtext}</span>`;
      //正则表达式
      const str = new RegExp(this.searchtext, "gi");
      //进行替换
      return text.replace(str, htmlstr);
    }
  }
};
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: red;
  }
}
</style>
