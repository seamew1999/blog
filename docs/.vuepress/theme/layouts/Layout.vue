<template>
  <ParentLayout>
    <template #page-bottom>
      <div class="footer">seamew 版权所有 陕ICP备2022004945号</div>
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'

export default {
  name: 'Layout',

  components: {
    ParentLayout
  }
}
</script>

<style scoped>
.footer {
  text-align: center;
}
</style>