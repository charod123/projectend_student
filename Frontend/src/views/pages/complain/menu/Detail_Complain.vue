<script setup>
import { ref, onMounted, onBeforeMount, onUpdated } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode } from 'primevue/api';
import Service from '../../../../service/api';
import { useStore } from '../../../../store';
import { useRouter } from 'vue-router';
const store = useStore();
const filters1 = ref(null);
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();
const complain = ref(null);
const service = new Service();
const dt = ref();
const cp_detail_after = ref();
const opendialog = ref(false);
const data_on_save = ref();
const showreport = ref(false);
const showdailog_detail_complain = ref(false);
const data_on_report = ref({
    select_type_report: '',
    select_type_complain: '',

}
)
const data_create_complain = ref()
const exportCSV = async () => {

    console.log(data_on_report.value);
    const res = await service.post('/read/get_on_report', { select_type_complain: data_on_report.value.select_type_complain });
    if (res.message == 'success') {
        const data_report = res.data.map((e, i) => {
            return {
                'ลำดับ': i + 1,
                'เรื่องร้องเรียน': e.cp_title,
                'ประเภทเรื่องร้องเรียน': e.cp_type,
                'เบอร์โทรติดต่อกลับ': e.cp_tel,
                'สถานะ': e.cp_status == 1 ? 'แจ้งเรื่อง' : e.cp_status == 2 ? 'กำลังดำเนินการ' : e.cp_status == 3 ? 'ปิดงาน' : 'ยกเลิก',
            }
        })
        store.data_report = { data: data_report, header: 'รายงานการแจ้งเรื่องร้องเรียน' }
        if (data_report.length > 0 && data_on_report.value.select_type_report == 2) {
            return router.push('/report_pdf')
        }
        if (data_report.length > 0 && data_on_report.value.select_type_report == 1) {
            return router.push('/report_export')
        }
        return toast.add({ severity: 'warn', summary: 'ไม่มีข้อมูลที่คุณเลือก', life: 2000 });
    }
};

const tinymceSettings = {
    menubar: true,
    // toolbar: true,
    selector: 'textarea',
    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss',
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Author name',
    mergetags_list: [
        { value: 'First.Name', title: 'First Name' },
        { value: 'Email', title: 'Email' },
    ]
}
const type = ref([
    {
        complain_type_id: 1,
        complain_type_name: 'แจ้งปัญหาการใช้งานระบบ'
    },
    {
        complain_type_id: 2,
        complain_type_name: 'แจ้งปัญหาอุปกรณ์'
    },
    {
        complain_type_id: 3,
        complain_type_name: 'อื่นๆ'
    },
    {
        complain_type_id: 4,
        complain_type_name: 'ทั้งหมด'
    }
]
)

const type_report = ref([
    {
        report_type_id: 1,
        report_type_name: 'excel'
    },
    {
        report_type_id: 2,
        report_type_name: 'print pdf'
    },

]
)
store.$subscribe((mutation) => {
    console.log('Global state changed', store.data);
    if (store.data[0]?.cp_id) {
        complain.value = store.data;
        complain.value.map((e) => {
            e.cp_type_name = type.value.filter(e_ => e_.complain_type_id == e.cp_type_id)[0].complain_type_name;
            return e
        })
    }
    console.log('Global state changed', mutation);
});
const get = async () => {
    const res = await service.post('read/get-complain', {});
    if (res.message == 'success') {
        complain.value = await res.data.map((e) => {
            e.cp_type_name = type.value.filter(e_ => e_.complain_type_id == e.cp_type_id)[0].complain_type_name;
            return e
        })
    }
}
onUpdated(() => {
    console.log(store.data);

})
onMounted(async () => {
    await get();
})
onBeforeMount(() => {
    initFilters1();
});
const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        cp_title: { value: null, matchMode: FilterMatchMode.EQUALS },
        cp_id: { value: null },
        cp_tel: { value: null },
        cp_status: { value: null },
    };
};
const viewcomplain = async (data) => {
    data_create_complain.value = data;
    showdailog_detail_complain.value = true;
}
const editcomplain = async (data) => {
    store.data = null;
    store.setAddData(data)
    store.opendialog = !store.opendialog
}
const deletecomplain = async (data) => {
    console.log(data);
    const res = await store.delete('/write/delete_complain', { cp_id: data.cp_id });
    if (!res.code) {
        complain.value = complain.value.filter(x => x.cp_id != data.cp_id)
    }

}
const confirm2 = (event, data) => {
    console.log(event);
    confirm.require({
        target: event.currentTarget,
        message: 'คุณต้องการลบข้อมูลนี้ใช่หรือไม่?',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: async () => {
            await deletecomplain(data);
            toast.add({ severity: 'success', summary: 'ลบข้อมูลสำเร็จ', life: 2000 });
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'ยกเลิก', life: 2000 });
        }
    });
}
const update_status_complain = async (data) => {
    console.log(data);
    if (data.cp_status == 2) {
        data_on_save.value = { ...data }
        return opendialog.value = true
    }
    if (data.cp_status == 3) {
        data_create_complain.value = data;
        showdailog_detail_complain.value = true;
    }
    if (data.cp_status == 1) {
        const res = await service.post('/write/update_status_complain', { cp_id: data.cp_id, cp_status: data.cp_status == 1 ? 2 : 3, cp_detail_after: cp_detail_after.value });
        if (res.message == 'success') {
            get();
            toast.add({ severity: 'success', life: 2000 });
        }
    }

}
const save = async (data) => {
    const res = await service.post('/write/update_status_complain', { cp_id: data.cp_id, cp_detail_after: cp_detail_after.value, cp_status: data.cp_status == 1 ? 2 : 3 });
    if (res.message == 'success') {
        get();
        toast.add({ severity: 'success', life: 2000 });
        opendialog.value = false;
    }
}
</script>
<template>
    <div class="card">
        <DataTable :value="complain" :paginator="true" class="p-datatable-gridlines text-xl" :rows="10" dataKey="cp_id"
            ref="dt" :rowHover="true" v-model:filters="filters1" sortMode="single" sortField="cp_id" :sortOrder="1"
            filterDisplay="menu" :loading="loading1" :filters="filters1" responsiveLayout="scroll"
            :globalFilterFields="['cp_id', 'cp_title', 'cp_tel', 'cp_status']" style="font-family:Kanit">
            <template #header>
                <div class="flex justify-content-between flex-column sm:flex-row">
                    <span class="p-input-icon-left mb-2">
                        <i class="pi pi-search" />
                        <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" />
                    </span>
                    <div>
                        <Button style="font-family: Kanit;" icon="pi pi-external-link" label="ออกรายงาน"
                            @click="showreport = true;" />
                    </div>
                </div>
            </template>
            <template #paginatorstart>
                <Button type="button" icon="pi pi-refresh" class="p-button-text" @click="get()" />
            </template>
            <template #paginatorend>
                <Button type="button" icon="pi pi-cloud" class="p-button-text" />
            </template>
            <template #empty> ไม่มีข้อมูล</template>
            <template #loading> Loading customers data. Please wait. </template>
            <Column field="cp_id" header="#" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.cp_id }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by id" />
                </template>
            </Column>

            <Column field="cp_title" header="เรื่องร้องเรียน" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.cp_title }}

                </template>
                <template #filter="{ filterModel }">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                        placeholder="Search by name" />
                </template>
            </Column>
            <Column field="cp_create_date" header="วัน-เวลา ที่แจ้ง" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.cp_create_date }}

                </template>
                <template #filter="{ filterModel }">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                        placeholder="Search by name" />
                </template>
            </Column>
            <Column field="cp_type_name" header="ประเภทการร้องเรียน" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.cp_type_name }}

                </template>
                <template #filter="{ filterModel }">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                        placeholder="Search by name" />
                </template>
            </Column>
            <Column field="cp_status" header="สถานะการดำเนินการ" style="min-width: 12rem">
                <template #body="{ data }">
                    <span
                        :class="`customer-badge status-${data.cp_status == 1 ? 'new' : data.cp_status == 2 ? 'proposal' : 'qualified'}`">{{
                            data.cp_status
                            == 1 ? 'สถานะ: ยังไม่มีการดำเนินการ' : data.cp_status == 2 ? 'สถานะ: อยู่ระหว่างดำเนินการ' :
                            'สถานะ:ดำเนินการเสร็จสิ้น' }}</span>
                </template>
                <template #filter="{ filterModel }">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                        placeholder="Search by name" />
                </template>
            </Column>
            <Column field="" header="" style="min-width: 12rem;text-align: center">

                <template #body="{ data }">
                    <div v-if="store.role == 3">
                        <Button icon="pi pi-search" class="p-button-rounded p-button-info mr-2 mb-2"
                            @click="viewcomplain(data)" />
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning mr-2 mb-2"
                            @click="editcomplain(data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger mr-2 mb-2"
                            @click="confirm2($event, data)" />
                    </div>
                    <div v-if="store.role == 1 || store.role == 2">
                        <Button style="font-family: Kanit;"
                            :label="data.cp_status == 1 ? 'รับงาน' : data.cp_status == 2 ? 'ปิดงาน' : 'ดูรายละเอียด'"
                            :class="data.cp_status == 1 ? 'p-button-outlined p-button-secondary' : data.cp_status == 2 ? 'p-button-outlined p-button-success' : 'p-button-rounded p-button-help'"
                            @click="update_status_complain(data)" />
                        <Button v-if="data.cp_status == 1 || data.cp_status == 2" style="font-family: Kanit;"
                            label="ดูรายละเอียด" :class="'p-button-outlined p-button-secondary ml-2'"
                            @click="viewcomplain(data)" />
                    </div>
                </template>
            </Column>

        </DataTable>
        <ConfirmPopup></ConfirmPopup>
        <Dialog header="ปิดงาน" v-model:visible="opendialog" :breakpoints="{ '1080px': '75vw' }" :style="{ width: '45vw' }"
            :modal="true" style="font-family:Kanit">
            <div class="grid p-fluid">
                <div class="col-12 md:col-12">
                    <h5>รายละเอียดการดำเนินการ</h5>
                    <Editor v-model="cp_detail_after" :style="{ height: '100vh' }" :init="tinymceSettings">
                        <template #toolbar>
                            <span class="ql-formats">
                                <button class="ql-bold"></button>
                                <button class="ql-italic"></button>
                                <button class="ql-underline"></button>
                            </span>
                        </template>
                    </Editor>
                </div>
            </div>
            <template #footer>
                <Button label="บันทึก" @click="save(data_on_save)" icon="pi pi-check" class="p-button-outlined" />
            </template>
        </Dialog>
        <Dialog header="เลือกรูปแบบรายงาน" v-model:visible="showreport" :breakpoints="{ '1080px': '75vw' }"
            :style="{ width: '45vw' }" :modal="true" style="font-family:Kanit">
            <div class="grid p-fluid">
                <div class="col-12 md:col-12">
                    <h5>เลือกประเภทร้องเรียน</h5>
                    <Dropdown v-model="data_on_report.select_type_complain" :options="type" optionLabel="complain_type_name"
                        optionValue="complain_type_id" placeholder="เลือกประเภทร้องเรียน" />
                </div>
                <div class="col-12 md:col-12">
                    <h5>เลือกประเภทรายงาน</h5>
                    <Dropdown v-model="data_on_report.select_type_report" :options="type_report"
                        optionLabel="report_type_name" optionValue="report_type_id" placeholder="เลือกประเภทรายงาน" />
                </div>
            </div>
            <template #footer>
                <Button label="ยืนยัน" @click="exportCSV()" icon="pi pi-check" class="p-button-outlined" />
            </template>
        </Dialog>
        <!-- dรายละเอียดร้องเรียน -->
        <Dialog :header="`รายละเอียดเรื่องร้องเรียน`" v-model:visible="showdailog_detail_complain"
            :breakpoints="{ '1080px': '75vw' }" :style="{ width: '70vw' }" :modal="true" style="font-family:Kanit">
            <div class="grid p-fluid">
                <div class="col-12 md:col-12">
                    <h5>ประเภทเรื่องร้องเรียน</h5>
                    <div class="grid formgrid">
                        <div class="col-12 mb-2 lg:col-12 lg:mb-0">
                            <Dropdown v-model="data_create_complain.cp_type_id" :options="type"
                                optionLabel="complain_type_name" optionValue="complain_type_id" placeholder="เลือกประเภท" />
                        </div>
                    </div>
                    <h5>หัวข้อเรื่องร้องเรียน</h5>
                    <div class="grid formgrid">
                        <div class="col-12 mb-2 lg:col-12 lg:mb-0">
                            <InputText type="text" placeholder="กรอกข้อมูล" v-model="data_create_complain.cp_title" />
                        </div>
                    </div>
                    <div v-if="data_create_complain.cp_type_id == 2">

                        <h5>ชื่อผู้ป่วย</h5>
                        <div class="grid formgrid">
                            <div class="col-12 mb-2 lg:col-12 lg:mb-0">
                                <InputText type="number" placeholder="กรอกข้อมูล"
                                    v-model="data_create_complain.full_name" />
                            </div>
                        </div>
                        <h5>ip อุปการณ์</h5>
                        <div class="grid formgrid">
                            <div class="col-12 mb-2 lg:col-12 lg:mb-0">
                                <InputText type="number" placeholder="กรอกข้อมูล"
                                    v-model="data_create_complain.device_ip" />
                            </div>
                        </div>
                    </div>

                    <h5>เบอร์โทรสำหรับติดต่อกลับ</h5>
                    <div class="grid formgrid">
                        <div class="col-12 mb-2 lg:col-12 lg:mb-0">
                            <InputText type="number" placeholder="กรอกข้อมูล" v-model="data_create_complain.cp_tel">
                            </InputText>
                        </div>
                    </div>
                    <h5>รูปเพิ่มเติม</h5>

                    <Image :src="data_create_complain.img_path"></Image>

                    <div class="grid mt-2" v-if="store.data">
                        <div class="col-12 mb-2 lg:col-3 lg:mb-0" v-for="item in img" :key="item">
                            <Image :src="item" alt="Image Text" width="220" preview />
                        </div>
                    </div>
                    <h5>รายละเอียดเรื่องที่แจ้ง</h5>
                    <div v-html="data_create_complain.cp_detail" style="width: 50%;"></div>
                    <h5 v-if="data_create_complain.cp_status == 3">รายละเอียดการดำเนินการ</h5>
                    <div v-if="data_create_complain.cp_status == 3" v-html="data_create_complain.cp_detail_after"
                        style="width: 50%;"></div>

                </div>
            </div>
            <template #footer>

            </template>
        </Dialog>
        <!-- dรายละเอียดร้องเรียน -->

    </div>
</template>