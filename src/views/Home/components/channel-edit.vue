<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
      >
        {{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(item, index) in mychane"
        :key="index"
        @click="myItemclick(item, index)"
      >
        <van-icon
          slot="icon"
          name="clear"
          v-show="isEdit && !fiexds.includes(item.id)"
        >
        </van-icon>
        <span :class="{ active: index === active }" class="text" slot="text">
          {{ item.name }}
        </span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        icon="plus"
        :text="item.name"
        v-for="(item, index) in recommendChannels"
        :key="index"
        @click="addChannels(item)"
      />
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import {
  getAllChannels,
  getAddChannels,
  getDelChannels
} from "@/api/channel.js";
import { mapState } from "vuex";
import { setItem } from "@/utils/storage.js";
export default {
  name: "ChannelEdit",
  components: {},
  props: {
    mychane: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      AllChannels: [], //所有频道
      isEdit: false,
      fiexds: [0]
    };
  },
  computed: {
    //计算属性会观测内部依赖数据的变化
    // 如果依赖的数据发生变化，则计算属性会重新执行
    recommendChannels() {
      //简化写法
      // 数据的filter方法：遍历数组，把符合条件的元素存储到新数组中并返回
      // return this.AllChannels.filter(item=>{
      // 数组的find方法遍历数组把把符合条件的第一个元素返回
      //   return !this.mychane.find(obj=>{
      //     return obj.id===item.id
      //   })
      // })

      //复杂写法
      let arr = []; //定义存储推荐频道的数组
      this.AllChannels.forEach(item => {
        //遍历所有频道数据forEach1
        //遍历传过来的我的频道数据find查找所有频道id和我的频道id是否有相同的条件表达式是true则返回当前元素
        const res = this.mychane.find(obj => {
          return obj.id === item.id; //return一个结果
        });
        if (!res) {
          //取返回结果的相反值false则是没有的频道
          arr.push(item); //push进定义的数组
        }
      });
      return arr; //return给计算属性
    },
    ...mapState(["user"])
  },
  watch: {},
  created() {
    this.loadAllChannels();
  },
  mounted() {},
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels();
        // console.log(data);
        this.AllChannels = data.data.channels;
        // console.log(this.AllChannels);
      } catch (err) {
        this.$toast("获取失败");
      }
    },

    //添加频道模块
    async addChannels(item) {
      //计算属性有变化所以mychane发生变化
      this.mychane.push(item);
      //判断是登录状态
      if (this.user) {
        try {
         await getAddChannels({
            id: item.id, // 频道ID
            seq: this.mychane.length // 序号
          });
 
        } catch (err) {
          this.$toast("获取失败");
          console.log(err);
        }
      } else {
        setItem("TOUTIAO_CHANNELS", this.mychane);
      }
    },
    // 删除模块
    async myItemclick(item, index) {
      if (this.isEdit) {
        if (this.fiexds.includes(item.id)) {
          return;
        }
        if (index <= this.active) {
          //让激活的频道减一
          this.$emit("updata-active", this.active - 1, true);
        }
        //删除频道
        this.mychane.splice(index, 1);
        // 处理删除持久化
        if (this.user) {
          try {
            await getDelChannels(item.id);
          } catch (err) {
            this.$toast("获取失败");
          }
        } else {
          setItem("TOUTIAO_CHANNELS", this.mychane);
        }
      } else {
        //点击高亮跳转页面
        this.$emit("updata-active", index, false);
      }
    }
  }
};
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
