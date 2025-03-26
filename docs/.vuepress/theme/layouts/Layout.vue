<template>
  <ParentLayout>
    <template #page-bottom>
      <div class="footer">
        <a target="_blank" href="https://beian.miit.gov.cn">陕ICP备2022004945号-1</a>
        <div class="interval">|</div>
        <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=61011302001621">
          <img src="../../public/assets/img/filing.png" style="float: left" />
          <p style="float: left; height: 20px; line-height: 20px; margin: 0px 0px 0px 5px; color: #939393">
            陕公网安备 61011302001621号
          </p>
        </a>
        <div class="interval">|</div>
        <a href="mailto:sunhaobo@stu.xidian.edu.cn">@2022-2025 seamew 版权所有</a>
      </div>
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from "@parent-theme/layouts/Layout.vue";

export default {
  name: "Layout",

  components: {
    ParentLayout
  }
};
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
.interval {
  margin: 0 20px;
}
</style>
