<script setup>
import { ref, onMounted, watch, computed, defineComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import moment from 'moment';
import Service from '../../../../service/api';
import { useStore } from '@/store';
import { useToast } from 'primevue/usetoast';

const toast = new useToast();
const store = useStore();
const service = new Service();
const router = useRouter();
const route = useRoute();
const genders = ref(['ชาย', 'หญิง']);
const treeSelectNodes = ref(null);
const data = ref({});
const lastname = ref('');
const fristname = ref('');
const birthday = ref('');
const gender = ref('');
const phone = ref('');
const height = ref(100);
const weight = ref(30);
const member = ref('');
const road = ref('');
const alley = ref('');
const postal_code = ref(null);
const province_id = ref(null);
const district_id = ref(null);
const subdistrict_id = ref(null);
const subdistricts = ref([]);
const provinces = ref([]);
const districts = ref([]);
const diseases = ref(null);
const disease = ref([]);
const file = ref(null);
const pat_id = ref(null);
// const isValidName = computed(() => {
//     return fristname.value.length > 1 || lastname.value.length > 1
// })
const selectlavel = ref(null);
const lavel = ref([
    { cname: 'น้อย', code: 1 },
    { cname: 'ค่อนข้างน้อย', code: 2 },
    { cname: 'ปานกลาง', code: 3 },
    { cname: 'ค่อนข้างสูง', code: 4 },
    { cname: 'สูง', code: 5 }
])
watch(province_id, async (val) => {
    console.log(val);
    try {
        const res = await service.post('/read/get-district', { province_id: province_id.value })
        console.log(res);
        if (res.message == 'success') {
            districts.value = res.data;
        }
    } catch (err) {
        await toast.add({ severity: 'error', summary: err.message, life: 3000 });

    }
});
watch(district_id, async (o, v) => {
    console.log(o, v);
    try {
        const res = await service.post('/read/get-subdistrict', { district_id: district_id.value })
        if (res.message == 'success') {
            subdistricts.value = res.data;;
        }
    } catch (err) {
        await toast.add({ severity: 'error', summary: err.message, life: 3000 });

    }

});
watch(subdistrict_id, async (newVal) => {
    try {
        postal_code.value = subdistrict_id.value?.zip_code;
    } catch (err) {
        await toast.add({ severity: 'error', summary: err.message, life: 3000 });

    }
});

watch(disease, async (newVal) => {
    try {
        disease.value = newVal;
    } catch (err) {
        await toast.add({ severity: 'error', summary: err.message, life: 3000 });

    }
});
// const handleFileUpload = (event) => {
//     file.value = event.files;
// };


// const formData = ref(null);
// const inputFile = ref(null);
// const response = ref(null);

// const handleFileChange = event => {
//     formData.value = new FormData();
//     formData.value.append('file', event.target.files[0]);
//     localStorage.setItem('formData', JSON.stringify(Array.from(formData.value.entries())));
// };

// const handleSubmit = async () => {
//     const formDataFromLocalStorage = localStorage.getItem('formData');
//     if (!formDataFromLocalStorage) return;

//     formData.value = new FormData();
//     JSON.parse(formDataFromLocalStorage).forEach(([key, value]) => formData.value.append(key, value));

//     const apiResponse = await service.post('/upload/upload-file-only', { formData: formData.value });

//     response.value = await apiResponse.json();
// };
const merge_local_todata = async () => {
    const data = JSON.parse(sessionStorage.getItem('patient'));
    if (data) {
        fristname.value = data.fristname ?? data.pat_fristname;
        lastname.value = data.lastname ?? data.pat_lastname;
        birthday.value = moment(data.pat_birthday, 'YYYY-MM-DD').format("DD/MM/YYYY");
        gender.value = data.gender ?? data.pat_gender;
        phone.value = data.phone ?? data.pat_phone;
        height.value = data.height ?? data.pat_height;
        weight.value = data.weight ?? data.pat_weight;
        member.value = data.member;
        road.value = data.road;
        alley.value = data.alley;
        postal_code.value = data.postal_code;
        province_id.value = data.province_id;
        district_id.value = data.district_id;
        subdistrict_id.value = data.subdistrict_id;
        disease.value = JSON.parse(data.disease);
        postal_code.value = data.postal_code;
        img.value = data.img;
        pat_id.value = data.pat_id;
    }
}
onMounted(() => {
    get_provine_dis();
    merge_local_todata();
    if (route.fullPath !== '/edit/patient') {
        getmax_id();
    }

    // inputFile.value = document.querySelector('input[type="file"]');
    // inputFile.value.addEventListener('change', handleFileChange);

    // const formDataFromLocalStorage = localStorage.getItem('formData');
    // if (formDataFromLocalStorage) {
    //     formData.value = new FormData();
    //     JSON.parse(formDataFromLocalStorage).forEach(([key, value]) => formData.value.append(key, value));
    // }
});
const selectedCity1 = ref([]);
const selectedCity2 = ref(null);
watch(selectedCity2, async (o, n) => {
    console.log(o);
    selectedCity1.value.push(o)
    console.log(selectedCity1);
});
const getmax_id = async () => {
    const res = await service.post('get_id', { filed: 'pat_id', table: 'patient_master' });
    if (res.message = 'success') {
        pat_id.value = res.data
    }
}
const get_provine_dis = async () => {
    const provine = await service.post('/read/get-province', {})
    const dis = await service.post('/read/get-disease', {})
    if (provine.message == 'success') {
        provinces.value = provine.data;
    }
    if (dis.message == 'success') {
        diseases.value = dis.data;



        console.log(diseases.value);
    }
}

const nexpage = async () => {
    store.submitted = true;
    setTimeout(() => {
        store.submitted = false;
    }, 100000)

    const user_id = JSON.parse(localStorage.getItem(`details`))?.user_id
    console.log(user_id);
    // const formData = new FormData();
    // formData.append('full_path', "resources/assets/pat-img");
    // formData.append('file', file.value)
    data.value = {
        pat_id: pat_id.value ? '' : pat_id.value,
        pat_fristname: fristname.value,
        pat_lastname: lastname.value,
        pat_birthday: birthday.value,
        pat_gender: gender.value,
        pat_phone: phone.value,
        pat_height: height.value,
        pat_weight: weight.value,
        member: member.value,
        road: road.value,
        alley: alley.value,
        postal_code: postal_code.value,
        province_id: province_id.value,
        district_id: district_id.value,
        subdistrict_id: subdistrict_id.value,
        disease: JSON.stringify(disease.value),
        img: !img.value ? '' : img.value
    };
    if (route.fullPath === '/edit/patient') {
        data.value.pat_id = JSON.parse(sessionStorage.getItem(`patient`))?.pat_id;
        data.value.user_pro_id = JSON.parse(sessionStorage.getItem(`patient`))?.user_pro_id;
    }
    province_id.value = null;
    subdistrict_id.value = null;
    district_id.value = null;
    sessionStorage.setItem(`patient`, JSON.stringify(data.value));
    return router.push(route.fullPath === '/edit/patient' ? '/edit/patient/usertry' : '/create/patient/usertry');

}
const uploadedFileName = ref('');
const img = ref('');

const onFileUpload = async (event) => {
    console.log(event);
    const file = event.files[0];
    const formData = new FormData();
    !pat_id.value ? null : formData.append('id', 'pat-' + pat_id.value);
    formData.append('full_path', 'resources/assets/patient-img');
    formData.append('file', file);
    try {
        const response = await service.post('/upload/upload-file-only', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        // debugger
        if (response.message == 'success') {
            img.value = response.data.img
            pat_id.value = response.data.pat_id
            toast.add({ severity: 'success', summary: 'อัพโหลดสำเร็จ', detail: response.data.filename, life: 1500 });
        }
        // uploadedFileName.value = response.data.filename;

    } catch (error) {
        console.error('Failed to upload file:', error);
    }
};
// const beforeUpload = (request) => {
//     console.log(request);
//     // request.xhr.setRequestHeader('Authorization', this.$auth.getToken('local'));
//     return request;
// }
// const searchCountry = (event) => {
//     setTimeout(() => {
//         if (!event.query.trim().length) {
//             autoFilteredValue.value = [...autoValue.value];
//         } else {
//             autoFilteredValue.value = autoValue.value.filter((country) => {
//                 return country.name.toLowerCase().startsWith(event.query.toLowerCase());
//             });
//         }
//     }, 250);
// };

</script>

<template>
    <div class="grid p-fluid">
        <div class="col-12 md:col-8 mt-5 sm:col-6">
            <div class="card surface-50">
                <h4>ข้อมูลส่วนตัว</h4>
                <div class="grid formgrid mt-5">
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                        <span class="p-float-label">
                            <InputText id="inputtext" type="text" v-model="fristname"
                                :class="{ 'p-invalid': store.submitted && !fristname }" />
                            <label for="inputtext">*ชื่อจริง</label>
                        </span>
                        <small class="p-invalid text-red-500 text-base"
                            v-if="store.submitted && !fristname">กรุณากรอกข้อมูล.</small>
                    </div>
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                        <span class="p-float-label">
                            <InputText id="inputtext" type="text" v-model="lastname"
                                :class="{ 'p-invalid': store.submitted && !lastname }" />
                            <label for="inputtext">*นามสกุล</label>
                        </span>
                        <small class="p-invalid text-red-500 text-base"
                            v-if="store.submitted && !lastname">กรุณากรอกข้อมูล.</small>
                    </div>
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                        <span class="p-float-label">
                            <Calendar id="inputtext" v-model="birthday" dateFormat="dd/mm/yy"
                                :class="{ 'p-invalid': store.submitted && !birthday }" />
                            <label for="inputtext">*วัน/เดือน/ปีเกิด</label>
                        </span>
                        <small class="p-invalid text-red-500 text-base"
                            v-if="store.submitted && !birthday">กรุณากรอกข้อมูล.</small>
                    </div>
                </div>

                <div class="grid formgrid mt-5">
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                        <span class="p-float-label">
                            <Dropdown id="state" v-model="gender" :options="genders"
                                :class="{ 'p-invalid': store.submitted && !gender }"></Dropdown>
                            <label for="state">*เพศ</label>
                        </span>
                        <small class="p-invalid text-red-500 text-base"
                            v-if="store.submitted && !gender">กรุณากรอกข้อมูล.</small>
                    </div>
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                        <span class="p-float-label">
                            <InputMask id="ssn" mask="999-999-9999" v-model="phone" placeholder="000-000-0000" />
                            <label for="ssn">เบอร์โทรศัพท์ (ถ้ามี)</label>
                        </span>

                    </div>
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                        <span class="p-float-label">
                            <InputNumber id="inputheignt" v-model="height" showButtons mode="decimal" :min="100" :max="250"
                                :class="{ 'p-invalid': store.submitted && !height }">
                            </InputNumber>
                            <label for="inputheignt">*ส่วนสูง</label>
                        </span>
                        <small class="p-invalid text-red-500 text-base"
                            v-if="store.submitted && !height">กรุณากรอกข้อมูล.</small>
                    </div>
                </div>
                <div class="grid formgrid mt-5">
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                        <span class="p-float-label">
                            <InputNumber id="inputheignt" v-model="weight" showButtons mode="decimal" :min="30" :max="180"
                                :class="{ 'p-invalid': store.submitted && !weight }">
                            </InputNumber>
                            <label for="inputheignt">*น้ำหนัก</label>
                        </span>
                        <small class="p-invalid text-red-500 text-base"
                            v-if="store.submitted && !weight">กรุณากรอกข้อมูล.</small>

                    </div>
                </div>

                <h4 class="mt-5">รายละเอียดที่อยู่</h4>
                <div class="grid formgrid mt-5">
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                        <span class="p-float-label">
                            <InputText id="inputtext" type="text" v-model="member"
                                :class="{ 'p-invalid': store.submitted && !member }" />
                            <label for="inputtext">*บ้านเลขที่</label>
                        </span>
                        <small class="p-invalid text-red-500 text-base"
                            v-if="store.submitted && !member">กรุณากรอกข้อมูล.</small>

                    </div>
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                        <span class="p-float-label">
                            <InputText id="inputtext" type="text" v-model="road" />
                            <label for="inputtext">ถนน (ถ้ามี)</label>
                        </span>
                    </div>
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                        <span class="p-float-label">
                            <InputText id="inputtext" type="text" v-model="alley" />
                            <label for="inputtext">ซอย (ถ้ามี)</label>
                        </span>
                    </div>
                </div>

                <div v-if="$route.path !== '/edit/patient'" class="grid formgrid mt-5">
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                        <span class="p-float-label">
                            <Dropdown v-model="province_id" :options="provinces" optionLabel="pro_name_in_thai"
                                :filter="true" :showClear="true" :class="{ 'p-invalid': store.submitted && !province_id }">
                            </Dropdown>
                            <label for="inputtext">*จังหวัด</label>
                        </span>
                        <small class="p-invalid text-red-500 text-base"
                            v-if="store.submitted && !province_id">กรุณากรอกข้อมูล.</small>

                    </div>
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                        <span class="p-float-label">
                            <Dropdown v-model="district_id" :options="districts" optionLabel="dis_name_in_thai"
                                :filter="true" :showClear="true" :class="{ 'p-invalid': store.submitted && !district_id }">
                            </Dropdown>
                            <label for="inputtext">*อำเภอ</label>
                        </span>
                        <small class="p-invalid text-red-500 text-base"
                            v-if="store.submitted && !district_id">กรุณาเลือกข้อมูล.</small>

                    </div>
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                        <span class="p-float-label">
                            <Dropdown v-model="subdistrict_id" :options="subdistricts" optionLabel="sub_name_in_thai"
                                :filter="true" :showClear="true"
                                :class="{ 'p-invalid': store.submitted && !subdistrict_id }">
                            </Dropdown>
                            <label for="inputtext">*ตำบล</label>
                        </span>
                        <small class="p-invalid text-red-500 text-base"
                            v-if="store.submitted && !subdistrict_id">กรุณาเลือกข้อมูล.</small>

                    </div>

                </div>
                <!-- <div v-if="$route.path !== '/edit/patient'" class="grid formgrid mt-5">
                            <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                                <span class="p-float-label">
                                    <InputText id="inputheignt" disabled type="number" v-model="postal_code"
                                        :class="{ 'p-invalid': store.submitted && !postal_code }" />
                                    <label for="inputheignt">รหัสไปรษณีย์</label>
                                </span>
                                <small class="p-invalid text-red-500 text-base"
                                    v-if="store.submitted && !postal_code">กรุณาเลือกข้อมูล.</small>

                            </div>
                        </div> -->

            </div>

        </div>

        <div class="col-12 md:col-4 mt-3 sm:col-6">
            <div class="col-12">

                <div class="card surface-50">
                    <h4>โรคประจำตัว</h4>
                    <span class="p-float-label mt-5 mb-5">
                        <MultiSelect id="inputheignt" v-model="disease" :options="diseases" optionLabel="cd_name"
                            :filter="true" :class="{ 'p-invalid': store.submitted && !disease }">
                            <template #value="slotProps">
                                <div class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2"
                                    v-for="option of slotProps.value" :key="option.code">
                                    <div>{{ option.cd_name }}</div>
                                </div>
                                <template v-if="!slotProps.value || slotProps.value.length === 0">
                                    <div class="p-1">Select Countries</div>
                                </template>
                            </template>
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps.option.cd_name }}</div>
                                </div>
                            </template>
                        </MultiSelect>
                        <label for="inputheignt">เลือกโรค</label>
                        <small class="p-invalid text-red-500 text-base"
                            v-if="store.submitted && !disease">กรุณาเลือกข้อมูล.</small>
                    </span>
                    <div v-for="item in disease" :key="item">
                        <h5>{{ item.cd_name }}</h5>
                        <div class="grid">
                            <div v-for="category of lavel" :key="category.code" class="field-radiobutton col-2">
                                <RadioButton :inputId="category.code" name="category" :value="category.code"
                                    v-model="item.lavel" />
                                <label :for="category.code">{{ category.cname }}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card surface-50">
                    <h4>รูปผู้สูงอายุ หรือผู้ป่วยติดเตียง</h4>
                    <FileUpload name="demo[]" :customUpload="true" @uploader="onFileUpload" accept="image/*" />
                    <Image v-if="img" :src="img" alt="Image Text" width="220" preview />
                </div>
            </div>
        </div>
    </div>
    <div class="flex align-items-center justify-content-between">
        <Button class="w-full p-3 text-xl w-auto" @click.prevent="$router.back()">กลับ</Button>
        <Button class="w-full p-3 text-xl w-auto" @click.prevent="nexpage($event)">ถัดไป</Button>
    </div>
</template>
<style scoped>
Button {
    font-family: 'kanit';
}
</style>