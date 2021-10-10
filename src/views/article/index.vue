<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->
    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="articleList.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ articleList.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="articleList.aut_photo"
          />
          <div slot="title" class="user-name">{{ articleList.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ articleList.pubdate | relativeTime }}
          </div>
          <!-- 封装的关注按钮组件 -->
          <!-- 模板中的$event是事件参数当我们传递给子组件的数据既要使用还要修改
传递：props
:is-followed='articleList.is_followed'
修改：自定义事件
@updata-is_followed='articleList.is_followed=$event'
简写方式：在组件上使用哪个v-model
value='articleList.is_followed'
@input='articleList.is_followed=$event'
一个组件标签只能有一个v-model指令
 -->
          <Follow
            v-model="articleList.is_followed"
            :user_id="articleList.aut_id"
          ></Follow>
          <!-- <van-button
            :loading="isfollowedloading"
            v-if="articleList.is_followed"
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
            >已关注</van-button
          > -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          ref="article-content"
          v-html="articleList.content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!------------------------------ 文章评论列表-------------------------------------->
        <CommentList
          :source="articleList.art_id"
          @onload-success="totalCommentCount = $event.total_count"
          :list="CommentList"
          @repalyClick="repalyClick"
        />
        <!------------------------------ /文章评论列表 ------------------------------------->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
            >写评论</van-button
          >
          <van-icon name="comment-o" :info="totalCommentCount" color="#777" />
          <CollectArticle
            class="btn-item"
            v-model="articleList.is_collected"
            :articleid="articleList.art_id"
          />
          <!--      v-model="articleList.attitude"
            简写:attitudeNum.sync='articleList.attitude'
             -->
          <LikeArticle
            class="btn-item"
            :attitudeNum.sync="articleList.attitude"
            :articleid="articleList.art_id"
          />
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!--------------------------------  发布评论 -------------------------------------->
        <van-popup v-model="isPostShow" position="bottom">
          <CommentPost
            :target="articleList.art_id"
            @postcomment="postcomments"
          />
        </van-popup>
        <!-------------------------------- /发布评论 -------------------------------------->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errstatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="btn">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!---------------------------------- 评论回复----------------------------->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 100%">
      <CommentReply
        :comment="currentComment"
        @close="isReplyShow = false"
        v-if="isReplyShow"
      />
    </van-popup>
    <!---------------------------------- 评论回复----------------------------->
  </div>
</template>

<script>
import { getArticleById } from "@/api/article";
import { ImagePreview } from "vant";
import CollectArticle from "@/components/collect-article";
import Follow from "@/components/follow_user";
import LikeArticle from "@/components/like-article";
import CommentList from "./components/comment-list.vue";
import CommentPost from "./components/comment-post";
import CommentReply from "./components/comment-reply";
export default {
  name: "ArticleIndex",
  components: {
    Follow, //关注组件
    CollectArticle, //收藏组件
    LikeArticle, //文章点赞组件
    CommentList, //文章评论组件
    CommentPost, //弹出层组件
    CommentReply
  },
  props: {
    // 使用props解耦获得了的动态路由数据，这样我们就可以使用this.articleId 获取动态路由数据 而不需要使用 this.$route.params.articleId
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  provide: function() {
    return {
      articleId: this.articleId
    };
  },
  data() {
    return {
      articleList: {},
      loading: true,
      errstatus: 0,
      totalCommentCount: 0, // 文章评论总数量
      isPostShow: false, //控制弹出层
      CommentList: [], //将子组件的list数据跟commentlist进行关联
      isReplyShow: false, //控制回复评论弹出层的
      currentComment: {}
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle();
  },
  mounted() {},
  methods: {
    async loadArticle() {
      this.loading = true;
      try {
        const { data } = await getArticleById(this.articleId);
        console.log(data);
        this.articleList = data.data;
        // 初始化图片点击预览
        // console.log(this.$refs["article-content"]); // 这里没有内容
        // 这个时候其实找不到 这个refs引用的，原因是因为v-if的渲染其实需要时间，我们视图还没有立即更新完成。
        // 使用定时器，延迟更新( setTimeout 0 会把要做的事情放在异步队列的最后面执行！ )
        setTimeout(() => {
          // this.$refs["article-content"];
          this.previewImage();
        }, 0);
      } catch (err) {
        console.log(err);
        if (err.response && err.response.errstatus === 404) {
          this.errstatus = 404;
        }
      }
      this.loading = false;
    },
    btn() {
      this.loadArticle();
      //点击重新加载
      this.loading = true;
    },
    // 预览图片处理事件函数
    previewImage() {
      // 得到所有的 img 节点
      const articleContent = this.$refs["article-content"]; // 获取到了容器节点
      const imgs = articleContent.querySelectorAll("img");
      // 获取所有 img 地址
      const images = [];
      imgs.forEach((img, index) => {
        images.push(img.src);
        // 给每个 img 注册点击事件，在处理函数中调用预览
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 起始位置，从 0 开始
            startPosition: index
          });
        };
      });
    },
    postcomments(data) {
      //关闭弹出层
      this.isPostShow = false;
      //追加父组件数据
      this.CommentList.unshift(data.new_obj);
      this.totalCommentCount++;
    },
    repalyClick(comment) {
      this.isReplyShow = true;
      // console.log(comment);
      this.currentComment = comment;
    }
  }
};
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .btn-item {
      border: 0px;
    }
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
