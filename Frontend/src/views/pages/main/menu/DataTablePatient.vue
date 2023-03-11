<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useConfirm } from "primevue/useconfirm";
import { ref, onBeforeMount, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import Service from '../../../../service/api';
import { useRouter } from 'vue-router';
import moment from 'moment';
// import { aW } from '@fullcalendar/core/internal-common';
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
const onview = ref(null);
const showdetail_shell = ref(false);
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
            customer1.value = response.data;

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

                <Button style="width: auto;font-family: Kanit;" label="เพิ่มผู้ป่วย" icon="pi pi-plus" @click="addpatient"
                    class="p-button-success m-2" />
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
                            <!-- <div class="text-center text-sm font-medium mt-3">Consequat nisl vel pretium lectus quam id leo
                                                            in.</div>
                                                        <p class="line-height-3 mt-0 mb-5"> Nisi est sit amet facilisis. Ac odio tempor orci dapibus
                                                            ultrices in iaculis nunc sed. Pellentesque pulvinar pellentesque habitant morbi tristique
                                                            senectus. Nullam vehicula ipsum a arcu cursus vitae congue. Leo urna molestie at elementum
                                                            eu facilisis. Fusce id velit ut tortor. Purus non enim praesent elementum facilisis leo vel
                                                            fringilla est. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Neque
                                                            convallis a cras semper. Vitae elementum curabitur vitae nunc sed. Ornare massa eget egestas
                                                            purus viverra accumsan in. Leo integer malesuada nunc vel risus commodo viverra maecenas
                                                            accumsan. Sit amet risus nullam eget. Egestas maecenas pharetra convallis posuere morbi leo
                                                            urna molestie at. </p>
                                                        <p class="line-height-3 text-600 text-2xl mb-5"> “Science is the most reliable guide for
                                                            civilization, for life, for success in the world. Searching a guide other than the science
                                                            is meaning carelessness, ignorance and heresy.” </p>
                                                        <p class="line-height-3 mt-0 mb-5"> Convallis tellus id interdum velit laoreet id donec
                                                            ultrices. Lacus sed viverra tellus in hac habitasse platea dictumst. Ultricies tristique
                                                            nulla aliquet enim. Nunc scelerisque viverra mauris in aliquam sem fringilla. Laculis urna
                                                            id volutpat lacus laoreet. </p>
                                                        <ul class="pt-0 px-5 mt-0 mb-5">
                                                            <li class="line-height-3">Nunc sed velit dignissim sodales ut.</li>
                                                            <li class="line-height-3">Lorem mollis aliquam ut porttitor.</li>
                                                            <li class="line-height-3">Urna nec tincidunt praesent semper feugiat nibh sed.</li>
                                                        </ul>
                                                        <div class="text-3xl text-900">Massa vitae tortor condimentum lacinia</div>
                                                        <p class="line-height-3"> Lacus viverra vitae congue eu consequat ac felis donec et. A lacus
                                                            vestibulum sed arcu non. Mauris vitae ultricies leo integer malesuada nunc vel. Dolor sit
                                                            amet consectetur adipiscing elit ut aliquam purus. Ac tincidunt vitae semper quis lectus
                                                            nulla at volutpat. Enim lobortis scelerisque fermentum dui faucibus in ornare. In mollis
                                                            nunc sed id semper. Vitae ultricies leo integer malesuada nunc vel risus commodo. </p> -->
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
            <!-- <Dialog v-model:visible="displayConfirmation" :style="{ width: '450px' }" header="Confirm" :modal="true">
                                                                                                                                                                    <div class="flex align-items-center justify-content-center">
                                                                                                                                                                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                                                                                                                                                        <span v-if="product">Are you sure you want to delete the selected products?</span>
                                                                                                                                                                    </div>
                                                                                                                                                                    <template #footer>
                                                                                                                                                                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false" />
                                                                                                                                                                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
                                                                                                                                                                    </template>
                                                                                                                                                                </Dialog> -->
            <!-- <Dialog header="รายละเอียด" v-model:visible="displayConfirmation" :breakpoints="{ '1080px': '75vw' }"
                                                                                                                                                                    :style="{ width: '45vw' }" :modal="true">
                                                                                                                                                                    <div class="grid p-fluid">
                                                                                                                                                                        <div class="col-12 md:col-12">
                                                                                                                                                                            <img :src="onview?.img_path[0]" />
                                                                                                                                                                            <h3>ข้อมูลส่วนตัว</h3>
                                                                                                                                                                        <div class="grid formgrid">
                                                                                                                                                                            <div class="col-12 mb-2 lg:col-12 lg:mb-0">
                                                                                                                                                                                <h5>ชื่อ-นามสกุล {{ onview.pat_fristname + ' ' + onview.pat_lastname }}    อายุ  {{ onview.age }}  เพศ  {{ onview.pat_sax }}  ส่วนสูง  {{ onview.pat_height }}   น้ำหนัก   {{ onview.pat_weight }}</h5>
                                                                                                                                                                            </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <h5>ที่อยู่</h5>
                                                                                                                                                                        <div class="grid formgrid">
                                                                                                                                                                            <div class="col-12 mb-2 lg:col-12 lg:mb-0">
                                                                                                                                                                                <InputText type="text" placeholder="กรอกข้อมูล"></InputText>
                                                                                                                                                                            </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        <h5>โรคประจำตัว</h5>

                                                                                                                                                                        <Dropdown v-model="dropdownValue" :options="dropdownValues" optionLabel="name"
                                                                                                                                                                            placeholder="เลือกประเภท" :filter="true" :showClear="true" />


                                                                                                                                                                        <h5>ญาติที่สามารถติดต่อได้</h5>

                                                                                                                                                                        <Dropdown v-model="dropdownValue" :options="dropdownValues" optionLabel="name"
                                                                                                                                                                            placeholder="เลือกประเภท" :filter="true" :showClear="true" />


                                                                                                                                                                        <h5>รายละเอียดอุปกรณ์</h5>
                                                                                                                                                                        <Dropdown v-model="dropdownValue" :options="dropdownValues" optionLabel="name"
                                                                                                                                                                            placeholder="เลือกอุปกรณ์" />

                                                                                                                                                                    </div>
                                                                                                                                                                </div>
                                                                                                                                                                <template #footer>
                                                                                                                                                                    <Button label="บันทึก" @click="close" icon="pi pi-check" class="p-button-outlined" />
                                                                                                                                                                </template>
                                                                                                                                                            </Dialog> -->
            <!-- <Dialog v-model:visible="divisionDialog" :style="{ width: '450px' }" header="Product Details" :modal="true"
                                                                                                                                                                class="p-fluid">
                                                                                                                                                                <img :src="contextPath + 'demo/images/product/' + product.image" :alt="product.image"
                                                                                                                                                                    v-if="product.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
                                                                                                                                                                <div class="field">
                                                                                                                                                                    <label for="name">Name</label>
                                                                                                                                                                    <InputText id="name" v-model.trim="division.subdivision_name" required="true" autofocus
                                                                                                                                                                        :class="{ 'p-invalid': submitted && !division.subdivision_name }" />
                                                                                                                                                                    <small class="p-invalid" v-if="submitted && !product.name">Name is required.</small>
                                                                                                                                                                </div>
                                                                                                                                                                <div class="field">
                                                                                                                                                                    <label for="description">Description</label>
                                                                                                                                                                    <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" />
                                                                                                                                                                </div>

                                                                                                                                                                <div class="field">
                                                                                                                                                                    <label for="inventoryStatus" class="mb-3">Inventory Status</label>
                                                                                                                                                                    <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses"
                                                                                                                                                                        optionLabel="label" placeholder="Select a Status">
                                                                                                                                                                        <template #value="slotProps">
                                                                                                                                                                            <div v-if="slotProps.value && slotProps.value.value">
                                                                                                                                                                                <span :class="'product-badge status-' + slotProps.value.value">{{
                                                                                                                                                                                    slotProps.value.label
                                                                                                                                                                                }}</span>
                                                                                                                                                                            </div>
                                                                                                                                                                            <div v-else-if="slotProps.value && !slotProps.value.value">
                                                                                                                                                                                <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{
                                                                                                                                                                                    slotProps.value
                                                                                                                                                                                }}</span>
                                                                                                                                                                            </div>
                                                                                                                                                                            <span v-else>
                                                                                                                                                                                {{ slotProps.placeholder }}
                                                                                                                                                                            </span>
                                                                                                                                                                        </template>
                                                                                                                                                                    </Dropdown>
                                                                                                                                                                </div>

                                                                                                                                                                <div class="field">
                                                                                                                                                                    <label class="mb-3">Category</label>
                                                                                                                                                                    <div class="formgrid grid">
                                                                                                                                                                        <div class="field-radiobutton col-6">
                                                                                                                                                                            <RadioButton id="category1" name="category" value="Accessories"
                                                                                                                                                                                v-model="product.category" />
                                                                                                                                                                            <label for="category1">Accessories</label>
                                                                                                                                                                    </div>
                                                                                                                                                                    <div class="field-radiobutton col-6">
                                                                                                                                                                        <RadioButton id="category2" name="category" value="Clothing" v-model="product.category" />
                                                                                                                                                                        <label for="category2">Clothing</label>
                                                                                                                                                                    </div>
                                                                                                                                                                    <div class="field-radiobutton col-6">
                                                                                                                                                                    <RadioButton id="category3" name="category" value="Electronics"
                                                                                                                                                                        v-model="product.category" />
                                                                                                                                                                    <label for="category3">Electronics</label>
                                                                                                                                                                </div>
                                                                                                                                                                <div class="field-radiobutton col-6">
                                                                                                                                                                    <RadioButton id="category4" name="category" value="Fitness" v-model="product.category" />
                                                                                                                                                                    <label for="category4">Fitness</label>
                                                                                                                                                                </div>
                                                                                                                                                            </div>
                                                                                                                                                        </div>

                                                                                                                                                        <div class="formgrid grid">
                                                                                                                                                            <div class="field col">
                                                                                                                                                                <label for="price">Price</label>
                                                                                                                                                                <InputNumber id="price" v-model="product.price" mode="currency" currency="USD" locale="en-US"
                                                                                                                                                                    :class="{ 'p-invalid': submitted && !product.price }" :required="true" />
                                                                                                                                                                <small class="p-invalid" v-if="submitted && !product.price">Price is required.</small>
                                                                                                                                                            </div>
                                                                                                                                                            <div class="field col">
                                                                                                                                                                <label for="quantity">Quantity</label>
                                                                                                                                                                <InputNumber id="quantity" v-model="product.quantity" integeronly />
                                                                                                                                                            </div>
                                                                                                                                                        </div>
                                                                                                                                                        <template #footer>
                                                                                                                                                            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                                                                                                                                            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
                                                                                                                                                        </template>
                                                                                                                                                    </Dialog> -->
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
