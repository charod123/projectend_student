<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useConfirm } from "primevue/useconfirm";
import { ref, onBeforeMount, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import Service from '../../../../service/api';
import { useRouter } from 'vue-router';
import moment from 'moment';
import { useStore } from '../../../../store';
const service = new Service();
const router = useRouter()
const confirm = useConfirm();
const customer1 = ref(null);
const filters1 = ref(null);
const division = ref(null);
const divisionDialog = ref(false)
const loading = ref(false);
const toast = useToast();
const displayConfirmation = ref(false);
const store = useStore();
const onview = ref(null);
const showdetail_shell = ref(false);
const show_btn_create = ref(false);
const lavel = ref([
    { cname: 'น้อย', code: 1 },
    { cname: 'ค่อนข้างน้อย', code: 2 },
    { cname: 'ปานกลาง', code: 3 },
    { cname: 'ค่อนข้างสูง', code: 4 },
    { cname: 'สูง', code: 5 }
])
const clearFilter1 = () => {
    initFilters1();
};
const get_all_pat = async () => {
    loading.value = true;
    try {
        const response = await service.post('/read/get-patient-all', {});
        console.log(response);
        if (response.message === "success") {
            customer1.value = response.data.map(e => {
                e.disease = JSON.parse(e.disease)
                return e
            });


        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
}
onMounted(async () => {
    await get_all_pat();
    store.priority?.filter(x => x.priority_id == 20)[0].can_write == 1 ? show_btn_create.value = true : show_btn_create.value = false

})
onBeforeMount(() => {
    initFilters1();
    loading.value = true;
});
const editpatient = async (pat) => {
    console.log(pat);
    division.value = { ...pat };
    divisionDialog.value = true;

    const usertry = await pat.usertry.map(ut => {
        const { fristname, lastname, gender, phone, birthday, utpid } = ut;
        const create_date = moment(ut.create_date).format("YYYY-MM-DD HH:mm:ss");
        const ut_birthday = moment(birthday).format("DD/MM/YYYY");
        const ut_phone = phone?.split('-').join('');
        return {
            ...ut,
            utpid: utpid,
            ut_fristname: fristname,
            ut_lastname: lastname,
            ut_gender: gender,
            ut_phone,
            ut_birthday,
            create_date
        };
    });

    const patient = {
        pat_id: pat.pat_id,
        alley: pat.address.alley,
        user_pro_id: pat.user_pro_id,
        road: pat.address.road,
        disease: JSON.stringify(pat.disease),
        member: pat.address.member,
        pat_birthday: moment(pat.pat_birthday_for_edit, 'YYYY-MM-DD').format(`YYYY-MM-DD HH:mm:ss`),
        fristname: pat.pat_fristname,
        lastname: pat.pat_lastname,
        gender: pat.pat_sax,
        height: pat.pat_height,
        phone: pat.pat_phone,
        weight: pat.pat_weight,
        postal_code: pat.postal_code,
        province_id: pat.address.province,
        subdistrict_id: pat.address.subdistrict,
        district_id: pat.address.district,
        img: pat.img_path,
    }
    console.log(pat.device);

    console.log(JSON.stringify(usertry));
    sessionStorage.setItem(`patient`, JSON.stringify(patient));
    sessionStorage.setItem(`device`, JSON.stringify(pat.device));
    sessionStorage.setItem(`usertry`, JSON.stringify(usertry));
    router.push('/edit/patient')
};
const addpatient = () => {
    sessionStorage.clear()
    router.push('/create/patient')
}
// const formatDate = (value) => {
//     return value.toLocaleDateString('en-US', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//     });
// };
const delete_pat = async (data) => {
    try {
        loading.value = true;
        const res = await service.post('/write/delete_patient', { pat_id: data.pat_id })
        if (res.message == 'success') {
            customer1.value = customer1.value.filter((val) => val.pat_id !== data.pat_id);
            return loading.value = false;
        }
    } catch (error) {
        return new Error(error.message)
    }

}
const confirm2 = (event, data) => {
    confirm.require({
        target: event.currentTarget,
        message: 'คุณต้องการลบข้อมูลนี้ใช่หรือไม่?',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: async () => {
            await delete_pat(data);
            toast.add({ severity: 'success', summary: 'ลบข้อมูลสำเร็จ', life: 2000 });
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'ยกเลิก', life: 2000 });
        }
    });
}
const opendetails = async (pat) => {

    console.log(pat);
    displayConfirmation.value = true;
    onview.value = { ...pat }
}
const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        // 'division.division_name': { value: null, matchMode: FilterMatchMode.EQUALS },
        // subdivision_id: { value: null },
        // subdivision_name: { value: null, matchMode: FilterMatchMode.EQUALS },
        // create_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        // update_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        pat_weight: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
        age: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },

    };
};

const first = ref(0);
const totalRecords = ref(120);
const totalRecords2 = ref(12);
const reset = () => {
    first.value = 0;
}

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="flex justify-content-between">
                <div>
                    <Button type="button" icon="pi pi-table" class="p-button-text w-3.5rem m-2"
                        @click="showdetail_shell = false" />
                    <Button type="button" icon="pi pi-file" class="p-button-text w-3.5rem m-2"
                        @click="showdetail_shell = true" />
                </div>

                <Button v-if="show_btn_create" style="width: auto;font-family: Kanit;" label="เพิ่มผู้ป่วย"
                    icon="pi pi-plus" @click="addpatient" class="p-button-success m-2" />
            </div>
            <DataTable v-if="!loading && !showdetail_shell" :value="customer1" :paginator="true"
                class="p-datatable-gridlines text-xl" :rows="10" dataKey="pat_id" :rowHover="true"
                v-model:filters="filters1" sortMode="single" sortField="pat_id" :sortOrder="1" filterDisplay="menu"
                :filters="filters1" responsiveLayout="scroll"
                :globalFilterFields="['pat_fristname', 'pat_lastname', 'pat_birthday', 'pat_sax', 'device.device_name', 'device.device_ip']">
                <template #header>
                    <div class="flex justify-content-between ">
                        <div>
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2"
                                @click="clearFilter1()" style="width: auto;" />
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
                <template #paginatorstart>
                    <Button type="button" icon="pi pi-refresh" class="p-button-text" @click="get_all_pat()" />
                </template>
                <template #paginatorend>
                    <Button type="button" icon="pi pi-cloud" class="p-button-text" />
                </template>
                <template #empty> ไม่มีข้อมูล</template>
                <template #loading> Loading customers data. Please wait. </template>
                <Column field="pat_id" header="#" :sortable="true">
                <template #body="{ data }">
                    {{ data.pat_id }}
                    </template>
                    <template #filter="{ filterModel }">
                        <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                            placeholder="Search by id" />
                    </template>
                </Column>
                <Column field="pat_fristname" header="รูปโปรไฟล์" style="min-width: 12rem">
                    <template #body="{ data }">
                        <div class="flex justify-content-center">
                            <Image :src="data.img_path" width="150" style="object-fit: cover;" />
                        </div>

                    </template>

                </Column>
                <Column field="pat_fristname" header="ชื่อเต็ม" style="min-width: 17rem" :sortable="true">
                    <template #body="{ data }">
                        {{ data.pat_fristname + " " + data.pat_lastname }}

                    </template>
                    <template #filter="{ filterModel }">
                        <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                            placeholder="Search by name" />
                    </template>
                </Column>
                <Column field="pat_sax" header="เพศ" :sortable="true">
                    <template #body="{ data }">
                        {{ data.pat_sax }}

                    </template>

                </Column>
                <Column field="pat_birthday" header="วัน/เดือน/ปีเกิด" dataType="date" style="min-width: 13rem"
                    :sortable="true">
                    <template #body="{ data }">
                        {{ data.pat_birthday }}
                    </template>
                </Column>

                <Column field="age" header="อายุ" :showFilterMatchModes="false" style="min-width: 12rem">
                    <template #body="{ data }">
                        {{ data.age }}
                    </template>
                    <template #filter="{ filterModel }">
                        <Slider v-model="filterModel.value" :range="true" class="m-3"></Slider>
                        <div class="flex align-items-center justify-content-between px-2">
                            <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
                            <span>{{ filterModel.value ? filterModel.value[1] : 200 }}</span>
                        </div>
                    </template>
                </Column>
                <Column field="pat_weight" header="น้ำหนัก/ส่วนสูง" :showFilterMatchModes="false" style="min-width: 12rem">
                    <template #body="{ data }">
                        {{ data.pat_weight + "/" + data.pat_height }}
                    </template>
                    <template #filter="{ filterModel }">
                        <Slider v-model="filterModel.value" :range="true" class="m-3"></Slider>
                        <div class="flex align-items-center justify-content-between px-2">
                            <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
                            <span>{{ filterModel.value ? filterModel.value[1] : 200 }}</span>
                        </div>
                    </template>
                </Column>

            <Column bodyClass="text-center" style="min-width: 10rem">
                <template #body="{ data }">

                    <!-- <Button icon="pi pi-search" class="p-button-rounded p-button-info mr-2 mb-2"
                                                                        @click="opendetails(data)" /> -->
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning mr-2 mb-2"
                        @click="editpatient(data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger mr-2 mb-2"
                        @click="confirm2($event, data)" />
                </template>

            </Column>
        </DataTable>
        <ConfirmPopup></ConfirmPopup>



        <!--************************* loding **************************-->
        <DataTable v-if="loading" :value="customer1" :paginator="true" class="p-datatable-gridlines " :rows="10"
            dataKey="pat_id" :rowHover="true" v-model:filters="filters1" sortMode="single" sortField="pat_id"
            :sortOrder="1" filterDisplay="menu" :filters="filters1" responsiveLayout="scroll"
            :globalFilterFields="['pat_fristname', 'pat_lastname', 'pat_birthday', 'pat_sax', 'device.device_name', 'device.device_ip']">
            <template #header>
                <div class="flex justify-content-between ">
                    <div>
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2"
                            @click="clearFilter1()" style="width: auto;" />
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
                <template #empty>
                    <Skeleton height="40px"></Skeleton>
                </template>
                <template #loading> Loading customers data. Please wait. </template>
                <Column field="pat_id" header="#" style="min-width: 12rem">
                <template #body="{ data }">
                    <Skeleton height="40px"></Skeleton>
                </template>
                <template #filter="{ filterModel }">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                        placeholder="Search by id" />
                </template>
            </Column>

                <Column field="pat_fristname + pat_lastname" header="ชื่อเต็ม" style="min-width: 12rem">
                <template #body="{ data }">
                    <Skeleton height="40px"></Skeleton>
                </template>
                <template #filter="{ filterModel }">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                        placeholder="Search by name" />
                </template>
            </Column>
            <Column field="pat_sax" header="เพศ" style="min-width: 12rem">
                <template #body="{ data }">
                    <Skeleton height="40px"></Skeleton>

                </template>
                <template #filter="{ filterModel }">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                        placeholder="Search by name" />
                </template>
            </Column>
            <Column header="วัน/เดือน/ปีเกิด" dataType="date" style="min-width: 10rem">
                <template #body="{ data }">
                    <Skeleton height="40px"></Skeleton>
                </template>
            </Column>

            <Column field="pat_weight" header="น้ำหนัก/ส่วนสูง" :showFilterMatchModes="false" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.pat_weight + "/" + data.pat_height }}
                </template>
                <template #filter="{ filterModel }">
                    <Slider v-model="filterModel.value" :range="true" class="m-3"></Slider>
                    <div class="flex align-items-center justify-content-between px-2">
                        <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
                        <span>{{ filterModel.value ? filterModel.value[1] : 200 }}</span>
                    </div>
                </template>
            </Column>
            <Column header="IP อุปกรณ์" style="min-width: 10rem">
                <template #body="{ data }">
                    <Skeleton height="40px"></Skeleton>
                    </template>
                <template #filter="{ filterModel }">
                    <!-- <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" /> -->
                </template>
            </Column>
            <Column bodyClass="text-center" style="min-width: 8rem">
                <template #body="{ data }">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning mr-2 mb-2"
                        @click="editpatient(data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger mr-2 mb-2" />
                </template>

            </Column>
        </DataTable>
        <ConfirmPopup></ConfirmPopup>
        <!--************************* loding **************************-->

        <Toast />
        <div class="grid" v-if="showdetail_shell">
            <div class="surface-section px-4 py-8 md:px-6 lg:px-8 text-700">
                <div class="flex flex-wrap">
                    <div class="w-full lg:w-6 pr-0 lg:pr-5 mb-5" style="font-family: Kanit;">
                        <!-- <span
                            class="text-blue-700 bg-blue-50 inline-block py-2 px-3" style="border-radius: 50px;">Long
                            Read</span> -->
                        <div class="font-normal text-4xl mt-3 mb-3 text-900">รายละเอียดผู้ป่วย</div>
                        <div class="line-height-3 mt-0 text-2xl">
                            <h4 class="surface-100 p-4 border-round-lg w-auto">ชื่อ-นามสกุล : &nbsp; {{
                                customer1[first].pat_fristname }}&nbsp; {{ customer1[first].pat_lastname }}</h4>
                            <h4 class="surface-100 p-4 border-round-lg w-auto">
                                เพศ : {{ customer1[first].pat_sax }} &nbsp; อายุ : {{ customer1[first].age }}&nbsp;
                                น้ำหนัก : {{ customer1[first].pat_weight }}&nbsp; ส่วนสูง : {{
                                    customer1[first].pat_height
                                }}&nbsp;
                                เบอร์โทรศัพท์ : {{ !customer1[first].pat_phone ? 'ไม่มีเบอร์มือถือ' :
                                    customer1[first].pat_phone
                                }}
                            </h4>
                        </div>
                        <div class="font-normal text-4xl mt-3 mb-3 text-900">รายละเอียดโรคประจำตัว</div>
                        <div class="line-height-3 mt-0 text-2xl">
                            <div v-for="item in customer1[first].disease" :key="item"
                                class="surface-100 p-3 border-round-lg w-auto m-2">
                                <h4>{{ item.cd_name }}</h4>
                                <div class="grid">
                                    <div v-for="category of lavel" :key="category.code" class="field-radiobutton col">
                                        <RadioButton :inputId="category.code" name="category" :value="category.code"
                                            v-model="item.lavel" disabled />
                                        <label :for="category.code">{{ category.cname }}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="font-normal text-4xl mt-3 mb-3 text-900">รายละเอียดที่อยู่</div>
                        <div>
                            <h4 class="surface-100 p-4 border-round-lg w-auto line-height-4">บ้านเลขที่ : {{
                                customer1[first].address.member }} &nbsp; &nbsp; &nbsp; ถนน : {{
        customer1[first].address.road }} &nbsp; &nbsp; &nbsp; ซอย :
                                {{ customer1[first].address.alley }} <br>
                                ตำบล : {{ customer1[first].address.subdistrict?.sub_name_in_thai }}&nbsp; &nbsp; อำเภอ :
                                {{
                                    customer1[first].address.district?.dis_name_in_thai }}
                                &nbsp; จังหวัด : {{ customer1[first].address.province?.pro_name_in_thai }} &nbsp; &nbsp;
                                <br> รหัสไปรษณีย์ :&nbsp; {{ customer1[first].address?.postal_code }}
                            </h4>

                        </div>


                    </div>
                    <div class="w-full lg:w-6 pl-0 lg:pl-5 pt-5">
                        <div class="flex justify-content-center">
                            <img :src="customer1[first].img_path" alt="Image" class="border-round" height="250">
                        </div>
                        <div class="font-normal text-4xl mt-3 mb-3 text-900">รายละเอียดญาติที่สามารถติดต่อได้</div>

                        <h4 class="surface-100 p-4 border-round-lg w-auto line-height-4"
                            v-for="item in customer1[first].usertry" :key="item.ut_id">
                                ชื่อ-นามสกุล : {{ item.fristname }} &nbsp; {{ item.lastname }} &nbsp; อายุ : {{ $moment(new
                                    Date()).format("YYYY") - $moment(item.birthday).format("YYYY") }}
                                &nbsp; เพศ : {{ item.gender }} &nbsp; ความสัมพันธ์กับผู้สูงอายุหรือผู้ป่วยติดเตียง : {{
                                    item.ut_relationship }} <br>เบอร์โทรศัพท์ : {{ item.phone }}
                            </h4>
                            <div class="font-normal text-4xl mt-3 mb-3 text-900">รายละเอียดอุปกรณ์</div>
                            <h4 class="surface-100 p-4 border-round-lg w-auto line-height-4"
                                v-for="item in customer1[first].device" :key="item.device_id">
                                IP : {{ item.device_ip }} &nbsp;&nbsp;&nbsp; ชื่ออุปกรณ์ :&nbsp; {{ item.device_name }}
                            </h4>
                        </div>
                    </div>
                    <Paginator v-model:first="first" :rows="1" :totalRecords="customer1.length"
                        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink">
                        <template #start>
                            <Button type="button" icon="pi pi-refresh" @click="reset()" />
                        </template>
                        <template #end>
                            <Button type="button" icon="pi pi-search" />
                        </template>
                    </Paginator>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';

::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
