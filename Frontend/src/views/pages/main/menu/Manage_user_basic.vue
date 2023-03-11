<script setup>
import { ref, watch, onMounted, onBeforeMount, onUpdated } from 'vue';
import Service from '../../../../service/api';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode } from 'primevue/api';
const toast = useToast();
const data_user = ref();
const confirm = useConfirm();
const filters1 = ref(null);
const sigup_popup = ref(false);
const service = new Service();
const option_sundivision = ref();
const disabled_on_edit = ref(false);
const conut_user = ref();
const otion_gender = ref([{ name: 'ชาย', value: 1 }, { name: 'หญิง', value: 2 }]);
const total_users = ref(0);
const expandedRows = ref([]);

const onRowExpand = (event) => {
    toast.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
};
const onRowCollapse = (event) => {
    toast.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
};
const expandAll = () => {
    expandedRows.value = data_user.value.filter(p => p.user_id);
    toast.add({ severity: 'success', summary: 'All Rows Expanded', life: 3000 });
};
const collapseAll = () => {
    expandedRows.value = null;
    toast.add({ severity: 'success', summary: 'All Rows Collapsed', life: 3000 });
};

const data = ref({
    user_id: 0,
    user_pro_id: 0,
    img_path: 'resources/assets/user-img',
    email: '',
    password: '',
    fristname: '',
    lastname: '',
    gender: '',
    phone: '',
    birthday: '',
    province_id: 0,
    subdistrict_id: 0,
    district_id: 0,
    file: null,
    role_id: null,
});
const handleFileUpload = (event) => {
    data.value.file = event.files;
};
const save = async () => {
    const res = await service.post('/register', {
        user_pro_id: data.value.user_pro_id,
        user_id: data.value.user_id,
        email: data.value.email,
        password: data.value.password,
        img_path: data.value.img_path,
        fristname: data.value.fristname,
        lastname: data.value.lastname,
        birthday: data.value.birthday,
        gender: data.value.gender,
        phone: data.value.phone,
        role_id: data.value.role_id,
        district_id: data.value.district_id,
        province_id: data.value.province_id,
        subdistrict_id: data.value.subdistrict_id
    });
    if (res.message == 'success') {
        debugger

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
    const res = await service.post('/write/update_user', { data: data_ });
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
    return toast.add({ severity: 'warn', summary: res.message, life: 3000 });

}

const get = async () => {
    const res = await service.post('/read/get_clint', {});
    if (res.message == 'success') {
        data_user.value = res.data
        console.log(data_user.value);
    }
    const res1 = await service.post('/read/get_divison', {});
    if (res1.message == 'success') {
        option_sundivision.value = res1.data
        console.log(option_sundivision.value);
    }
    const res2 = await service.post('/read/get_count_user_devive', { subdistrict_id: option_sundivision.value[0].subdistrict_id });
    if (res2.message == 'success') {
        conut_user.value = res2.data[0];
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
        console.log(data.value);
    }

}

const edit = (data_) => {
    data.value = {
        emp_id: data_.emp_id,
        user_id: data_.user_id,
        user_pro_id: data_.user_pro_id,
        img_path: data_.img_path,
        fristname: data_.fristname,
        lastname: data_.lastname,
        gender: data_.gender,
        phone: data_.phone,
        birthday: data_.birthday,
    }
    sigup_popup.value = true;
    disabled_on_edit.value = true;
}
const opencreate = (data_) => {
    data.value.img_path = 'resources/assets/user-img';
    data.value.email = '';
    data.value.password = '';
    data.value.fristname = '';
    data.value.lastname = '';
    data.value.gender = '';
    data.value.phone = '';
    data.value.birthday = '';
    data.value.province_id = option_sundivision.value[0]?.province_id;
    data.value.subdistrict_id = option_sundivision.value[0]?.subdistrict_id;
    data.value.district_id = option_sundivision.value[0]?.district_id;
    data.value.file = null;
    data.value.role_id = 3;
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
            const res = await service.post('/write/delete_user_admin', { user_id: data.user_id });
            if (res.message == 'success') {
                data_user.value = data_user.value.filter(x => x.user_id != data.user_id)
                return toast.add({ severity: 'success', summary: 'ลบข้อมูลสำเร็จ', life: 2000 });
            }
            return toast.add({ severity: 'warn', summary: res.message, life: 2000 });

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

        <div class="surface-ground px-4 py-5 md:px-4 lg:px-6">
            <div class="grid">
                <div class="col-12 md:col-6 lg:col-4">
                    <div class="surface-card shadow-2 p-3 border-round">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <span class="block text-500 font-medium mb-3">จำนวนผู้ใช้งาน</span>
                                <div class="text-900 font-medium text-xl">{{ conut_user?.count_user }}</div>
                            </div>
                            <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
                                style="width:2.5rem;height:2.5rem">
                                <i class="pi pi-user text-blue-500 text-xl"></i>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="col-12 md:col-6 lg:col-4">
                    <div class="surface-card shadow-2 p-3 border-round">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <span class="block text-500 font-medium mb-3">จำนวนผู้สูงอายุหรือผู้ป่วยติดเตียง</span>
                                <div class="text-900 font-medium text-xl">{{ conut_user?.count_pat }}</div>
                            </div>
                            <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
                                style="width:2.5rem;height:2.5rem">
                                <i class="pi pi-user text-blue-500 text-xl"></i>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="col-12 md:col-6 lg:col-4">
                    <div class="surface-card shadow-2 p-3 border-round">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <span class="block text-500 font-medium mb-3">จำนวนอุปกรณ์</span>
                                <div class="text-900 font-medium text-xl">{{ conut_user?.count_device }}</div>
                            </div>
                            <div class="flex align-items-center justify-content-center bg-orange-100 border-round"
                                style="width:2.5rem;height:2.5rem">
                                <i class="pi pi-inbox text-orange-500 text-xl"></i>
                            </div>
                        </div>

                    </div>
                </div>
                <!-- <div class="col-12 md:col-6 lg:col-3">
                                                                                                                                                            <div class="surface-card shadow-2 p-3 border-round">
                                                                                                                                                                <div class="flex justify-content-between mb-3">
                                                                                                                                                                    <div>
                                                                                                                                                                        <span class="block text-500 font-medium mb-3">Customers</span>
                                                                                                                                                                        <div class="text-900 font-medium text-xl">28441</div>
                                                                                                                                                                    </div>
                                                                                                                                                                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round"
                                                                                                                                                                        style="width:2.5rem;height:2.5rem">
                                                                                                                                                                        <i class="pi pi-inbox text-cyan-500 text-xl"></i>
                                                                                                                                                                    </div>
                                                                                                                                                                </div>
                                                                                                                                                                <span class="text-green-500 font-medium">520 </span>
                                                                                                                                                                <span class="text-500">newly registered</span>
                                                                                                                                                            </div>
                                                                                                                                                        </div>
                                                                                                                                                        <div class="col-12 md:col-6 lg:col-3">
                                                                                                                                                            <div class="surface-card shadow-2 p-3 border-round">
                                                                                                                                                                <div class="flex justify-content-between mb-3">
                                                                                                                                                                    <div>
                                                                                                                                                                        <span class="block text-500 font-medium mb-3">Comments</span>
                                                                                                                                                                        <div class="text-900 font-medium text-xl">152 Unread</div>
                                                                                                                                                                    </div>
                                                                                                                                                                    <div class="flex align-items-center justify-content-center bg-purple-100 border-round"
                                                                                                                                                                        style="width:2.5rem;height:2.5rem">
                                                                                                                                                                        <i class="pi pi-comment text-purple-500 text-xl"></i>
                                                                                                                                                                    </div>
                                                                                                                                                                </div>
                                                                                                                                                                <span class="text-green-500 font-medium">85 </span>
                                                                                                                                                                <span class="text-500">responded</span>
                                                                                                                                                            </div>
                                                                                                                                                        </div> -->
            </div>
        </div>
        <DataTable :value="data_user" v-model:expandedRows="expandedRows" dataKey="id" @rowExpand="onRowExpand" style="font-family: Kanit;"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll"
            :paginator="true" :rows="10" @rowCollapse="onRowCollapse">
            <template #header>
                <div class="table-header-container flex justify-content-between">
                    <div>
                        <Button icon="pi pi-plus" label="Expand All" @click="expandAll" class="mr-2 w-10rem" />
                        <Button icon="pi pi-minus" label="Collapse All" @click="collapseAll" class="w-10rem" />
                    </div>
                    <div>
                        <Button style="font-family: Kanit;" class="w-10rem p-button-success" icon="pi pi-plus"
                            label="เพิ่มผู้ใช้งาน" @click="opencreate(option_sundivision)" />
                    </div>
                </div>
            </template>
            <template #empty> ไม่มีข้อมูล</template>
            <template #loading> Loading customers data. Please wait. </template>
            <template #paginatorstart>
                <Button type="button" icon="pi pi-refresh" class="p-button-text" @click="get()" />
            </template>
            <template #paginatorend>
                <Button type="button" icon="pi pi-cloud" class="p-button-text" />
            </template>
            <Column :expander="true" headerStyle="width: 3rem" />
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
            <Column field="update_date" header="แก้ไขล่าสุด" style="min-width:15rem" :sortable="true">
                <template #body="{ data }">
                    {{ data.update_date }}
                </template>
            </Column>
            <Column field="birthday" header="อายุ" style="min-width: 5rem" :sortable="true">
                <template #body="{ data }">
                    {{ $moment().format("YYYY") - $moment(data.birthday).format("YYYY") }}
                </template>
            </Column>

            <Column field="phone" header="เบอร์โทร" style="min-width: 12rem" :sortable="true">
                <template #body="{ data }">
                    {{ data.phone }}
                </template>
            </Column>
            <Column style="min-width: 5rem">
                <template #body="{ data }">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning mr-2 mb-2" @click="edit(data)" />
                    <!-- <Button icon="pi pi-trash" class="p-button-rounded p-button-danger mr-2 mb-2"
                                        @click="confirm2($event, data)" /> -->
                </template>
            </Column>

            <template #expansion="{ data }">
                <div class="orders-subtable bg-blue-100">
                    <DataTable :value="data.pat" responsiveLayout="scroll" v-model:filters="filters1" :filters="filters1"  
                        :globalFilterFields="['pat_id', 'fristname', 'lastname', 'gender', 'device.device_name', 'device.device_ip']"
                         :paginator="true" :rows="10">
                        <template #header>
                            <div class="flex justify-content-between ">
                                <div>
                                </div>
                                <div>
                                    <span class="p-input-icon-left mb-2">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters1['global'].value" placeholder="Keyword Search"
                                            style="width: auto;" />
                                    </span>
                                </div>

                            </div>
                        </template>
                        <template #empty> ไม่มีข้อมูล</template>
                        <template #loading> Loading customers data. Please wait. </template>
                        <Column field="pat_id" header="#" sortable></Column>
                        <Column header="รูปประจำตัว">
                            <template #body="{ data }">
                                <Image :src="`${data.img_path}`" :alt="data.img_path" class="shadow-2" width="100"
                                    preview />
                            </template>
                        </Column>
                        <Column field="fristname" header="ชื่อจริง" sortable></Column>
                        <Column field="lastname" header="นามสกุล" sortable></Column>
                        <Column field="gender" header="เพศ" sortable></Column>
                        <Column field="pat_height" header="น้ำหนัก/ส่วนสูง" sortable>
                            <template #body="{ data }">
                                {{ data.pat_weight }} / {{ data.pat_height }}
                            </template>
                        </Column>
                        <Column field="birthday" header="อายุ/วันเดือนปีเกิด" sortable>
                            <template #body="{ data }">
                                {{ $moment().format("YYYY") - $moment(data.birthday).format("YYYY") }} / {{
                                    $moment(data.birthday).format("DD/MM/YYYY") }}
                            </template>
                        </Column>
                        <Column field="member" header="ที่อยู่" sortable>
                            <template #body="{ data }">
                                บ้านเลขที่ {{ data.member }} &nbsp; ถนน {{ data.road }} &nbsp; ซอย {{ data.alley }}
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>
        <ConfirmPopup></ConfirmPopup>

        <Dialog style="font-family: Kanit;" :header="`${disabled_on_edit ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งาน'}`"
            v-model:visible="sigup_popup" :breakpoints="{ '960px': '75vw' }" :style="{ width: '40vw' }" :modal="true">
            <div>
                <div class="grid p-fluid">

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
                            <label class="text-base" for="integeronly"><label class="text-red-500">*</label>อำเภอ</label>
                            <InputText v-model="option_sundivision[0].dis_name_in_thai" placeholder="" disabled />
                        </div>
                        <div class="col-12 md:col-6">
                            <label class="text-base" for="integeronly"><label class="text-red-500">*</label>ตำบล</label>
                            <InputText v-model="option_sundivision[0].sub_name_in_thai" placeholder="" disabled />
                        </div>
                        <div class="col-12 md:col-6">
                            <label class="text-base" for="integeronly"><label class="text-red-500">*</label>จังหวัด</label>
                            <InputText v-model="option_sundivision[0].pro_name_in_thai" placeholder="" disabled />
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
    </div>
</template>


<style lang="scss" scoped>
.product-image {
    width: 50px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)
}

.orders-subtable {
    padding: 1rem;
}
</style>               