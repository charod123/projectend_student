<script setup>
import { ref, onMounted, watch, onUpdated, defineComponent } from 'vue';
// import Dialog_Create_complain from './Create/Dialog_Create_complain.vue';
import Service from '../../../service/api';
import { useToast } from 'primevue/usetoast';
import { useStore } from '../../../store';
const store = useStore();
const toast = new useToast();
const service = new Service();
const file = ref(null);
const img = ref(null);
const show_btn_create = store.priority?.filter(x => x.priority_id == 18)[0].can_read == 1 ? true : false
const data_create_complain = ref({
    cp_id: null,
    dropdownValue_device: null,
    dropdownValue_type: null,
    cp_title: null,
    content: null,
    phone: null
})
const dropdownValue_pat = ref(null);
const main_data = ref(null);
const device = ref(null);
const count_title = ref({
    count_all: 0,
    count_start: 0,
    count_process: 0,
    count_colse: 0,
})
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
const handleFileUpload = (event) => {
    file.value = event.files;
};
const edit_complain = async (data) => {
    const res = await service.post('/write/update_complain', {
        cp_id: data_create_complain.value.cp_id,
        cp_type_id: data.dropdownValue_type,
        cp_title: data.cp_title,
        cp_detail: data.content,
        cp_tel: data.phone,
        pat_id: dropdownValue_pat.value ?? '',
        device_id: data.dropdownValue_device ?? ''
    });
    if (file.value) {
        const formData = new FormData();
        formData.append('full_path', 'resources/assets/complain-img');
        formData.append('id', `cp-${data_create_complain.value.cp_id}`);
        for (let i = 0; i < file.value.length; i++) {
            formData.append('file', file.value[i])
        }
        const res_img = await service.post('/upload/upload-file-over-one', formData, {});
        if (res_img.message == 'success') {
            toast.add({ severity: 'success', summary: 'เพิ่มเรื่องร้องเรียนสำเร็จ', detail: res.message, life: 1500 });
        }
    }
    if (res.message == 'success') {
        toast.add({ severity: 'success', summary: 'เพิ่มเรื่องร้องเรียนสำเร็จ', detail: res.message, life: 1500 });
        store.opendialog = !store.opendialog
    }

}
const create_complain = async (data) => {
    debugger
    console.log(data);
    const res = await service.post('/write/create-complain', {
        cp_type_id: data.dropdownValue_type,
        cp_title: data.cp_title,
        cp_detail: data.content,
        cp_tel: data.phone,
        pat_id: dropdownValue_pat.value ?? '',
        img_path: 'resources/assets/complain-img',
        device_id: data.dropdownValue_device ?? ''
    });
    console.log(res);
    if (res.data[0].cp_id && file.value) {
        const formData = new FormData();
        formData.append('full_path', 'resources/assets/complain-img');
        formData.append('id', `cp-${res.data[0].cp_id}`);
        for (let i = 0; i < file.value.length; i++) {
            formData.append('file', file.value[i])
        }
        const res_img = await service.post('/upload/upload-file-over-one', formData, {});
        if (res_img.message == 'success') {
            toast.add({ severity: 'success', summary: 'เพิ่มเรื่องร้องเรียนสำเร็จ', detail: res.message, life: 1500 });
        }
    }
    await store.get_complain();
    store.opendialog = false;

}
watch(dropdownValue_pat, (newValue) => {
    console.log(newValue);
    device.value = main_data.value?.filter(e => e.pat_id == newValue)[0]?.device
    console.log(device.value);
})
const get_data_pat_device = async () => {
    const res = await service.post('/read/get_patient_all', {});
    if (res.message == 'success') {
        main_data.value = res.data;
        main_data.value.map((e) => {
            e.full_name = e.pat_fristname + ' ' + e.pat_lastname
            return e
        })
        console.log(main_data.value);
    } else {
        toast.add({ severity: 'error', summary: 'ดึงข้อมูลผิดพลาด', detail: res.message, life: 1500 });
    }
    const get_count_title = await service.post('/read/get-count-title', {});
    console.log(get_count_title.data);
    if (get_count_title.code) {
        toast.add({ severity: 'error', summary: get_count_title.message, life: 2000 });
    }
    count_title.value.count_all = get_count_title.data[0]?.total ?? 0;
    count_title.value.count_colse = get_count_title.data[0]?.cp3 ?? 0;
    count_title.value.count_process = get_count_title.data[0]?.cp2 ?? 0;
    count_title.value.count_start = get_count_title.data[0]?.cp1 ?? 0;

}
watch(store.opendialog, (newValue) => {
    console.log(newValue);
})

onUpdated(() => {
    console.log(store.data);
    if (store.data.cp_id != data_create_complain.value.cp_id) {
        data_create_complain.value.cp_id = store.data?.cp_id
        data_create_complain.value.content = store.data?.cp_detail
        data_create_complain.value.cp_title = store.data?.cp_title
        dropdownValue_pat.value = store.data?.pat_id
        data_create_complain.value.dropdownValue_device = store.data?.device_ip
        data_create_complain.value.dropdownValue_type = store.data?.cp_type_id;
        data_create_complain.value.phone = store.data?.cp_tel
        img.value = typeof store.data?.img_path == "string" ? [store.data?.img_path] : store.data?.img_path
    }

})

onMounted(async () => {
    await get_data_pat_device();
})
const nestedRouteItems = ref([
    {
        label: 'แสดงรายการ',
        to: '/main/complain/details'
    },
    {
        label: 'แสดงแผนที่',
        to: '/main/complain/onmap'
    },

]);
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
const openpopup = () => {
    store.opendialog = !store.opendialog
    store.data = {}
}

</script>


<template>
    <div class="grid">
        <div class="col-12 text-center">
            <div class="flex justify-content-between">
                <h2>แจ้งเรื่องร้องเรียน</h2>
                <Button v-if="show_btn_create" class="p-button-raised p-button-info"
                    @click="openpopup">เพิ่มเรื่องร้องเรียน</Button>
            </div>
        </div>
        <div :class="`col-12 lg:col-12 xl:col-${+store.role == 1 || +store.role == 2 ? '8' : '12'}`">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div class="grid" style="width: 100%;">
                        <div class="col-3 mb-2 lg:col-3 md:col-4 sm:col-6 lg:mb-0">
                            <span class="block text-500 text-2xl font-medium mb-3">เรื่องทั้งหมด</span>
                            <div class="text-900 font-medium text-2xl text-xl">{{ count_title.count_all }}</div>
                        </div>

                        <div class="col-3 mb-2 lg:col-3 md:col-4 sm:col-6 lg:mb-0">
                            <span class="block text-500 text-2xl font-medium mb-3">เรื่องแจ้ง</span>
                            <div class="text-900 font-medium text-2xl text-xl">{{ count_title.count_start }}</div>
                        </div>

                        <div class="col-3 mb-2 lg:col-3 md:col-4 sm:col-6 lg:mb-0">
                            <span class="block text-500 text-2xl font-medium mb-3">กำลังดำเนินการ</span>
                            <div class="text-900 text-orange-500 text-2xl font-medium text-xl">{{ count_title.count_process
                            }}</div>
                        </div>

                        <div class="col-3 mb-2 lg:col-3 md:col-4 sm:col-6 lg:mb-0">
                            <span class="block text-500 text-2xl font-medium mb-3">ปิดงาน</span>
                            <div class="text-900 text-green-500 text-2xl font-medium text-xl">{{ count_title.count_colse }}
                            </div>
                        </div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-bell text-blue-500 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 lg:col-12 xl:col-4" v-if="+store.role == 1 || +store.role == 2">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div class="grid" style="width: 100%;">
                        <div class="col-6 mb-2 lg:col-6 lg:mb-0">
                            <span class="block text-500 text-2xl font-medium mb-3">ปิดงานสำเร็จ</span>
                            <div class="text-900 font-medium text-xl">{{ count_title.count_colse / count_title.count_all *
                                100 }}%
                            </div>
                        </div>
                        <div class="col-6 mb-2 lg:col-6 lg:mb-0">
                            <span class="block text-500 text-2xl font-medium mb-3">เรื่องทั้งหมด</span>
                            <div class="text-900 font-medium text-xl">{{ count_title.count_all }}</div>
                        </div>
                    </div>

                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-map-marker text-orange-500 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="card">
                <TabMenu style="font-family: Kanit;" :model="nestedRouteItems" />
                <router-view />
            </div>
        </div>
        <Dialog :header="`${store.data.cp_id ? 'แก้ไขร้องร้องเรียน' : 'เพิ่มร้องร้องเรียน'}`"
            v-model:visible="store.opendialog" :breakpoints="{ '1080px': '75vw' }" :style="{ width: '45vw' }" :modal="true"
            style="font-family:Kanit">
            <div class="grid p-fluid">
                <div class="col-12 md:col-12">
                    <h5>ประเภทเรื่องร้องเรียน</h5>
                    <div class="grid formgrid">
                        <div class="col-12 mb-2 lg:col-12 lg:mb-0">
                            <Dropdown v-model="data_create_complain.dropdownValue_type" :options="type"
                                optionLabel="complain_type_name" optionValue="complain_type_id" placeholder="เลือกประเภท" />
                        </div>
                    </div>
                    <h5>หัวข้อเรื่องร้องเรียน</h5>
                    <div class="grid formgrid">
                        <div class="col-12 mb-2 lg:col-12 lg:mb-0">
                            <InputText type="text" placeholder="กรอกข้อมูล" v-model="data_create_complain.cp_title">
                            </InputText>
                        </div>
                    </div>
                    <h5 v-if="data_create_complain.dropdownValue_type == 2">เลือกผู้ป่วยที่เกี่ยวข้องกับปัญหา</h5>
                    <Dropdown v-if="data_create_complain.dropdownValue_type == 2" v-model="dropdownValue_pat"
                        :options="main_data" optionLabel="full_name" optionValue="pat_id" placeholder="เลือก/ค้นหาผู้ป่วย"
                        :filter="true" :showClear="true" />


                    <h5 v-if="data_create_complain.dropdownValue_type == 2">เลือกอุปกรณ์ที่มีปัญหา</h5>
                    <Dropdown v-if="data_create_complain.dropdownValue_type == 2"
                        v-model="data_create_complain.dropdownValue_device" :options="device" optionLabel="device_ip"
                        optionValue="device_ip" placeholder="เลือกอุปกรณ์ที่มีปัญหา" />
                    <h5>เบอร์โทรสำหรับติดต่อกลับ</h5>
                    <div class="grid formgrid">
                        <div class="col-12 mb-2 lg:col-12 lg:mb-0">
                            <InputText type="number" placeholder="กรอกข้อมูล" v-model="data_create_complain.phone">
                            </InputText>
                        </div>
                    </div>
                    <h5>อัปโหลดรูปเพิ่มเติม</h5>

                    <FileUpload :customUpload="true" :multiple="true" mode="basic" @select="handleFileUpload" name="demo[]"
                        chooseLabel="อัปโหลด" :showUploadButton="true" :accept="'image/*'">
                    </FileUpload>

                    <div class="grid mt-2" v-if="store.data">
                        <div class="col-12 mb-2 lg:col-3 lg:mb-0" v-for="item in img" :key="item">
                            <Image :src="item" alt="Image Text" width="220" preview />
                        </div>
                    </div>
                    <h5>รายละเอียดเรื่องที่แจ้ง</h5>
                    <Editor v-model="data_create_complain.content" editorStyle="height: 800px" :init="tinymceSettings">
                        <template #toolbar>
                            <span class="ql-formats">
                                <button class="ql-bold"></button>
                                <button class="ql-italic"></button>
                                <button class="ql-underline"></button>
                            </span>
                        </template>
                    </Editor>

                    <!-- <Editor v-if="!loading" v-model="content" apiKey="uomi65v16zevnt069dsx2hjwbed3dbdofksts9tixcty1fqw"
                                                                                                                                                                                                                                                                                                                                                                                                                                                            :init="tinymceSettings" :readonly="true" /> -->



                </div>
            </div>
            <template #footer>
                <Button label="บันทึก"
                    @click="store.data.cp_id ? edit_complain(data_create_complain) : create_complain(data_create_complain)"
                    icon="pi pi-check" class="p-button-outlined" />
            </template>
        </Dialog>
    </div>
</template>
