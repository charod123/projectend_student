<script setup>
import SetupandDailogNoti from '@/views/notify/SetupandDailogNoti.vue';
import DialogProfile from '@/views/profile/DialogProfile.vue';
</script>

<template>
  <div>
    <component :is="SetupandDailogNoti" />
    <component :is="DialogProfile" />
    <router-view />
  </div>
</template>

<!-- <style scoped></style> -->
