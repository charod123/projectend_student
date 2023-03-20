<script setup>
import { ref } from 'vue';
const prority = JSON.parse(sessionStorage.getItem('priority'))
const nestedRouteItems = ref([
    {
        label: 'รายงานสรุปข้อมูลผู้ป่วย',
        to: '/admin/user/dashboard',
        visible: true
    },
    {
        label: 'รายงานสรุปอัตตราการเกิดเหตุการณ์ฉุกเฉิน',
        to: '/admin/user/dashboard_Analysis',
        visible: prority.filter(x => x.priority_id == 15)[0]?.can_read == 1 ? true : false ?? true


    },



]);
</script>
<template>
    <div class="grid p-fluid">
        <div class="col-12 md:col-12">
            <div class="card card-w-title">
                <TabMenu :model="nestedRouteItems" style="font-family: Kanit;" class="text-2xl" />
                <router-view />
            </div>
        </div>
    </div>
</template>
