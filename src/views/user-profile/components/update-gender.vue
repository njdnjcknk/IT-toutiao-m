<template>
  <div class="update-gender">
    <van-picker
      show-toolbar
      title="性别"
      :columns="columns"
      :default-index="value"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onPickerChange"
    />
  </div>
</template>

<script>
import {updateUserProfile} from '@/api/user'
export default {
  name: "UpdateGender",
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      columns: ["男", "女"],
      localGender: this.value // 当前性别
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 确定事件
    async onConfirm() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      });
      try {
        await updateUserProfile({
          gender: this.localGender
        });
        // 更新视图
        this.$emit("input", this.localGender);
        // 关闭弹层
        this.$emit("close");
        // 提示成功
        this.$toast.success("更新成功");
      } catch (err) {
        this.$toast.fail("更新失败");
      }
    },
    // 选择器发生变化的时候
    onPickerChange(picker, value, index) {
      this.localGender = index;
    }
  }
};
</script>

<style scoped lang="less"></style>
