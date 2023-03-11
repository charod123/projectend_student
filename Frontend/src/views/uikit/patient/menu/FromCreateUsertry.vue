
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import moment from 'moment';
const router = useRouter();
const route = useRoute();
const displayConfirmation = ref(false);
const toast = useToast();
const genders = ref(['ชาย', 'หญิง']);
const Relationships = ref(['ลูก', 'หลาน', 'สามี', 'ภรรยา']);

const openConfirmation = () => {
    displayConfirmation.value = !displayConfirmation.value;
};
// const getData = async () => {
//     await new Promise((resolve) => setTimeout(resolve, 2000))
//     const data = {
//         name: 'John Doe',
//         email: 'johndoe@example.com',
//     }
//     return data;
// }
// const readData = await getData();
const usertry = JSON.parse(sessionStorage.getItem(`usertry`));
const values = ref({ usertry: [{}] });
const nexpage = async () => {
    const usertry = values.value.usertry.map(e => {
        if (route.fullPath === '/edit/patient/usertry') {
            return {
                ut_id: e?.ut_id,
                ut_fristname: e?.ut_fristname,
                ut_lastname: e?.ut_lastname,
                ut_birthday: moment(e?.ut_birthday, 'YYYY-MM-DD').format("DD/MM/YYYY"),
                ut_gender: e?.ut_gender,
                ut_phone: e?.ut_phone.split('-').join(''),
                ut_relationship: e?.ut_relationship,
                user_pro_id: e?.user_pro_id
            }
        }
        return {
            ut_fristname: e?.ut_fristname,
            ut_lastname: e?.ut_lastname,
            ut_birthday: moment(e?.ut_birthday, 'YYYY-MM-DD').format("DD/MM/YYYY"),
            ut_gender: e?.ut_gender,
            ut_phone: e?.ut_phone.split('-').join(''),
            ut_relationship: e?.ut_relationship
        }
    })

    sessionStorage.setItem(`usertry`, JSON.stringify(await Promise.all(usertry)));
    return router.push(route.fullPath === '/edit/patient/usertry' ? '/edit/patient/device' : '/create/patient/device');

}
onMounted(async () => {
    console.log(JSON.parse(localStorage.getItem('formData')));
    if (usertry) {
        const usertry_new = await usertry.map(e => {
            e.ut_birthday = moment(e.ut_birthday, 'YYYY-MM-DD').format("DD/MM/YYYY")
            return e
        })
        values.value.usertry = usertry_new;
    }

});

const addUertry = async (value) => {
    console.log(value);
    values.value.usertry = (value.usertry || []).concat([{}]);
}

// delete new member
const removeUsertry = async (i, values) => {
    toast.add({ severity: 'success', summary: 'ลบสำเร็จ', detail: 'คุณได้ลบฟอร์มเพิ่มญาติแล้ว', life: 3000 });
    const v = values.usertry.filter((_, index) => {
        return i !== index;
    });
    displayConfirmation.value = !displayConfirmation.value;

    values.usertry = v;

}
</script>

<template>
    <Toast />
    <div class="grid p-fluid" v-for="(m, index) in values.usertry" :key="index">
        <div class="col-12 md:col-12 mt-5">
            <div class="card surface-50">
                <h4>ข้อมูลส่วนตัว</h4>
                <div class="grid formgrid mt-5">
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                        <span class="p-float-label">
                            <InputText id="inputtext" type="text" v-model="m.ut_fristname" />
                            <label for="inputtext">*ชื่อจริง</label>
                        </span>
                    </div>
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                        <span class="p-float-label">
                            <InputText id="inputtext" type="text" v-model="m.ut_lastname" />
                            <label for="inputtext">*นามสกุล</label>
                        </span>
                    </div>
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                        <span class="p-float-label">
                            <Calendar id="inputtext" v-model="m.ut_birthday" dateFormat="dd/mm/yy" />
                            <label for="inputtext">*วัน/เดือน/ปีเกิด</label>
                        </span>
                    </div>
                </div>

                <div class="grid formgrid mt-5">
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                        <span class="p-float-label">
                            <Dropdown id="state" v-model="m.ut_gender" :options="genders">
                            </Dropdown>
                            <label for="state">*เพศ</label>
                        </span>
                    </div>
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                        <span class="p-float-label">
                            <InputMask id="ssn" mask="999-999-9999" v-model="m.ut_phone" placeholder="000-000-0000" />
                            <label for="ssn">*เบอร์โทรศัพท์</label>
                        </span>
                    </div>
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                        <span class="p-float-label">
                            <Dropdown id="state" v-model="m.ut_relationship" :options="Relationships">
                            </Dropdown>
                            <label for="state">*ความสัมพันธ์กับผู้สูงอายุหรือผู้ป่วยติดเตียง</label>
                        </span>
                    </div>
                </div>

                <div class="flex align-items-center justify-content-end mt-5">
                    <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="openConfirmation"
                        style="width: auto" />
                    <Dialog header="กรุณาเลือก" v-model:visible="displayConfirmation" :style="{ width: '350px' }"
                        :modal="true" style="font-family: kanit;">
                        <div class="flex align-items-center justify-content-center">
                            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                            <span>คุณต้องการลบแบบพอร์มใช่หรือไม่?</span>
                        </div>
                        <template #footer>
                            <Button label="ไม่" icon="pi pi-times" @click="openConfirmation" class="p-button-text" />
                            <Button label="ใช่" icon="pi pi-check" @click="removeUsertry(index, values)"
                                class="p-button-text" autofocus />
                        </template>
                    </Dialog>
                </div>

            </div>
        </div>


    </div>
    <div class="flex align-items-center justify-content-end">
        <Button class="w-full p-button-info p-3 text-xl w-auto mb-5" color="#2EAEA7"
            @click="addUertry(values)">เพิ่มฟอร์ม</Button>
    </div>


    <div class="flex flex-wrap md:justify-content-between justify-content-center card-container">
        <Button class="w-full p-3 text-xl w-auto" @click.prevent="$router.back()">ย้อนกลับ</Button>
        <Button class="w-full p-3 text-xl w-auto" @click.prevent="nexpage($event)">ถัดไป</Button>
    </div>
</template>
<style scoped>
Button {
    font-family: 'kanit';
}
</style>