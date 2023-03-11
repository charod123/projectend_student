<script setup>
// import { useLayout } from '@/layout/composables/layout';
import { onMounted, ref, watch } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useToast } from 'primevue/usetoast';
// import router from '../../../router';
import config from '@/service/config';
import { useRouter } from 'vue-router';
import Service from '../../../service/api';
import { useStore } from '../../../store';
const service = new Service();
const route = useRouter();
const toast = useToast();
const province_id = ref(null);
const district_id = ref(null);
const subdistrict_id = ref(null);
const subdistricts = ref([]);
const provinces = ref([]);
const districts = ref([]);
const postal_code = ref(null);
const dialog_wran = ref(false);
const user_pro_id = ref(null);
const user_id = ref(null);
const store = useStore();
const handleFileUpload = (event) => {
    file.value = event.files;
};
watch(province_id, async () => {
    try {
        const res = await service.post('/get-district', { province_id: province_id.value });
        if (res.message == 'success') {
            districts.value = res.data;
        }
    } catch (err) {
        console.log(err.message);
    }
});
watch(district_id, async () => {
    try {
        const res = await service.post('/get-subdistrict', { district_id: district_id.value });
        if (res.message == 'success') {
            subdistricts.value = res.data;
        }
    } catch (err) {
        console.log(err.message);
    }

});
watch(subdistrict_id, (newVal) => {
    try {
        postal_code.value = newVal.zip_code;
    } catch (err) {
        console.log(err.message);
    }
});
onMounted(async () => {
    await get_id();
    const res = await service.post('/get-province', {});
    if (res.message == 'success') {
        provinces.value = res.data;
    }
})
const get_id = async () => {
    const res1 = await service.post('/get_id', { filed: 'user_id', table: 'user_master' });
    if (res1.message == 'success') {
        user_id.value = res1.data
    }
    const res2 = await service.post('/get_id', { filed: 'user_pro_id', table: 'user_profile' });
    if (res2.message == 'success') {
        user_pro_id.value = res2.data
    }
}
const register = async () => {
    try {
        const data = {
            user_pro_id: user_pro_id.value,
            user_id: user_id.value,
            email: email.value,
            password: password.value,
            img_path: 'resources/assets/user-img',
            fristname: fristname.value,
            lastname: lastname.value,
            birthday: birthday.value,
            gender: gender.value.name,
            phone: phone.value.split('-').join(''),
            role_id: 3,
            province_id: province_id.value,
            district_id: district_id.value,
            subdistrict_id: subdistrict_id.value

        };
        const res = await service.post('/register', data);
        if (res.message === 'success') {
            const formData = new FormData();
            formData.append('full_path', "resources/assets/user-img");
            formData.append('id', `user-${user_id.value}`);
            for (let i = 0; i < file.value.length; i++) {
                formData.append('file', file.value[i])
            }
            const res_img = await service.post('/upload/upload-file-only', formData);
            sigup_popup.value = false
            toast.add({ severity: 'success', summary: res_img.message, life: 3000 });
        } else {
            toast.add({ severity: 'error', summary: res.message, life: 3000 });

        }
    } catch (error) {
        toast.add({ severity: 'error', summary: error.message, life: 3000 });
    }
}

const sigin = async () => {
    try {
        const data = { email: email.value, password: password.value };
        const res = await service.post('/login', data);
        if (res.message === 'success') {
            store.priority = null;
            localStorage.setItem('token', res.data[0].token);
            localStorage.setItem('details', JSON.stringify(res.data[0]));
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Signin Successful', life: 3000 });
            setTimeout(() => route.push('/mainstram'), 700);
        } else {
            toast.add({ severity: 'error', summary: res.message, detail: 'Incorrect email or password', life: 3000 });
        }
    } catch (err) {
        console.log(err);
    }
};
// const { layoutConfig, contextPath } = useLayout();
const email = ref('');
const password = ref('');
const fristname = ref('');
const lastname = ref('');
const birthday = ref('');
const genders = ref([{ name: 'ชาย' }, { name: 'หญิง' }]);
const gender = ref('');
const phone = ref();
const file = ref([])
const sigup_popup = ref(false);

const forgetpass = ref(false);
const checked = ref(false);
const open = () => {
    sigup_popup.value = true;
};
const open_forgetpass = () => {
    forgetpass.value = true;
};
// const logoUrl = computed(() => {
//     return `${contextPath}layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
// });
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <Toast />
        <div class="flex flex-column align-items-center justify-content-center">
            <!-- <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" /> -->
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-6 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img :src="`${config.backend_url_img}/resources/assets/mian-icon/default/logo-main/78a0ef24252625.56331cb43dba4.jpg`"
                            alt="Image" height="120" class="mb-3" />
                        <div class="text-900 text-3xl font-medium mb-3">ระบบเฝ้าวังผู้สูงอายุและผู้ป่วยติดเตียง
                        </div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">อีเมล</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5"
                            style="padding: 1rem" v-model="email" v-on:keyup.enter="sigin()" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">รหัสผ่าน</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true"
                            class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem" v-on:keyup.enter="sigin()">
                        </Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">จดจำรหัส</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer"
                                style="color: var(--primary-color)" @click="open_forgetpass">ลืมรหัสผ่าน?</a>
                        </div>
                        <Button label="Sign In" @click="sigin" class="w-full p-3 text-xl"></Button>
                        <Button label="Sign up" class="w-full p-3 text-xl mt-4"
                            style="width: auto; background: lightskyblue; border: none" @click.prevent="open"></Button>
                    </div>

                </div>


                <Dialog header="สมัครสมาชิก" v-model:visible="sigup_popup" :breakpoints="{ '960px': '75vw' }"
                    :style="{ width: '30vw' }" :modal="true">
                    <div>
                        <div class="grid p-fluid">
                            <div class="col-12 md:col-6">
                                <div class="p-inputgroup">
                                    <span class="p-inputgroup-addon">
                                        <i class="pi pi-user"></i>
                                    </span>
                                    <InputText v-model="email" placeholder="*อีเมล" />
                                </div>
                            </div>

                            <div class="field col-12 md:col-6">
                                <span class="p-float-label">
                                    <div class="p-inputgroup">
                                        <span class="p-inputgroup-addon">
                                            <i class="pi pi-user"></i>
                                        </span>
                                        <Password placeholder="*รหัสผ่าน" mediumRegex :toggleMask="true" inputClass="w-full"
                                            v-model="password">
                                            <template #header>
                                                <h6>Pick a password</h6>
                                            </template>
                                            <template #footer>
                                                <Divider />
                                                <p class="mt-2">Suggestions</p>
                                                <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                                                    <li>At least one lowercase</li>
                                                    <li>At least one uppercase</li>
                                                    <li>At least one numeric</li>
                                                    <li>Minimum 8 characters</li>
                                                </ul>
                                            </template>
                                        </Password>
                                    </div>
                                </span>
                            </div>
                            <Divider />
                            <div class="col-12 md:col-6">
                                <div class="p-inputgroup">
                                    <span class="p-inputgroup-addon">
                                        <i class="pi pi-user"></i>
                                    </span>
                                    <InputText v-model="fristname" placeholder="*ชื่อจริง" />
                                </div>
                            </div>
                            <div class="col-12 md:col-6">
                                <div class="p-inputgroup">
                                    <span class="p-inputgroup-addon">
                                        <i class="pi pi-user"></i>
                                    </span>
                                    <InputText v-model="lastname" placeholder="*นามสกุล" />
                                </div>
                            </div>
                            <div class="col-12 md:col-6">
                                <div class="p-inputgroup">
                                    <span class="p-inputgroup-addon">
                                        <i class="pi pi-calendar-minus"></i>
                                    </span>

                                    <Calendar v-model="birthday" dateFormat="dd/mm/yy" />
                                </div>
                            </div>
                            <div class="col-12 md:col-6">
                                <div class="p-inputgroup">
                                    <span class="p-inputgroup-addon">
                                        <i class="pi pi-users"></i>
                                    </span>
                                    <Dropdown id="state" v-model="gender" :options="genders" optionLabel="name"
                                        placeholder="*เพศ"></Dropdown>
                                </div>
                            </div>
                            <div class="col-12 md:col-6">
                                <div class="p-inputgroup">
                                    <span class="p-inputgroup-addon">
                                        <i class="pi pi-phone"></i>
                                    </span>
                                    <InputMask id="ssn" mask="999-999-9999" v-model="phone" placeholder="000-000-0000" />
                                </div>
                            </div>


                            <div class="col-12 md:col-6">
                                <span class="p-float-label">
                                    <Dropdown v-model="province_id" :options="provinces" optionLabel="pro_name_in_thai"
                                        @click="dialog_wran == true" :filter="true" :showClear="true">
                                    </Dropdown>
                                    <label for="inputtext">*จังหวัด</label>
                                </span>
                            </div>
                            <div class="col-12 md:col-6">
                                <span class="p-float-label">
                                    <Dropdown v-model="district_id" :options="districts" optionLabel="dis_name_in_thai"
                                        :filter="true" :showClear="true"></Dropdown>
                                    <label for="inputtext">*อำเภอ</label>
                                </span>
                            </div>
                            <div class="col-12 md:col-6">
                                <span class="p-float-label">
                                    <Dropdown v-model="subdistrict_id" :options="subdistricts"
                                        optionLabel="sub_name_in_thai" :filter="true" :showClear="true"></Dropdown>
                                    <label for="inputtext">*ตำบล</label>
                                </span>
                            </div>

                            <div class="col-12 md:col-6">
                                <FileUpload :customUpload="true" mode="basic" @select="handleFileUpload" name="demo[]"
                                    chooseLabel="อัปโหลด" :showUploadButton="true" :accept="'image/*'">
                                </FileUpload>

                            </div>
                        </div>


                    </div>
                    <template #footer>
                        <Button label="บันทึก" @click="register" icon="pi pi-check" class="p-button-outlined" />
                    </template>
                </Dialog>
                <Dialog header="Dialog" v-model:visible="forgetpass" :breakpoints="{ '960px': '75vw' }"
                    :style="{ width: '30vw' }" :modal="true">
                    <p class="line-height-3 m-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo
                        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                        deserunt mollit anim id est laborum.
                    </p>
                    <template #footer>
                        <Button label="Ok" @click="close" icon="pi pi-check" class="p-button-outlined" />
                    </template>
                </Dialog>

            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
