<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()
const nestedRouteItems = ref([
    {
        label: 'ข้อมูลผู้ป่วย',
        to: route.fullPath == '/edit/patient' ? '/edit/patient' : '/create/patient'
    },
    {
        label: 'ข้อมูลญาติ',
        to: route.fullPath == '/edit/patient/usertry' ? '/edit/patient/usertry' : '/create/patient/usertry'
    },
    {
        label: 'ข้อมูลอุปกรณ์',
        to: route.fullPath == '/edit/patient/device' ? '/edit/patient/device' : '/create/patient/device'
    }

]);
const headers = ref('')
onMounted(() => {
    if (route.fullPath == '/edit/patient') {
        console.log(route.fullPath);
        return headers.value = 'แก้ไขรายละเอียดของผู้สูงอายุหรือผู้ป่วยติดเตียง'
    }
    return headers.value = 'เพิ่มรายละเอียดของผู้สูงอายุหรือผู้ป่วยติดเตียง'
})
</script>

<template>
    <div class="grid p-fluid">
        <div class="col-12 md:col-12">
            <div class="card card-w-title">
                <h2 class="flex align-items-center justify-content-center mb-5">
                    {{ headers }}</h2>
                <Steps :model="nestedRouteItems" :readonly="true"  style="font-family: kanit;"/>
                <router-view />
            </div>
        </div>
    </div>
</template>
