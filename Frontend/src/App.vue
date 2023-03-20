<script setup>
import SetupandDailogNoti from '@/views/notify/SetupandDailogNoti.vue';
import Dailog_Report from '@/views/dailog_report/Dailog_Report.vue';
import DialogProfile from '@/views/profile/DialogProfile.vue';
</script>

<template>
  <div>
    <component :is="SetupandDailogNoti" />
    <component :is="Dailog_Report" />
    <component :is="DialogProfile" />
    <router-view />
  </div>
</template>

<!-- <style scoped></style> -->
