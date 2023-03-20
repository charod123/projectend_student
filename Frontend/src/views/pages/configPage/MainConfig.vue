<script setup>
import { ref } from 'vue';
import { useStore } from '../../../store';
const store = useStore();
const nestedRouteItems = ref([
    {
        label: 'กำหนดสิทธิ์การใช้งาน',
        to: '/main/config/priority',
        visible: store.priority?.filter(x => x.priority_id == 14)[0]?.can_read == 1 ? true : false ?? true

    },
    {
        label: 'ตั้งค่าหน่วยงานย่อย',
        to: '/main/config/subdivision',
        visible: store.priority?.filter(x => x.priority_id == 5)[0]?.can_read == 1 ? true : false ?? true

    },
    {
        label: 'ตั้งค่าหน่วยงาน',
        to: '/main/config/division',
        visible: store.priority?.filter(x => x.priority_id == 4)[0]?.can_read == 1 ? true : false ?? true

    },

]);
</script>
<template>
    <div class="grid p-fluid">
        <div class="col-12 md:col-12">
            <div class="card card-w-title">
                <h1> ตั้งค่า </h1>
                <TabMenu :model="nestedRouteItems" style="font-family: Kanit;"/>
                <router-view />
            </div>
        </div>
    </div>
</template>
