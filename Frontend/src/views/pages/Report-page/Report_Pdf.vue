<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from '../../../store';
import { useRouter } from 'vue-router';
const router = useRouter();
const store = useStore();
onMounted(() => {
    setTimeout(() => {
        window.print();
    }, 1000)

})

window.addEventListener('afterprint', () => {
    router.back()
});
</script>

<template>
    <div class="print_report">
        <div class="grid">
            <div class="col-12">
                <h1>{{ store.data_report?.header }}</h1>
            </div>
            <br>
            <div class="col-12">
                <table style="border-collapse: collapse; width: 100%;" border="1">
                    <tbody>
                        <tr>
                            <th v-if="store.data_report.type == 'complain'">ลำดับ</th>
                            <th v-if="store.data_report.type == 'complain'">เรื่องร้องเรียน</th>
                            <th v-if="store.data_report.type == 'complain'">ผู้แจ้ง</th>
                            <th v-if="store.data_report.type == 'complain'">เวลาที่แจ้ง</th>
                            <th v-if="store.data_report.type == 'complain'">ประเภทเรื่องร้องเรียน</th>
                            <th v-if="store.data_report.type == 'complain'">เบอร์โทรติดต่อกลับ</th>
                            <th v-if="store.data_report.type == 'complain'">สถานะ</th>
                        </tr>
                        <tr v-show="store.data_report.type == 'complain'" v-for="item in store.data_report?.data"
                            :key="item">
                            <td class="p-2 text-center">{{ item['ลำดับ'] }}</td>
                            <td class="p-2 text-center">{{ item['เรื่องร้องเรียน'] }}</td>
                            <td class="p-2 text-center">{{ item['ผู้แจ้ง'] }}</td>
                            <td class="p-2 text-center">{{ item['เวลาที่แจ้ง'] }}</td>
                            <td class="p-2 text-center">{{ item['ประเภทเรื่องร้องเรียน'] }}</td>
                            <td class="p-2 text-center">{{ item['เบอร์โทรติดต่อกลับ'] }}</td>
                            <td class="p-2 text-center">{{ item['สถานะ'] }}</td>
                        </tr>


                        <tr>
                            <th v-if="store.data_report.type == 'noti'">ลำดับ</th>
                            <th v-if="store.data_report.type == 'noti'">ชื่อ-นามสกุลผู้ป่วย</th>
                            <th v-if="store.data_report.type == 'noti'">ชื่ออุปกรณ์/IPอุปกรณ์</th>
                            <th v-if="store.data_report.type == 'noti'">เวลาที่เกิดแจ้งเตือน</th>
                            <th v-if="store.data_report.type == 'noti'">สถานะการดำเนินการ</th>
                        </tr>
                        <tr v-show="store.data_report.type == 'noti'" v-for="item in store.data_report?.data" :key="item">
                            <td class="p-2 text-center">{{ item['ลำดับ'] }}</td>
                            <td class="p-2 text-center">{{ item['ชื่อ-นามสกุลผู้ป่วย'] }}</td>
                            <td class="p-2 text-center">{{ item['ชื่ออุปกรณ์/IPอุปกรณ์'] }}</td>
                            <td class="p-2 text-center">{{ item['เวลาที่เกิดแจ้งเตือน'] }}</td>
                            <td class="p-2 text-center">{{ item['สถานะการดำเนินการ'] }}</td>
                        </tr>

                        <tr>
                            <th v-if="store.data_report.type == 'user_admin'">ลำดับ</th>
                            <th v-if="store.data_report.type == 'user_admin'">ชื่อ-นามสกุล</th>
                            <th v-if="store.data_report.type == 'user_admin'">ตำแหน่ง</th>
                            <th v-if="store.data_report.type == 'user_admin'">ชื่อหน่วยงานที่สังกัด</th>
                            <th v-if="store.data_report.type == 'user_admin'">หน่วยงาน</th>
                        </tr>
                        <tr v-show="store.data_report.type == 'user_admin'" v-for="item in store.data_report?.data"
                            :key="item">
                            <td class="p-2 text-center">{{ item['ลำดับ'] }}</td>
                            <td class="p-2 text-center">{{ item['ชื่อ-นามสกุล'] }}</td>
                            <td class="p-2 text-center">{{ item['ตำแหน่ง'] }}</td>
                            <td class="p-2 text-center">{{ item['ชื่อหน่วยงานที่สังกัด'] }}</td>
                            <td class="p-2 text-center">{{ item['หน่วยงาน'] }}</td>
                        </tr>

                        <tr>
                            <th v-if="store.data_report.type == 'task'">ลำดับ</th>
                            <th v-if="store.data_report.type == 'task'">ชื่อผู้เปิด</th>
                            <th v-if="store.data_report.type == 'task'">ชื่อรับผิดชอบ</th>
                            <th v-if="store.data_report.type == 'task'">งานของหน่วยงาน</th>
                        <th v-if="store.data_report.type == 'task'">หน่วยงาน</th>
                        <th v-if="store.data_report.type == 'task'">วันที่เปิดงาน</th>
                        <th v-if="store.data_report.type == 'task'">กำหนดเสร็จ</th>
                        <th v-if="store.data_report.type == 'task'">สถานะงาน</th>
                    </tr>
                    <tr v-show="store.data_report.type == 'task'" v-for="item in store.data_report?.data" :key="item">
                        <td class="p-2 text-center">{{ item['ลำดับ'] }}</td>
                        <td class="p-2 text-center">{{ item['ชื่อผู้เปิด'] }}</td>
                        <td class="p-2 text-center">{{ item['ชื่อรับผิดชอบ'] }}</td>
                        <td class="p-2 text-center">{{ item['งานของหน่วยงาน'] }}</td>
                        <td class="p-2 text-center">{{ item['หน่วยงาน'] }}</td>
                        <td class="p-2 text-center">{{ item['วันที่เปิดงาน'] }}</td>
                        <td class="p-2 text-center">{{ item['กำหนดเสร็จ'] }}</td>
                        <td class="p-2 text-center">{{ item['สถานะงาน'] }}</td>
                    </tr>
                </tbody>
            </table>
            <!-- <DataTable :value="store.data_report?.data" showGridlines tableStyle="min-width: 50rem"
                    style="font-family: Kanit;">
                    <Column v-if="store.data_report.type == 'complain'" field="ลำดับ" header="ลำดับ"></Column>
                    <Column v-if="store.data_report.type == 'complain'" field="เรื่องร้องเรียน" header="เรื่องร้องเรียน">
                    </Column>
                    <Column v-if="store.data_report.type == 'complain'" field="ผู้แจ้ง" header="ผู้แจ้ง">
                    </Column>
                    <Column v-if="store.data_report.type == 'complain'" field="เวลาที่แจ้ง" header="เวลาที่แจ้ง">
                    </Column>
                    <Column v-if="store.data_report.type == 'complain'" field="ประเภทเรื่องร้องเรียน"
                        header="ประเภทเรื่องร้องเรียน"></Column>
                    <Column v-if="store.data_report.type == 'complain'" field="เบอร์โทรติดต่อกลับ"
                        header="เบอร์โทรติดต่อกลับ"></Column>
                    <Column v-if="store.data_report.type == 'complain'" field="สถานะ" header="สถานะ"></Column>

                    <Column v-if="store.data_report.type == 'noti'" field="ลำดับ" header="ลำดับ"></Column>
                    <Column v-if="store.data_report.type == 'noti'" field="ชื่อ-นามสกุลผู้ป่วย"
                        header="ชื่อ-นามสกุลผู้ป่วย"></Column>
                    <Column v-if="store.data_report.type == 'noti'" field="ชื่ออุปกรณ์/IPอุปกรณ์"
                        header="ชื่ออุปกรณ์/IPอุปกรณ์"></Column>
                    <Column v-if="store.data_report.type == 'noti'" field="เวลาที่เกิดแจ้งเตือน"
                        header="เวลาที่เกิดแจ้งเตือน"></Column>
                    <Column v-if="store.data_report.type == 'noti'" field="สถานะการดำเนินการ" header="สถานะการดำเนินการ">
                    </Column>

                    <Column v-if="store.data_report.type == 'user_admin'" field="ลำดับ" header="ลำดับ"></Column>
                    <Column v-if="store.data_report.type == 'user_admin'" field="ชื่อ-นามสกุล" header="ชื่อ-นามสกุล">
                    </Column>
                    <Column v-if="store.data_report.type == 'user_admin'" field="ตำแหน่ง" header="ตำแหน่ง"></Column>
                    <Column v-if="store.data_report.type == 'user_admin'" field="ชื่อหน่วยงานที่สังกัด"
                        header="ชื่อหน่วยงานที่สังกัด"></Column>
                    <Column v-if="store.data_report.type == 'user_admin'" field="หน่วยงาน" header="หน่วยงาน"></Column>

                        <Column v-if="store.data_report.type == 'task'" field="ลำดับ" header="ลำดับ" style="font-size: 14px;">
                        </Column>
                        <Column v-if="store.data_report.type == 'task'" field="ชื่อผู้เปิด" header="ชื่อผู้เปิด"
                            style="font-size: 14px;"></Column>
                        <Column v-if="store.data_report.type == 'task'" field="ชื่อรับผิดชอบ" header="ชื่อรับผิดชอบ"
                            style="font-size: 14px;"></Column>
                        <Column v-if="store.data_report.type == 'task'" field="งานของหน่วยงาน" header="งานของหน่วยงาน"
                            style="font-size: 14px;"></Column>
                        <Column v-if="store.data_report.type == 'task'" field="หน่วยงาน" header="หน่วยงาน"
                            style="font-size: 14px;"></Column>
                        <Column v-if="store.data_report.type == 'task'" field="วันที่เปิดงาน" header="วันที่เปิดงาน"
                            style="font-size: 14px;"></Column>
                        <Column v-if="store.data_report.type == 'task'" field="กำหนดเสร็จ" header="กำหนดเสร็จ"
                            style="font-size: 14px;"></Column>
                        <Column v-if="store.data_report.type == 'task'" field="สถานะงาน" header="สถานะงาน"
                            style="font-size: 14px;"></Column>
                    </DataTable> -->
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