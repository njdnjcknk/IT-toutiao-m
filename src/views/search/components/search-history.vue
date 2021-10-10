<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isshow">
        <span @click="SearchHistory.splice(0)">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isshow = false">完成</span>
      </div>
      <van-icon name="delete" v-else @click="isshow = true" />
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in SearchHistory"
      :key="index"
      @click="delitem(item, index)"
    >
      <van-icon name="close" v-show="isshow" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "SearchHistory",
  components: {},
  props: {
    SearchHistory: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isshow: false
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    delitem(item, index) {
      if (this.isshow) {
        //删除状态
        this.SearchHistory.splice(index, 1);
      } else {
        //如果不是删除状态就触发首页search事件
        this.$emit("search", item);
      }
    }
  }
};
</script>

<style scoped lang="less"></style>
