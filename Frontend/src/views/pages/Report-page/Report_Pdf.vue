<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from '../../../store';
const store = useStore();
onMounted(() => {
    setTimeout(() => {
        window.print();
    }, 1000)
})
</script>

<template>
    <div class="print_report">
        <div class="grid">
            <div class="col-12">
                <h1>{{ store.data_report?.header }}</h1>
            </div>
            <br>
            <div class="col-12">
                <DataTable :value="store.data_report?.data" showGridlines tableStyle="min-width: 50rem"
                    style="font-family: Kanit;">
                    <Column v-if="store.data_report.type == 'complain'" field="ลำดับ" header="ลำดับ"></Column>
                    <Column v-if="store.data_report.type == 'complain'" field="เรื่องร้องเรียน" header="เรื่องร้องเรียน"></Column>
                    <Column v-if="store.data_report.type == 'complain'" field="ประเภทเรื่องร้องเรียน" header="ประเภทเรื่องร้องเรียน"></Column>
                    <Column v-if="store.data_report.type == 'complain'" field="เบอร์โทรติดต่อกลับ" header="เบอร์โทรติดต่อกลับ"></Column>
                    <Column v-if="store.data_report.type == 'complain'" field="สถานะ" header="สถานะ"></Column>

                    <Column v-if="store.data_report.type == 'noti'" field="ลำดับ" header="ลำดับ"></Column>
                    <Column v-if="store.data_report.type == 'noti'" field="ชื่อ-นามสกุลผู้ป่วย" header="ชื่อ-นามสกุลผู้ป่วย"></Column>
                    <Column v-if="store.data_report.type == 'noti'" field="ชื่ออุปกรณ์/IPอุปกรณ์" header="ชื่ออุปกรณ์/IPอุปกรณ์"></Column>
                    <Column v-if="store.data_report.type == 'noti'" field="เวลาที่เกิดแจ้งเตือน" header="เวลาที่เกิดแจ้งเตือน"></Column>
                    <Column v-if="store.data_report.type == 'noti'" field="สถานะการดำเนินการ" header="สถานะการดำเนินการ"></Column>

                    <Column v-if="store.data_report.type == 'user_admin'" field="ลำดับ" header="ลำดับ"></Column>
                    <Column v-if="store.data_report.type == 'user_admin'" field="ชื่อ-นามสกุล" header="ชื่อ-นามสกุล"></Column>
                    <Column v-if="store.data_report.type == 'user_admin'" field="ตำแหน่ง" header="ตำแหน่ง"></Column>
                    <Column v-if="store.data_report.type == 'user_admin'" field="ชื่อหน่วยงานที่สังกัด" header="ชื่อหน่วยงานที่สังกัด"></Column>
                    <Column v-if="store.data_report.type == 'user_admin'" field="หน่วยงาน" header="หน่วยงาน"></Column>
                </DataTable>
            </div>

        </div>


    </div>
</template>
<style scoped lang="css">
.print_report {
    display: none
}

/* For non-scrollable DataTable */
.p-datatable td,
.p-datatable th {
    border: 1px solid black;
}

/* For scrollable DataTable */



@media print {
    .print_report {
        display: grid
    }

}
</style>