<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <template #left>
        <!-- 后退上一页:  $router.back() 或 $router.go(-1) -->
        <van-icon name="cross" @click="$router.back()" />
      </template>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <van-form @submit="onSubmit" ref="one">
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="fromRules.mobile"
        type="number"
        maxlength="11"
      >
        <!--【增加图标】-->
        <template #left-icon>
          <i class="toutiao toutiao-shouji"></i>
        </template>
      </van-field>
      <van-field
        name="code"
        placeholder="请输入验证码"
        v-model="user.code"
        :rules="fromRules.code"
        type="number"
        maxlength="6"
      >
        <!--【增加图标】-->
        <template #left-icon>
          <i class="toutiao toutiao-yanzhengma"></i>
        </template>
        <!--【增加发送按钮】-->
        <template #button>
          <!--这里注意，要加上native-type,否则也可以实现表单提交-->
          <!-- 倒计时 -->
          <van-count-down
            :time="1000 * 3"
            format="ss s"
            v-if="isCountDownShow"
            @finish="isCountDownShow = false"
          />
          <van-button
            class="send-sms-btn"
            round
            size="small"
            native-type="button"
            type="default"
            @click="onsendSms"
            v-else
          >
            发送验证码
          </van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap" style="margin:5px">
        <!--其实van-button按钮如果包裹在van-form里面默认类型就是native-type，这里不加也可以-->
        <van-button class="login-btn" block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from "@/api/user";
export default {
  name: "LoginPage",
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: "",
        code: ""
      },
      fromRules: {
        mobile: [
          {
            required: true,
            message: "请输入手机号"
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: "手机号格式错误"
          }
        ],
        code: [
          {
            required: true,
            message: "验证码不能为空"
          },
          {
            pattern: /^\d{6}$/,
            message: "验证码格式错误"
          }
        ]
      },
      isCountDownShow: false
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onSubmit() {
      //拿取参数
      const user = this.user;
      //登录轻提示
      this.$toast.loading({
        message: "登录中...",
        forbidClick: true, //禁用背景点击
        duration: 5000 //持续时间，默认是2000,如果是0则持续展示
      });

      //发送请求
      try {
        const { data } = await login(user);
        // 存储数据【存储到仓库里面】
        this.$store.commit("setUser", data.data);

        this.$toast.success({
          message: "登录成功"
        });
        // this.$router.back()
        let url = this.$route.query.url;
        this.$router.replace(url || "/home");
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail({
            message: "手机号或验证码错误！"
          });
        } else {
          console.log("登录失败，请稍后再试", err);
        }
      }
    },
    async onsendSms() {
      try {
        //校验手机号
        await this.$refs.one.validate("mobile");
      } catch (err) {
        return console.log("发生错误");
      } // 2. 验证通过，显示倒计时

      this.isCountDownShow = true;
      // 3. 请求发送验证码
      try {
        await sendSms(this.user.mobile);
        this.$toast("获取验证码成功");
      } catch (err) {
        if (err.response.status === 429) {
          this.$toast("发送太频繁了，请稍后重试");
        } else {
          this.$toast("发送失败，请稍后重试");
        }
      }
    }
  }
};
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 30px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
