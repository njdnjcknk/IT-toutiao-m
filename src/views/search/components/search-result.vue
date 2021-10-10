<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
      <van-cell
        v-for="(item, index) in resultList"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from "@/api/search.js";
export default {
  name: "SearchResult",
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      resultList: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 20,
      error: false
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      // 1. 请求获取数据
      try {
        const { data } = await getSearchResult({
          page: this.page, // 页码
          per_page: this.per_page, // 每页大小
          q: this.searchText // 查询关键词
        });
        // console.log(data);
        //2.解构给数组赋值渲染页面
        const { results } = data.data;
        this.resultList.push(...results);
        // 3. 将本次加载中的 loading 关闭
        this.loading = false;
        // 4. 判断是否还有数据
        if (results.length) {
          this.page++;
        } else {
          // 如果没有，则将加载状态 finished 设置为结束
          this.finished = true;
        }
      } catch (err) {
        // 展示加载失败的提示状态
        this.error = true;
        // 加载失败了 loading 也要关闭
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped lang="less"></style>
