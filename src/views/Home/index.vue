<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 频道列表 -->
    <!--
animated 滑动的动画
border 底边框线
swipeable 开启左右手势滑动
-->
    <van-tabs class="channel-tabs" v-model="active" swipeable animated border>
      <van-tab :title="item.name" v-for="item in Channel" :key="item.id">
        <ArticleList :channel="item" />
      </van-tab>
      <!-- 右侧自定义内容 -->

      <!-- 右侧按钮 -->
      <template #nav-right>
        <!-- 占位元素 -->
        <div class="placeholder"></div>
        <div class="hamburger-btn" @click="show = true">
          <i class="toutiao toutiao-gengduo"></i>
        </div>
      </template>
    </van-tabs>
    <!-- /频道列表 -->
    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="show"
      closeable
      round
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '95%' }"
    >
      <Channel-edit
        :mychane="Channel"
        :active="active"
        @updata-active="onUpdataActive"
      />
    </van-popup>
    <!-- 频道编辑弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from "@/api/user.js";
import ArticleList from "./components/article-list.vue";
import ChannelEdit from "./components/channel-edit.vue";
import { mapState } from "vuex";
import { getItem } from "@/utils/storage.js";
export default {
  name: "HomeIndex",
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data() {
    return {
      active: 0,
      Channel: [],
      show: false
    };
  },
  computed: {
    ...mapState(["user"])
  },
  watch: {},
  created() {
    this.loadChannels();
  },
  mounted() {},
  methods: {
    async loadChannels() {
      try {
        if (this.user) {
          //登录用线上的
          const { data } = await getUserChannels();
          console.log(data,1);
          this.Channel = data.data.channels;
        } else {
          const localStorage = getItem("TOUTIAO_CHANNELS");
          //判断是否有本地存储
          if (localStorage) {
            this.Channel = localStorage;
          } else {
            const { data } = await getUserChannels();
            this.Channel = data.data.channels;
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    onUpdataActive(index, show) {
      this.active = index; //active等于传过来的index值
      this.show = show; //关闭弹出层
    }
  }
};
</script>

<style scoped lang="less">
.home-container {
  // 留出底部固定导航栏
  padding-bottom: 100px;
  // 其他样式
  padding-top: 174px;

  // tabs 标签导航也设置为固定定位
  /deep/ .van-tabs__wrap {
    position: fixed;
    top: 92px;
    z-index: 1;
    left: 0;
    right: 0;
    height: 82px;
  }
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }

    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }

    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      background-color: rgba(255, 255, 255, 0.902);
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
