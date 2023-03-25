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
                    <Column field="ลำดับ" header="ลำดับ"></Column>
                    <Column field="เรื่องร้องเรียน" header="เรื่องร้องเรียน"></Column>
                    <Column field="ประเภทเรื่องร้องเรียน" header="ประเภทเรื่องร้องเรียน"></Column>
                    <Column field="เบอร์โทรติดต่อกลับ" header="เบอร์โทรติดต่อกลับ"></Column>
                    <Column field="สถานะ" header="สถานะ"></Column>
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
  border-color: #000;
}

/* For scrollable DataTable */
.p-datatable-scrollable td,
.p-datatable-scrollable th {
  border-color: #000;
}


@media print {
    .print_report {
        display: grid
    }

}</style>