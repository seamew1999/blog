<template>
  <ParentLayout>
    <template #page-bottom>
      <div class="footer">
        @2022-2023 seamew 版权所有
        <a target="_blank" href="https://beian.miit.gov.cn">
          陕ICP备2022004945号-1</a
        >
      </div>
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from "@parent-theme/layouts/Layout.vue";

export default {
  name: "Layout",

  components: {
    ParentLayout,
  },
};
</script>

<style scoped>
.footer {
  text-align: center;
}
</style>
