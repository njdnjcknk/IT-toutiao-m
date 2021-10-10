<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!--
          Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮
         -->
    <form class="search-form" action="/">
      <van-search
        v-model.trim="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isSearchResult = false"
      />
    </form>
    <!-- 搜索结果 -->
    <SearchResult v-if="isSearchResult" :searchText="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <SearchSuggestion
      v-else-if="searchText"
      :searchtext="searchText"
      @search="onSearch"
    />
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <SearchHistory v-else :SearchHistory="SearchHistory" @search="onSearch" />
    <!-- /搜索历史记录 -->
  </div>
</template>
<script>
import SearchResult from "./components/search-result";
import SearchHistory from "./components/search-history";
import SearchSuggestion from "./components/search-suggestion";
import { setItem, getItem } from "@/utils/storage.js";
export default {
  name: "SearchPage",
  components: {
    SearchResult,
    SearchHistory,
    SearchSuggestion
  },
  props: {},
  data() {
    return {
      searchText: "", // 绑定输入框变量
      isSearchResult: false,
      SearchHistory: getItem("serach-histories") || []
    };
  },
  computed: {},
  watch: {
    SearchHistory(val) {
      // 同步到本地存储
      setItem("serach-histories", val);
    }
  },
  created() {},
  methods: {
    // Search 组件提供了 search 和 cancel 事件，search 事件在点击键盘上的搜索/回车按钮后触发，cancel 事件在点击搜索框右侧取消按钮时触发。
    onSearch(val) {
      this.searchText = val; //搜索联想点击给文本框赋值
      // 存储搜索历史记录
      // 要求：不要有重复历史记录、最新的排在最前面
      const index = this.SearchHistory.indexOf(val);
      if (index !== -1) {
        this.SearchHistory.splice(index, 1);
      }
      this.SearchHistory.unshift(val);

      this.isSearchResult = true; //搜索结果后将控制搜索结果的变量改为true让搜索结果显示出来
    },
    onCancel() {
      this.$router.back(); //取消按键后退一步从哪来回哪去
    }
  }
};
</script>
<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
