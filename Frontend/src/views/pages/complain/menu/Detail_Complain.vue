<script setup>
import { ref, onMounted, onBeforeMount, onUpdated } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode } from 'primevue/api';
import Service from '../../../../service/api';
import { useStore } from '@/store';
const store = useStore();
const filters1 = ref(null);
const confirm = useConfirm();
const toast = useToast();
const complain = ref(null);
const service = new Service();
const dt = ref();
const cp_detail_after = ref();
const opendialog = ref(false);
const data_on_save = ref();
const exportCSV = () => {
    dt.value.exportCSV();
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
    }
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
const viewcomplain = async () => {

}
const editcomplain = async (data) => {
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
    if (data.cp_status == 2) {
        data_on_save.value = { ...data }
        return opendialog.value = true
    }
    const res = await service.post('/write/update_status_complain', { cp_id: data.cp_id, cp_status: data.cp_status == 1 ? 2 : 3, cp_detail_after: cp_detail_after.value });
    if (res.message == 'success') {
        get();
        toast.add({ severity: 'success', life: 2000 });
    }
}
const save = async (data) => {
    const res = await service.post('/write/update_status_complain', { cp_id: data.cp_id, cp_detail_after: cp_detail_after.value, cp_status: data.cp_status == 1 ? 2 : 3 });
    if (res.message == 'success') {
        get();
        toast.add({ severity: 'success', life: 2000 });
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
                        <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
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
                        <Button style="font-family: Kanit;" :label="data.cp_status == 1 ? 'รับงาน' : data.cp_status == 2 ?'ปิดงาน':'ดูรายละเอียด'"
                            :class="data.cp_status == 1 ? 'p-button-outlined p-button-secondary' : data.cp_status == 2 ? 'p-button-outlined p-button-success' : 'p-button-rounded p-button-help'"
                            @click="update_status_complain(data)" />
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
    </div>
</template>