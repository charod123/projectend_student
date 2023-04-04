<script setup>
import { ref, watch, onMounted, onBeforeMount, onUpdated } from 'vue';
import Service from '../../../../service/api';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode } from 'primevue/api';
import { useRouter } from 'vue-router';
import { useStore } from '../../../../store';
const store = useStore();
const toast = useToast();
const data_user = ref();
const router = useRouter();
const confirm = useConfirm();
const filters1 = ref(null);
const sigup_popup = ref(false);
const service = new Service();
const option_sundivision = ref();
const disabled_on_edit = ref(false);
const conut_user = ref();
const showreport = ref(false);
const otion_gender = ref([{ name: 'ชาย', value: 1 }, { name: 'หญิง', value: 2 }]);
const total_users = ref(0);
const subdivision = ref([])
const data_on_report = ref({
    select_type_report: '',
    select_type_complain: '',

})
const type = ref([])
const data = ref({
    emp_id: 0,
    user_id: 0,
    user_pro_id: 0,
    img_path: 'resources/assets/user-img',
    email: '',
    password: '',
    division: '',
    fristname: '',
    lastname: '',
    gender: '',
    phone: '',
    birthday: '',
    emp_name_position: '',
    subdivision_name: '',
    file: null,
    role_id: null,
});
const exportCSV = async () => {

    console.log(data_on_report.value);
    const res = await service.post('/read/get_user_admin_on_report', { subdivision_id_: data_on_report.value.select_type_complain });
    if (res.message == 'success') {
        const data_report = res.data.map((e, i) => {
            return {
                'ลำดับ': i + 1,
                'ชื่อ-นามสกุล': e.fristname + ' ' + e.lastname,
                'ตำแหน่ง': e.emp_name_position,
                'ชื่อหน่วยงานที่สังกัด': e.subdivision_name,
                'หน่วยงาน': e.division_name,
            }
        })
        store.data_report = { data: data_report, header: `รายงานข้อมูลพนักงาน${subdivision.value.filter(x => x.subdivision_id == data_on_report.value.select_type_complain)[0].subdivision_name}`, type: 'user_admin', name_excel: 'รายงานข้อมูลพนักงาน' }
        if (data_report.length > 0 && data_on_report.value.select_type_report == 2) {
            return router.push('/report_pdf')
        }
        if (data_report.length > 0 && data_on_report.value.select_type_report == 1) {
            return router.push('/report_export')
        }
        return toast.add({ severity: 'warn', summary: 'ไม่มีข้อมูลที่คุณเลือก', life: 2000 });
    }
};
const handleFileUpload = (event) => {
    data.value.file = event.files;
};

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
const onreport = async () => {

    subdivision.value = [...option_sundivision.value,
    {
        create_by: "sp_admin",
        create_date: "2023-03-26 00:44:12",
        del_flag: "1",
        division_id: 9.9,
        division_name: "ทั้งหมด",
        subdivision_id: 9.9,
        subdivision_name: "ทั้งหมด",
        update_date: "Invalid date",
    }]
    showreport.value = true;
}
const save = async () => {
    const res = await service.post('/write/insert_user_admin', { data: data.value });
    if (res.message == 'success') {
        if (data.value.file?.length > 0) {
            const formData = new FormData();
            formData.append('full_path', "resources/assets/user-img");
            formData.append('id', `user-${data.value.user_id}`);
            for (let i = 0; i < data.value.file.length; i++) {
                formData.append('file', data.value.file[i])
            }
            await service.post('/upload/upload-file-only', formData);
            sigup_popup.value = false
            get();
            return toast.add({ severity: 'success', summary: res.message, life: 3000 });
        }
        sigup_popup.value = false
        get();
        return toast.add({ severity: 'success', summary: res.message, life: 3000 });
    }
}
const edit_save = async (data_) => {
    const res = await service.post('/write/update_user_admin', { data: data_ });
    if (res.message == 'success') {
        if (data_.file?.length > 0) {
            const formData = new FormData();
            formData.append('full_path', "resources/assets/user-img");
            formData.append('id', `user-${data_.user_id}`);
            for (let i = 0; i < data_.file.length; i++) {
                formData.append('file', data_.file[i])
            }
            await service.post('/upload/upload-file-only', formData);
            sigup_popup.value = false
            get();
            return toast.add({ severity: 'success', summary: res.message, life: 3000 });
        }
        sigup_popup.value = false
        get();
        return toast.add({ severity: 'success', summary: res.message, life: 3000 });
    }
}

const get = async () => {
    const res = await service.post('/read/get_user_admin', {});
    if (res.message == 'success') {
        data_user.value = res.data
        console.log(data_user.value);
    }
    const res1 = await service.post('/read/get_subdivison', {});
    if (res1.message == 'success') {
        option_sundivision.value = res1.data
        console.log(option_sundivision.value);
    }
    const res2 = await service.post('/read/get_count_on_subdivision', {});
    if (res2.message == 'success') {
        conut_user.value = res2.data;
        total_users.value = res2.data[0].total_user
    }
}
const getmax_id = async () => {
    const res = await service.post('/get_id', { table: 'user_master', filed: 'user_id' });
    if (res.message == 'success') {
        data.value.user_id = res.data
    }
    const res1 = await service.post('/get_id', { table: 'user_profile', filed: 'user_pro_id' });
    if (res1.message == 'success') {
        data.value.user_pro_id = res1.data
    }
    const res2 = await service.post('/get_id', { table: 'employee', filed: 'emp_id' });
    if (res1.message == 'success') {
        data.value.emp_id = res2.data
    }
}
// const playSound = () => {
//     const audio = new Audio('http://localhost:3010/resources/assets/X2Download.app.mp3');
//     audio.play();
// }
const edit = (data_) => {
    data.value = {
        emp_id: data_.emp_id,
        user_id: data_.user_id,
        user_pro_id: data_.user_pro_id,
        img_path: data_.img_path,
        division: data_.division_id,
        fristname: data_.fristname,
        lastname: data_.lastname,
        gender: data_.gender,
        phone: data_.phone,
        birthday: data_.birthday,
        emp_name_position: data_.emp_name_position,
        subdivision_name: data_.subdivision_id
    }
    sigup_popup.value = true;
    disabled_on_edit.value = true;
}
const opencreate = (data_) => {
    data.value.img_path = 'resources/assets/user-img';
    data.value.email = '';
    data.value.password = '';
    data.value.division = '';
    data.value.fristname = '';
    data.value.lastname = '';
    data.value.gender = '';
    data.value.phone = '';
    data.value.birthday = '';
    data.value.emp_name_position = '';
    data.value.subdivision_name = '';
    data.value.file = null;
    data.value.division = data_[0]
    sigup_popup.value = true
    disabled_on_edit.value = false;
}
onMounted(() => {
    get();
    getmax_id();

})
const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
};
const confirm2 = (event, data) => {

    confirm.require({

        target: event.currentTarget,
        message: 'คุณต้องการลบข้อมูลนี้ใช่หรือไม่?',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: async () => {
            await service.post('/write/delete_user_admin', { user_id: data.user_id });
            data_user.value = data_user.value.filter(x => x.user_id != data.user_id)
            toast.add({ severity: 'success', summary: 'ลบข้อมูลสำเร็จ', life: 2000 });
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'ยกเลิก', life: 2000 });
        }
    });
}
onBeforeMount(() => {
    initFilters1();
});
</script>
<template>
    <div>
        <div class="grid m-2">
            <div :class="`col-12 lg:col-12 xl:col-12`">
                <div class="card mb-0">
                    <div class="flex justify-content-between mb-3">
                        <div class="grid" style="width: 100%;">
                            <div class="col-6 mb-2 lg:col-2 md:col-4 sm:col-6 lg:mb-0">
                                <span class="block text-500 text-2xl font-medium mb-3">พนักงานทั้งหมด</span>
                                <div class="text-900 font-medium text-2xl text-xl">{{ total_users }}</div>
                            </div>
                            <div class="col-6 mb-2 lg:col-2 md:col-4 sm:col-6 lg:mb-0" v-for="item in conut_user"
                                :key="item">
                                <span class="block text-500 text-2xl font-medium mb-3">{{ item.subdivision.subdivision_name
                                }}/คน</span>
                                <div class="text-900 font-medium text-2xl text-xl">{{ item.user_conut }}</div>
                            </div>


                        </div>
                        <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
                            style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-user text-blue-500 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <DataTable :value="data_user" :paginator="true" class="p-datatable-gridlines text-xl" ref="dt" dataKey="user_id"
            :rowHover="true" v-model:filters="filters1" filterDisplay="menu" :loading="loading1" style="font-family:Kanit"
            :filters="filters1" responsiveLayout="scroll"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]" :rows="5"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
            :globalFilterFields="['user_id', 'fristname', 'lastname', 'birthday', 'phone', 'emp_name_position', 'subdivision_name']">
            <template #header>
                <div class="flex justify-content-between flex-column sm:flex-row gap-2">
                    <span class="p-input-icon-left mb-2">
                        <i class="pi pi-search" />
                        <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 30%" />
                    </span>
                    <div>
                        <Button style="font-family: Kanit;" class="w-10rem p-button-success" icon="pi pi-plus"
                            label="เพิ่มพนักงาน" @click="opencreate(option_sundivision)" />

                    </div>
                    <div>
                        <Button style="font-family: Kanit;" icon="pi pi-external-link" label="ออกรายงาน" class="w-10rem"
                            @click="onreport" />
                    </div>
                </div>
            </template>
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <template #paginatorstart>
                <Button type="button" icon="pi pi-refresh" class="p-button-text" @click="get()" />
            </template>
            <template #paginatorend>
                <Button type="button" icon="pi pi-cloud" class="p-button-text" />
            </template>
            <Column field="user_id" header="#" style="min-width: 2rem" :sortable="true">
                <template #body="{ data }">
                    {{ data.user_id }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                        placeholder="Search by name" />
                </template>
            </Column>
            <Column header="รูปประจำตัว" style="min-width: 10rem">
                <template #body="{ data }">
                    <Image :src="`${data.img_path}`" :alt="data.img_path" class="shadow-2" width="100" preview />
                </template>
            </Column>
            <Column field="fristname" header="ชื่อจริง-นามสกุล" style="min-width: 12rem" :sortable="true">
                <template #body="{ data }">
                    {{ data.fristname + " " + data.lastname }}
                </template>
            </Column>
            <Column field="gender" header="เพศ" style="min-width: 5rem" :sortable="true">
                <template #body="{ data }">
                    {{ data.gender }}
                </template>
            </Column>
            <Column field="create_date" header="วันที่เพิ่มข้อมูล" style="min-width:15rem" :sortable="true">
                <template #body="{ data }">
                    {{ data.create_date }}
                </template>
            </Column>
            <Column field="birthday" header="อายุ" style="min-width: 5rem" :sortable="true">
                <template #body="{ data }">
                    {{ $moment().format("YYYY") - $moment(data.birthday).format("YYYY") }}
                </template>
            </Column>
            <Column field="emp_name_position" header="ตำแหน่ง" style="min-width: 12rem" :sortable="true">
                <template #body="{ data }">
                    {{ data.emp_name_position }}
                </template>
            </Column>
            <Column field="subdivision_name" header="หน่วยงานที่สังกัด" style="min-width: 12rem" :sortable="true">
                <template #body="{ data }">
                    {{ data.subdivision_name }}
                </template>
            </Column>
            <Column field="phone" header="เบอร์โทร" style="min-width: 12rem" :sortable="true">
                <template #body="{ data }">
                    {{ data.phone }}
                </template>
            </Column>
            <Column style="min-width: 12rem">
                <template #body="{ data }">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning mr-2 mb-2" @click="edit(data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger mr-2 mb-2"
                        @click="confirm2($event, data)" />
                </template>
            </Column>
        </DataTable>
        <ConfirmPopup></ConfirmPopup>

        <Dialog style="font-family: Kanit;" :header="`${disabled_on_edit ? 'แก้ไขพนักงาน' : 'เพิ่มพนักงาน'}`"
            v-model:visible="sigup_popup" :breakpoints="{ '960px': '75vw' }" :style="{ width: '40vw' }" :modal="true">
            <div>
                <div class="grid p-fluid">
                    <div class="field col-12 md:col-6">
                        <label class="text-base" for="integeronly">หน่วยงาน</label>
                        <InputText v-model="data.division.division_name" placeholder="หน่วยงาน" disabled />
                    </div>

                    <div class="field col-12 md:col-6">
                        <label class="text-base" for="integeronly"><label
                                class="text-red-500">*</label>หน่วยงานที่สังกัด</label>
                        <Dropdown v-model="data.subdivision_name" :options="option_sundivision"
                            optionLabel="subdivision_name" optionValue="subdivision_id" placeholder="หน่วยงานที่สังกัด" />
                    </div>
                    <div class="col-12 md:col-6" v-if="!disabled_on_edit">
                        <label class="text-base" for="integeronly"><label class="text-red-500">*</label>อีเมล</label>
                        <InputText v-model="data.email" placeholder="*อีเมล" />
                    </div>

                    <div class="col-12 md:col-6" v-if="!disabled_on_edit">
                        <label class="text-base" for="integeronly"><label class="text-red-500">*</label>รหัสผ่าน</label>
                        <Password placeholder="*รหัสผ่าน" mediumRegex :toggleMask="true" inputClass="w-full"
                            v-model="data.password">
                            <template #header>
                                <h6>Pick a password</h6>
                            </template>
                            <template #footer>
                                <Divider />
                                <p class="mt-2">Suggestions</p>
                                <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                                </ul>
                            </template>
                        </Password>
                    </div>

                    <Divider />
                    <h4 class="ml-4">รายละเอียด</h4>
                    <div class="grid p-3">
                        <div class="col-12 md:col-6">
                            <label class="text-base" for="integeronly"><label class="text-red-500">*</label>ชื่อจริง</label>
                            <InputText v-model="data.fristname" placeholder="*ชื่อจริง" />
                        </div>
                        <div class="col-12 md:col-6">
                            <label class="text-base" for="integeronly"><label class="text-red-500">*</label>นามสกุล</label>
                            <InputText v-model="data.lastname" placeholder="*นามสกุล" />
                        </div>
                        <div class="col-12 md:col-6">
                            <label class="text-base" for="integeronly"><label
                                    class="text-red-500">*</label>วัน/เดือน/ปีเกิด</label>
                            <Calendar v-model="data.birthday" dateFormat="dd/mm/yy" />
                        </div>
                        <div class="col-12 md:col-6">
                            <label class="text-base" for="integeronly"><label class="text-red-500">*</label>เพศ</label>
                            <Dropdown id="state" v-model="data.gender" :options="otion_gender" optionLabel="name"
                                optionValue="name" placeholder="*เพศ">
                            </Dropdown>
                        </div>
                        <div class="col-12 md:col-6">
                            <label class="text-base" for="integeronly"><label class="text-red-500">*</label>เบอร์โทร</label>
                            <InputMask id="ssn" mask="999-999-9999" v-model="data.phone" placeholder="000-000-0000" />
                        </div>
                        <div class="col-12 md:col-6">
                            <label class="text-base" for="integeronly"><label
                                    class="text-red-500">*</label>ตำแหน่งในสังกัด</label>
                            <InputText v-model="data.emp_name_position" placeholder="ชื่อตำแหน่ง" />
                        </div>
                        <div class="col-12 md:col-6" v-if="disabled_on_edit">
                            <Image :src="data.img_path" alt="Image" width="250" preview />
                        </div>
                        <div class="col-12 md:col-6">
                            <FileUpload :customUpload="true" mode="basic" @select="handleFileUpload" name="demo[]"
                                chooseLabel="อัปโหลด" :showUploadButton="true" :accept="'image/*'">
                            </FileUpload>

                        </div>
                    </div>


                </div>


            </div>
            <template #footer>
                <Button label="บันทึก" @click="disabled_on_edit ? edit_save(data) : save(data)" icon="pi pi-check"
                    class="p-button-outlined" />
            </template>
        </Dialog>
        <Dialog header="เลือกรูปแบบรายงาน" v-model:visible="showreport" :breakpoints="{ '1080px': '75vw' }"
            :style="{ width: '45vw' }" :modal="true" style="font-family:Kanit">
            <div class="grid p-fluid">
                <div class="col-12 md:col-12">
                    <h5>เลือกหน่วยงานที่ต้องการข้อมูลพนักงาน</h5>
                    <Dropdown v-model="data_on_report.select_type_complain" :options="subdivision"
                        optionLabel="subdivision_name" optionValue="subdivision_id" placeholder="เลือกหน่วยงาน" />
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
    </div>
</template>
