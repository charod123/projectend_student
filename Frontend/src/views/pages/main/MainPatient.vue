<script setup>
import { ref } from 'vue';
const prority = JSON.parse(sessionStorage.getItem('priority'))
const nestedRouteItems = ref([
    {
        label: 'จัดการข้อมูลผู้ป่วย',
        to: '/main/patient/datapatients',
        visible: true

    },
    {
        label: 'จัดการโรคที่มักพบบ่อย',
        to: '/main/patient/content_diseases',
        visible: prority.filter(x => x.priority_id == 15)[0]?.can_read == 1 ? true : false ?? true


    },
    {
        label: 'จัดการข้อมูลพนักงาน',
        to: '/main/patient/manage_user_admin',
        visible: prority.filter(x => x.priority_id == 7)[0]?.can_read == 1 ? true : false ?? true


    },
    {
        label: 'จัดการข้อมูลผู้ใช้งาน',
        to: '/main/patient/manage_user_basic',
        visible: prority.filter(x => x.priority_id == 3)[0]?.can_read == 1 ? true : false ?? true

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
