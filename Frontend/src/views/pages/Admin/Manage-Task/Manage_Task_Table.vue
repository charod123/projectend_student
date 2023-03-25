<script setup>
import { ref, watch, onMounted, onBeforeMount, onUpdated } from 'vue';
import Service from '../../../../service/api';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode } from 'primevue/api';
import { useStore } from '../../../../store';
import moment from 'moment';
const store = useStore();
const toast = useToast();
const confirm = useConfirm();
const filters1 = ref(null);
const service = new Service();
const expandedRows = ref([]);
const task_type = ref();
const visibleFull = ref(false);
const values = ref({ task: [{}] });
const totalSize = ref(0);
const totalSizePercent = ref(0);
const task_type_id = ref();
const view_detail = ref(false);
const on_edit_task = ref(false);
const headeronview = ref('รายละเอียดงาน');
const data = ref({
    task_id: 99999,
    task_type_id: 1,
    task_type_name: '',
    files: []

})
const disabled_on_edit = ref();
const sigup_popup = ref();
const users = ref();
const select_user = ref();
const op = ref();
const subdivision = ref();
const task = ref();
const task_backup = ref();
const data_view = ref();
const showdropdonw = ref(false);
const addUertry = async (value) => {
    values.value.task.length > 5 ? toast.add({ severity: 'warn', summary: 'สามารถเพิ่มอุปกรณ์ได้แค่ 5 ชิ้น', life: 3000 }) : values.value.task = (value.task || []).concat([{}]);
}

const onRemoveTemplatingFile = (file, removeFileCallback, index, m) => {
    removeFileCallback(index);
    console.log(file);
    m.files = m.files.filter((e, i) => e.name != file.name)
    totalSize.value -= parseInt(formatSize(file.size));
    totalSizePercent.value = totalSize.value / 10;
};


const onSelectedFiles = async (event, m) => {
    if (event.files.length > 10) {
        return toast.add({ severity: 'warn', summary: 'ไม่สามารถแบบไฟล์ได้เกิน 15 ไฟล์', life: 3000 });
    }
    m.files = event.files;
    console.log(m.files);

    m.files.forEach((file) => {
        totalSize.value += parseInt(formatSize(file.size));
    });
};


const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
// delete new member
const removeUsertry = async (i, values) => {
    toast.add({ severity: 'success', summary: 'ลบสำเร็จ', detail: 'คุณได้ลบฟอร์มเพิ่มญาติแล้ว', life: 3000 });
    const v = values.task.filter((_, index) => {
        return i !== index;
    });
    // displayConfirmation.value = !displayConfirmation.value;

    values.task = v;

}
const save_edit = async (data) => {
    const res = await service.post('/write/update_task', { values: data });
    if (res.message == 'success') {
        if (data[0].files) {
            for (let q = 0; q < data.length; q++) {
                const id = data[q];
                const formData = new FormData();
                formData.append('full_path', "resources/assets/task-file");
                formData.append('id', `tsk-${id.task_id}`);

                for (let q = 0; q < id.files.length; q++) {
                    const file = id.files[q];
                    formData.append('file', file)
                }
                const res1 = await service.post('/upload/upload-file-over-one', formData);
                if (res1.message == "success") {
                    get();
                    on_edit_task.value = false;
                    view_detail.value = false;
                    return toast.add({ severity: 'success', summary: res.message, life: 3000 });
                }
                return toast.add({ severity: 'error', summary: res.message, life: 3000 });
            }

        }
        on_edit_task.value = false;
        view_detail.value = false;
        return toast.add({ severity: 'success', summary: res.message, life: 3000 });

    }
    return toast.add({ severity: 'error', summary: res.message, life: 3000 });
}
const save = async () => {
    const data_ = values.value.task.map((e_, i) => {
        e_.task_id = data.value.task_id + i
        e_.file_path = "resources/assets/task-file"
        e_.status = '1'
        e_.del_flag = "1"
        return e_
    })
    const res = await service.post('/write/insert_task', { values: values.value.task });
    if (res.message == 'success') {
        for (let q = 0; q < data_.length; q++) {
            const id = data_[q];
            if (id.files) {
                const formData = new FormData();
                formData.append('full_path', "resources/assets/task-file");
                formData.append('id', `tsk-${id.task_id}`);

                for (let q = 0; q < id.files.length; q++) {
                    const file = id.files[q];
                    formData.append('file', file)

                }
                const res1 = await service.post('/upload/upload-file-over-one', formData);
                if (res1.message == "success") {
                    get();
                    visibleFull.value = false;
                    return toast.add({ severity: 'success', summary: res.message, life: 3000 });
                }
                return toast.add({ severity: 'error', summary: res.message, life: 3000 });
            }

        }
        return toast.add({ severity: 'success', summary: res.message, life: 3000 });

    }
    return toast.add({ severity: 'error', summary: res.message, life: 3000 });
}

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
const get = async () => {
    const res = await service.post('/read/get_type_task', {});
    if (res.message == 'success') {
        task_type.value = res.data;
    }
    const task_ = await service.post('/read/get_task', {});
    if (task_.message == 'success') {
        task.value = task_.data;
        task_backup.value = task_.data;
        console.log(task.value);
    }
    const user = await service.post('/read/get_user_in_subdivision', {});
    if (user.message == 'success') {
        users.value = user.data;
    }
    const sub = await service.post('/read/get_subdivison', {});
    if (sub.message == 'success') {
        subdivision.value = sub.data[0];
    }

}
const getmax_id = async () => {
    const res = await service.post('/get_id', { table: 'task', filed: 'task_id' });
    if (res.message == 'success') {
        data.value.task_id = res.data
    }
    const task_type = await service.post('/get_id', { table: 'task_type', filed: 'task_type_id' });
    if (task_type.message == 'success') {
        data.value.task_type_id = task_type.data
    }
}

onMounted(() => {
    JSON.parse(sessionStorage.getItem('priority'))[0].role_id == 1 ? showdropdonw.value = true : false

    get();
    getmax_id();

})
const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
};

const confirm2 = (event, data, m) => {
    confirm.require({
        target: event.currentTarget,
        message: 'คุณต้องการลบข้อมูลนี้ใช่หรือไม่?',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: () => {
            delete_file(data, m)
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'ยกเลิก', life: 2000 });
        }
    });
}

const confirm3 = (event, { task_id }) => {
    confirm.require({
        target: event.currentTarget,
        message: 'คุณต้องการยกเลิกแผนงานนี้ใช่หรือไม่?',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: async () => {
            const res = await service.post('/write/delete_task', { task_id: task_id });
            if (res.message == 'success') {
                get();
                return toast.add({ severity: 'success', summary: 'ลบข้อมูลสำเร็จ', life: 2000 });
            }
            return toast.add({ severity: 'error', summary: res.message, life: 3000 });

        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'ยกเลิก', life: 2000 });
        }
    });
}
const confirm4 = (event, { task_type_id }) => {
    confirm.require({
        target: event.currentTarget,
        message: 'คุณต้องการยกเลิกแผนงานนี้ใช่หรือไม่?',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: async () => {
            const res = await service.post('/write/delete_task_type', { task_type_id: task_type_id });
            if (res.message == 'success') {
                get();
                return toast.add({ severity: 'success', summary: 'ลบข้อมูลสำเร็จ', life: 2000 });
            }
            return toast.add({ severity: 'error', summary: res.message, life: 3000 });

        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'ยกเลิก', life: 2000 });
        }
    });
}
watch(task_type_id, () => {
    task.value = task_backup.value.filter(x => x.task_type_id == task_type_id.value);
})
onBeforeMount(() => {
    initFilters1();
});
const toggle = (event) => {
    op.value.toggle(event);
};
const filter_on_btn = (status) => {
    task.value = task_backup.value.filter(x => x.status == status);
}
const opendetail = (data) => {
    data.start_date = moment(data.start_date, 'YYYY-MM-DD').format("YYYY-MM-DD");
    data.end_date = moment(data.end_date, 'YYYY-MM-DD').format("YYYY-MM-DD");
    data_view.value = [data];
    console.log(data_view.value);
    headeronview.value = 'รายละเอียดงาน'
    view_detail.value = true;
}

const openedit = (data) => {
    headeronview.value = 'แก้ไขงาน'
    data.start_date = moment(data.start_date, 'YYYY-MM-DD').format("YYYY-MM-DD");
    data.end_date = moment(data.end_date, 'YYYY-MM-DD').format("YYYY-MM-DD");
    data_view.value = [data];
    on_edit_task.value = true;
    view_detail.value = true;
}
const delete_file = async (data, m) => {
    const file = data.split('/')
    const file_name = file[file.length - 1]
    const folder_name = file[file.length - 2]
    const res = await service.post('/write/delete_file', { task_id: folder_name, file_name: file_name });
    if (res.message == 'success') {
        m.file = m.file.filter(x => x != data)
        return toast.add({ severity: 'success', summary: 'ลบข้อมูลสำเร็จ', life: 2000 });
    }
    return toast.add({ severity: 'error', summary: res.message, life: 3000 });

}
const create_main = () => {
    getmax_id();
    data.value.task_type_id = ''
    data.value.task_type_name = ''
    sigup_popup.value = true;
}
const edit_task_type = (data_) => {
    data.value.task_type_id = data_.task_type_id;
    data.value.task_type_name = data_.task_type_name;
    disabled_on_edit.value = true;
    sigup_popup.value = true;
}
const create_task_type = async (url) => {
    const res3 = await service.post(`/write/${url}`, { task_type_id: data.value.task_type_id, task_type_name: data.value.task_type_name });
    if (res3.message == 'success') {
        sigup_popup.value = false;
        get();
        return toast.add({ severity: 'success', summary: res3.message, life: 2000 });
    }
    return toast.add({ severity: 'error', summary: res3.message, life: 2000 });
}
</script>
<template>
    <div>
        <div class="flex justify-content-center">
            <h1>เทศบาล {{ subdivision?.division_name }} &nbsp;&nbsp; หน่วยงาน {{ subdivision?.subdivision_name }}</h1>

        </div>
        <div class="card grid">
            <span class="p-buttonset col-12">
                <Button style="font-family: Kanit;" icon="pi pi-tag" label="งานเปิด" class="w-15rem p-button-info" raised
                    @click="filter_on_btn(1)" />

                <Button style="font-family: Kanit;" icon="pi pi-tag" label="กำลังดำเนินการ" class="w-20rem p-button-help"
                    raised @click="filter_on_btn(8)" />

                <Button style="font-family: Kanit;" icon="pi pi-tag" label="งานที่รอดำเนินการตรวจสอบ"
                    class="w-20rem p-button-warning" raised @click="filter_on_btn(2)" />
                <Button style="font-family: Kanit;" icon="pi pi-tag" label="งานยกเลิก" class="w-15rem p-button-danger"
                    @click="filter_on_btn(0)" />
                <Button style="font-family: Kanit;" icon="pi pi-tag" label="งานสาย" class="w-15rem p-button-danger"
                    @click="filter_on_btn(4)" />
                <Button style="font-family: Kanit;" icon="pi pi-tag" label="งานปิด" class="w-15rem p-button-secondary"
                    @click="filter_on_btn(3)" />

            </span>
            <div class="col-12">
                <h4 class="mt-2 mr-2">ประเภทงาน: </h4>
                <Dropdown v-model="task_type_id" :options="task_type" optionLabel="task_type_name"
                    optionValue="task_type_id" placeholder="เลือกประเภท" class="w-full md:w-20rem" />
            </div>

        </div>
        <Dialog style="font-family: Kanit;" :header="`${disabled_on_edit ? 'แก้ไขข้อมูลประเภท' : 'เพิ่มข้อมูลประเภท'}`"
            v-model:visible="sigup_popup" :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '20vw' }"
            :position="'right'" :modal="true">
            <div class="grid p-fluid">
                <div class="col-12">
                    <InputText v-model="data.task_type_name" placeholder="ชื่อเมณูหลัก" />
                </div>
            </div>
            <template #footer>
                <Button label="บันทึก" icon="pi pi-check"
                    @click="create_task_type(`${disabled_on_edit ? 'update_task_type' : 'insert_task_type'}`)" autofocus />
            </template>
        </Dialog>

        <DataTable :value="task" v-model:expandedRows="expandedRows" dataKey="id" style="font-family: Kanit;"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]" :filters="filters1" v-model:filters="filters1"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} " responsiveLayout="scroll"
            :globalFilterFields="['task_type_name', 'opener_task', 'task_title', 'start_date', 'end_date']"
            :paginator="true" :rows="10">
            <template #header>
                <div class="grid w-full">
                    <div class="sm:col-12 md:col-12 lx:col-4 lg:col-4">
                        <span class="p-input-icon-left mb-2">
                            <i class="pi pi-search" />
                            <InputText v-model="filters1['global'].value" placeholder="Keyword Search"
                                style="width: auto;" />
                        </span>
                    </div>
                    <div class="sm:col-12 md:col-12 lx:col-4 lg:col-4">
                        <div style="font-family: Kanit;" class="flex justify-content-center">
                            <h2>จัดการงาน</h2>
                        </div>
                    </div>

                    <div class="sm:col-12 md:col-12 lx:col-4 lg:col-4">
                        <div class="flex justify-content-end">
                            <div>
                                <Button v-if="store.role == 1" style="font-family: Kanit;"
                                    class="w-15rem p-button-success mr-4" icon="pi pi-plus" label="จัดการข้อมูลประเภทงาน"
                                    @click="toggle" />
                                <Button style="font-family: Kanit;" class="w-10rem p-button-success" icon="pi pi-plus"
                                    label="เปิดงานใหม่" @click="visibleFull = true" />
                            </div>
                        </div>
                    </div>
                </div>


            </template>
            <OverlayPanel ref="op" appendTo="body" :showCloseIcon="true" id="overlay_panel" style="width: 450px"
                :breakpoints="{ '960px': '75vw' }">
                <DataTable :value="task_type" v-model:selection="selectedProduct" selectionMode="single" :paginator="true"
                    :rows="4" responsiveLayout="scroll">
                    <template #header>
                        <div class="flex justify-content-between">
                            <h1></h1>
                            <Button icon="pi pi-plus" class="p-button-rounded p-button-success mr-2 mb-2"
                                @click="create_main" />
                        </div>

                    </template>
                    <Column field="task_type_name" header="ชื่อประเภทงาน" sortable style="width: 50%"></Column>
                    <Column style="width: 40%">
                        <template #body="{ data }">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning mr-2 mb-2"
                                @click="edit_task_type(data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger mr-2 mb-2"
                                @click="confirm4($event, data)" />
                        </template>
                    </Column>
                </DataTable>
            </OverlayPanel>
            <template #empty> ไม่มีข้อมูล</template>
            <template #loading> Loading customers data. Please wait. </template>
            <template #paginatorstart>
                <Button type="button" icon="pi pi-refresh" class="p-button-text" @click="get()" />
            </template>
            <template #paginatorend>
                <Button type="button" icon="pi pi-cloud" class="p-button-text" />
            </template>
            <Column field="task_id" header="รหัสงาน" style="min-width: 2rem" :sortable="true">
                <template #body="{ data }">
                    {{ data.task_id }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                        placeholder="Search by name" />
                </template>
            </Column>
            <Column field="task_type_name" header="ประเภทงาน" style="min-width: 10rem" :sortable="true">
                <template #body="{ data }">
                    {{ data.task_type_name }}
                </template>
            </Column>
            <Column field="task_title" header="หัวเรื่อง" style="min-width: 10rem" :sortable="true">
                <template #body="{ data }">
                    {{ data.task_title }}
                </template>
            </Column>
            <Column field="opener_task" header="ผู้เปิด" style="min-width: 10rem" :sortable="true">
                <template #body="{ data }">
                    {{ data.opener_task }}
                </template>
            </Column>
            <Column field="person_responsible" header="ผู้รับผิดชอบ" style="min-width: 10rem" :sortable="true">
                <template #body="{ data }">
                    {{ !data.person_responsible ? 'ยังไม่มีผู้รับผิดชอบ' : data.person_responsible }}
                </template>
            </Column>
            <Column field="create_date" header="สร้างเมื่อ" style="min-width: 10rem" :sortable="true">
                <template #body="{ data }">
                    {{ $moment(data.create_date, 'YYYY-MM-DD').format("DD/MM/YYYY HH:mm:ss") }}
                </template>
            </Column>
            <Column field="start_date" header="วันที่เริ่มงาน" style="min-width:15rem" :sortable="true">
                <template #body="{ data }">
                    
                    {{ $moment(data.start_date, 'YYYY-MM-DD').format("DD/MM/YYYY") }}
                </template>
            </Column>
            <Column field="end_date" header="กำหนดเสร็จ" style="min-width:15rem" :sortable="true">
                <template #body="{ data }">
                    {{ $moment(data.end_date, 'YYYY-MM-DD').format("DD/MM/YYYY") }}
                </template>
            </Column>

            <Column field="end_date" header="เหลือ (วัน)" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ $moment(data.end_date, 'YYYY-MM-DD').format("MMDD") -
                        $moment(data.start_date, 'YYYY-MM-DD').format("MMDD") }}
                </template>
            </Column>
            <Column field="status" header="สถานะ" style="min-width: 20rem" :sortable="true">
                <template #body="{ data }">
                    <Tag class="text-lg p-2" style="font-family: Kanit;"
                        :value="data.status == 1 ? 'งานเปิด' : data.status == 2 ? 'งานที่รอดำเนินการตรวจสอบ' : data.status == 0 ? 'งานที่ยกเลิก' : data.status == 8 ? 'กำลังดำเนินการ' : data.status == 4 ? 'งานสาย' : 'งานที่ปิด'"
                        :severity="data.status == 1 ? 'info' : data.status == 2 ? 'warning' : data.status == 0 ? 'danger' : data.status == 8 ? 'help' : data.status == 4 ? 'danger' : 'secondary'" />

            </template>
        </Column>


            <Column header="Tools" style="min-width: 15rem">
                <template #body="{ data }">
                    <Button icon="pi pi-spin pi-eye" class="p-button-info m-1" aria-label="Filter"
                        @click="opendetail(data)" />
                    <Button v-if="data.status == 1 || data.status == 8" icon="pi pi-spin pi-cog"
                        class="p-button-warning m-1" aria-label="Search" @click="openedit(data)" />
                    <Button v-if="data.status == 1 || data.status == 8" icon="pi pi-spin pi-trash"
                        class="p-button-danger m-1" aria-label="Bookmark" @click="confirm3($event, data)" />
                </template>
            </Column>

        </DataTable>
        <ConfirmPopup></ConfirmPopup>
        <Sidebar v-model:visible="visibleFull" style="font-family: Kanit;" maximizable modal header="รายละเอียดงาน"
            :style="{ width: '100vw' }">
            <template #header>

                <div class="flex justify-content-between align-items-center w-60rem  gap-6">
                    <div>
                        <p class="text-6xl font-semibold">เปิดงานใหม่</p>
                    </div>

                    <div>
                        <Button label="เพิ่มงาน" icon="pi pi-spin pi-plus" class="p-button-info m-1" aria-label="Filter"
                            @click="addUertry(values)" />
                        <Button label="บันทึก" icon="pi pi-check" class="p-button-success m-1" aria-label="Filter"
                            @click="save()" />
                    </div>


                </div>
            </template>
            <div class="w-full h-full">
                <div class="surface-card p-5 shadow-5 border-round flex-auto h-auto">
                    <div class="p-divider p-component p-divider-horizontal p-divider-solid p-divider-left" role="separator"
                        aria-orientation="horizontal"></div>
                    <div class="flex gap-5 flex-column-reverse md:flex-row">
                        <div class="flex-auto p-fluid grid">
                            <div class="sm:col-12 md:col-12 lg:col-12 xl:col-12">

                                <div class=" card mt-5 shadow-7 bg-blue-100" v-for="(m, index) in values.task" :key="index">

                                    <div class="flex justify-content-between">
                                        <h3>กรอกรายละเอียดงาน</h3>
                                        <Button @click="removeUsertry(index, values)" icon="pi pi-spin pi-times"
                                            class="p-button-rounded p-button-danger p-button-outlined mr-2 mb-2 w-3rem"></Button>
                                    </div>

                                    <div class="pb-3 flex gap-3">
                                        <div>
                                            <p class="text-xl">เลือกประเภทงาน:</p>
                                            <Dropdown v-model="m.task_type_id" :options="task_type"
                                                optionLabel="task_type_name" optionValue="task_type_id"
                                                placeholder="เลือกประเภท" id="withoutgrouping" class="w-full md:w-20rem" />
                                        </div>

                                        <div v-if="showdropdonw && m.task_type_id != 1">
                                            <p class="text-xl">เลือกผู้รับผิดชอบ:</p>
                                            <Dropdown v-model="m.user_id" :options="users" filter optionLabel="fullname"
                                                optionValue="email" placeholder="เลือกประเภท" id="withoutgrouping"
                                                class="w-full md:w-20rem" />
                                        </div>
                                    </div>

                                    <div class="grid">
                                        <div class="sm:col-12 md:col-4 lg:col-2 xl:col-2">
                                            <p class="text-xl">ชื่องาน</p>
                                            <span class="p-float-label">
                                                <InputText id="username" type="text" v-model="m.task_title" />
                                                <label for="username">ชื่องาน</label>
                                            </span>
                                        </div>
                                        <div class="sm:col-12 md:col-4 lg:col-3 xl:col-3">
                                            <p class="text-xl">รายละเอียดงาน</p>
                                            <span class="p-float-label">
                                                <Textarea id="username" v-model="m.task_detail" rows="1" cols="10" />
                                                <label for="username">รายละเอียดงาน</label>
                                            </span>
                                        </div>

                                        <div class="sm:col-12 md:col-4 lg:col-3 xl:col-3">
                                            <p class="text-xl">วันที่เริ่มงาน</p>
                                            <Calendar v-model="m.start_date" showButtonBar showIcon dateFormat="yy-mm-dd" />
                                        </div>
                                        <div class="sm:col-12 md:col-4 lg:col-3 xl:col-3">
                                            <p class="text-xl">กำหนดเสร็จ</p>
                                            <Calendar v-model="m.end_date" showButtonBar showIcon dateFormat="yy-mm-dd" />
                                        </div>
                                        <div class="sm:col-12 md:col-4 lg:col-1 xl:col-1">
                                            <p class="text-xl">ชั่วโมงทำงานจริง</p>
                                            <span class="p-float-label">
                                                <InputText id="username" type="number" v-model="m.real_work" />
                                                <label for="username">ชั่วโมงทำงานจริง</label>
                                            </span>
                                        </div>
                                        <div class="col-12">
                                            <p class="text-xl">อำอธิบายเพิ่มเติม</p>
                                            <Editor v-model="m.remark" :style="{ height: '10%' }" :init="tinymceSettings">
                                                <template #toolbar>
                                                    <span class="ql-formats">
                                                        <button class="ql-bold"></button>
                                                        <button class="ql-italic"></button>
                                                        <button class="ql-underline"></button>
                                                    </span>
                                                </template>
                                            </Editor>
                                        </div>
                                        <div class="sm:col-12 md:col-12 lg:col-12 xl:col-12">
                                            <h3>ไฟล์แนบ</h3>
                                            <div class="flex flex-wrap p-0 sm:p-5 gap-5">

                                            </div>
                                            <FileUpload name="demo[]" :customUpload="true" :multiple="true"
                                                accept="image/*,.pdf,.xlsx,.doc" :maxFileSize="1000000"
                                                @select="onSelectedFiles($event, m)">
                                                <template #header="{ chooseCallback, clearCallback, files }">
                                                    <div
                                                        class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                                                        <div class="flex gap-2">
                                                            <Button @click="chooseCallback()" icon="pi pi-cloud-upload"
                                                                class="p-button-rounded p-button-info p-button-outlined mr-2 mb-2 w-3rem"></Button>
                                                            <!-- <Button @click="uploadEvent(uploadCallback)"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            icon="pi pi-cloud-upload"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            class="p-button-rounded p-button-success p-button-outlined mr-2 mb-2 w-3rem"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            :disabled="!files || files.length === 0"></Button> -->
                                                            <Button @click="clearCallback()" icon="pi pi-times"
                                                                class="p-button-rounded p-button-danger p-button-outlined mr-2 mb-2 w-3rem"
                                                                :disabled="!files || files.length === 0"></Button>
                                                        </div>
                                                        <!-- <ProgressBar :value="totalSizePercent" :showValue="false" :class="['md:w-20rem h-1rem w-full md:ml-auto', { 'exceeded-progress-bar': totalSizePercent > 100 }]"><span class="white-space-nowrap">{{ totalSize }}B / 1Mb</span></ProgressBar> -->
                                                    </div>
                                                </template>
                                                <template #content="{ files, uploadedFiles, removeFileCallback }">
                                                    <div v-if="files.length > 0">
                                                        <h5>Pending</h5>
                                                        <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                                                            <div v-for="(file, index) of files"
                                                                :key="file.name + file.type + file.size"
                                                                class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                                                                <div>
                                                                    <img role="presentation" :alt="file.name" :src="file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/gif' ? file.objectURL : file.type == 'application/pdf' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/640px-PDF_file_icon.svg.png' :
                                                                        file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? 'https://play-lh.googleusercontent.com/37EzETO6gZyKmCg2kBIFX1e9gkubxZrVa5fHJ6yOaa7VvEShHjKv2RdtwnZt9Sk258s' : file.type == 'application/msword' ? 'https://play-lh.googleusercontent.com/9kABykeGovHPy-dN19lRxxnCp8IZK3Pkl8qLFNxrEe-hhKVZeiyhTBEIRUt6t-vhxQ' : ''
                                                                    " height="50" class="shadow-2" />
                                                                </div>
                                                                <span class="font-semibold">{{ file.name }}</span>
                                                                <div>{{ formatSize(file.size) }}</div>
                                                                <Badge value="Pending" severity="warning" />
                                                                <Button icon="pi pi-times"
                                                                    @click="onRemoveTemplatingFile(file, removeFileCallback, index, m)"
                                                                    class="p-button-rounded p-button-danger p-button-outlined mr-2 mb-2 w-3rem" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div v-if="uploadedFiles.length > 0">
                                                        <h5>Completed</h5>
                                                        <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                                                            <div v-for="(file, index) of uploadedFiles"
                                                                :key="file.name + file.type + file.size"
                                                                class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                                                                <div>
                                                                    <img role="presentation" :alt="file.name" :src="file.type == 'image/png' ? file.objectURL : file.type == 'application/pdf' ? '' :
                                                                        file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? '' : file.type == 'application/msword' ? '' : ''
                                                                    " height="50" class="shadow-2" />
                                                                </div>
                                                                <span class="font-semibold">{{ file.name }}</span>
                                                                <div>{{ formatSize(file.size) }}</div>
                                                                <Badge value="Completed" class="mt-3" severity="success" />
                                                                <Button icon="pi pi-times"
                                                                    @click="onRemoveTemplatingFile(file, removeFileCallback, index, m)"
                                                                    class="p-button-rounded p-button-danger p-button-outlined mr-2 mb-2 w-3rem" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                                <template #empty>
                                                    <div class="flex align-items-center justify-content-center flex-column">
                                                        <i
                                                            class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400" />
                                                        <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
                                                    </div>
                                                </template>
                                            </FileUpload>
                                        </div>
                                    </div>

                                </div>

                            </div>




                        </div>

                    </div>
                </div>
            </div>
        </Sidebar>
        <Sidebar v-model:visible="view_detail" style="font-family: Kanit;" maximizable modal header="รายละเอียดงาน"
            :style="{ width: '100vw' }">
            <template #header>

                <div class="flex justify-content-between align-items-center w-60rem  gap-6">
                    <div>
                        <p class="text-6xl font-semibold">{{ headeronview }}</p>
                    </div>

                    <div v-if="on_edit_task">
                        <Button label="บันทึก" icon="pi pi-check" class="p-button-success m-1" aria-label="Filter"
                            @click="save_edit(data_view)" />
                    </div>


                </div>
            </template>
            <div class="flex gap-5 flex-column-reverse md:flex-row">

                <div class="flex-auto p-fluid grid">

                    <div class="sm:col-12 md:col-12 lg:col-12 xl:col-12">
                        <div class="mt-5" v-for="(m, index) in data_view" :key="index">

                            <div class="flex justify-content-between">
                                <h3>กรอกรายละเอียดงาน</h3>
                            </div>

                            <div class="pb-3">
                                <p class="text-xl">เลือกประเภทงาน:</p>
                                <Dropdown v-model="m.task_type_id" :options="task_type" optionLabel="task_type_name"
                                    optionValue="task_type_id" placeholder="เลือกประเภท" id="withoutgrouping"
                                    class="w-full md:w-20rem" />
                            </div>
                            <div class="grid">
                                <div class="sm:col-12 md:col-4 lg:col-2 xl:col-2">
                                    <p class="text-xl">ชื่องาน</p>
                                    <span class="p-float-label">
                                        <InputText id="username" type="text" v-model="m.task_title" />
                                        <label for="username">ชื่องาน</label>
                                    </span>
                                </div>
                                <div class="sm:col-12 md:col-4 lg:col-3 xl:col-3">
                                    <p class="text-xl">รายละเอียดงาน</p>
                                    <span class="p-float-label">
                                        <Textarea id="username" v-model="m.task_detail" rows="1" cols="10" />
                                        <label for="username">รายละเอียดงาน</label>
                                    </span>
                                </div>

                                <div class="sm:col-12 md:col-4 lg:col-3 xl:col-3">
                                    <p class="text-xl">วันที่เริ่มงาน</p>
                                    <Calendar v-model="m.start_date" showButtonBar showIcon dateFormat="yy-mm-dd" />
                                </div>
                                <div class="sm:col-12 md:col-4 lg:col-3 xl:col-3">
                                    <p class="text-xl">กำหนดเสร็จ</p>
                                    <Calendar v-model="m.end_date" showButtonBar showIcon dateFormat="yy-mm-dd" />
                                </div>
                                <div class="sm:col-12 md:col-4 lg:col-1 xl:col-1">
                                    <p class="text-xl">ชั่วโมงทำงานจริง</p>
                                    <span class="p-float-label">
                                        <InputText id="username" type="number" v-model="m.real_work" />
                                        <label for="username">ชั่วโมงทำงานจริง</label>
                                    </span>
                                </div>
                                <div class="col-12">
                                    <p class="text-xl">อำอธิบายเพิ่มเติม</p>
                                    <Editor v-if="on_edit_task" v-model="m.remark" :style="{ height: '100vh' }"
                                        :init="tinymceSettings" :disabled="!on_edit_task">
                                        <template #toolbar>
                                            <span class="ql-formats">
                                                <button class="ql-bold"></button>
                                                <button class="ql-italic"></button>
                                                <button class="ql-underline"></button>
                                            </span>
                                        </template>
                                    </Editor>
                                    <div v-if="!on_edit_task" v-html="m.remark"></div>
                                </div>
                                <div class="sm:col-12 md:col-12 lg:col-12 xl:col-12">
                                    <h3>ไฟล์แนบ</h3>
                                    <DataTable v-if="typeof m.file == 'object'" :value="m.file">
                                        <Column field="#" header="#" class=" justify-content-center">
                                            <template #body="{ data }">
                                                <img :src="!data ? '' : data.split('/')[7].split('.')[1] == 'pdf' ?
                                                    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/640px-PDF_file_icon.svg.png'
                                                    : data.split('/')[7].split('.')[1] == 'xlsx' ?
                                                        'https://play-lh.googleusercontent.com/37EzETO6gZyKmCg2kBIFX1e9gkubxZrVa5fHJ6yOaa7VvEShHjKv2RdtwnZt9Sk258s'
                                                        : data.split('/')[7].split('.')[1] == 'doc' ?
                                                            'https://play-lh.googleusercontent.com/9kABykeGovHPy-dN19lRxxnCp8IZK3Pkl8qLFNxrEe-hhKVZeiyhTBEIRUt6t-vhxQ'
                                                            : 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png'"
                                                    alt="" height="30">
                                            </template>
                                        </Column>
                                        <Column header="ชื่อไฟล์" class="flex justify-content-center"
                                            :style="{ height: '7rem' }">
                                            <template #body="{ data }">
                                                <a :href="data" target="_blank">{{ data ? data.split('/')[7] : '' }}</a>
                                            </template>
                                        </Column>

                                        <Column field="category" header="ชนิด">
                                            <template #body="{ data }">
                                                {{ data ? data.split('/')[7].split('.')[1] : '' }}
                                            </template>
                                        </Column>
                                        <Column v-if="on_edit_task" field="" header="ลบ">
                                            <template #body="{ data }">
                                                <Button icon="pi pi-times"
                                                    class="p-button-rounded p-button-danger p-button-outlined mr-2 mb-2 w-3rem"
                                                    aria-label="ลบ" @click="confirm2($event, data, m)" />
                                            </template>
                                        </Column>

                                    </DataTable>
                                    <img v-if="typeof m.file == 'string'" :src="m.file" alt="">
                                    <h3 v-if="on_edit_task">อัพไฟล์แนบเพิ่ม</h3>
                                    <FileUpload v-if="on_edit_task" name="demo[]" :customUpload="true" :multiple="true"
                                        accept="image/*,.pdf,.xlsx,.doc" :maxFileSize="1000000"
                                        @select="onSelectedFiles($event, m)">
                                        <template #header="{ chooseCallback, clearCallback, files }">
                                            <div
                                                class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                                                <div class="flex gap-2">
                                                    <Button @click="chooseCallback()" icon="pi pi-cloud-upload"
                                                        class="p-button-rounded p-button-info p-button-outlined mr-2 mb-2 w-3rem"></Button>
                                                    <!-- <Button @click="uploadEvent(uploadCallback)"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            icon="pi pi-cloud-upload"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            class="p-button-rounded p-button-success p-button-outlined mr-2 mb-2 w-3rem"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            :disabled="!files || files.length === 0"></Button> -->
                                                    <Button @click="clearCallback()" icon="pi pi-times"
                                                        class="p-button-rounded p-button-danger p-button-outlined mr-2 mb-2 w-3rem"
                                                        :disabled="!files || files.length === 0"></Button>
                                                </div>
                                                <!-- <ProgressBar :value="totalSizePercent" :showValue="false" :class="['md:w-20rem h-1rem w-full md:ml-auto', { 'exceeded-progress-bar': totalSizePercent > 100 }]"><span class="white-space-nowrap">{{ totalSize }}B / 1Mb</span></ProgressBar> -->
                                            </div>
                                        </template>
                                        <template #content="{ files, uploadedFiles, removeFileCallback }">
                                            <div v-if="files.length > 0">
                                                <h5>Pending</h5>
                                                <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                                                    <div v-for="(file, index) of files"
                                                        :key="file.name + file.type + file.size"
                                                        class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                                                        <div>
                                                            <img role="presentation" :alt="file.name" :src="file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/gif' ? file.objectURL : file.type == 'application/pdf' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/640px-PDF_file_icon.svg.png' :
                                                                file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? 'https://play-lh.googleusercontent.com/37EzETO6gZyKmCg2kBIFX1e9gkubxZrVa5fHJ6yOaa7VvEShHjKv2RdtwnZt9Sk258s' : file.type == 'application/msword' ? 'https://play-lh.googleusercontent.com/9kABykeGovHPy-dN19lRxxnCp8IZK3Pkl8qLFNxrEe-hhKVZeiyhTBEIRUt6t-vhxQ' : ''
                                                            " height="50" class="shadow-2" />
                                                        </div>
                                                        <span class="font-semibold">{{ file.name }}</span>
                                                        <div>{{ formatSize(file.size) }}</div>
                                                        <Badge value="Pending" severity="warning" />
                                                        <Button icon="pi pi-times"
                                                            @click="onRemoveTemplatingFile(file, removeFileCallback, index, m)"
                                                            class="p-button-rounded p-button-danger p-button-outlined mr-2 mb-2 w-3rem" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div v-if="uploadedFiles.length > 0">
                                                <h5>Completed</h5>
                                                <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                                                    <div v-for="(file, index) of uploadedFiles"
                                                        :key="file.name + file.type + file.size"
                                                        class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                                                        <div>
                                                            <img role="presentation" :alt="file.name" :src="file.type == 'image/png' ? file.objectURL : file.type == 'application/pdf' ? '' :
                                                                file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? '' : file.type == 'application/msword' ? '' : ''
                                                            " height="50" class="shadow-2" />
                                                        </div>
                                                        <span class="font-semibold">{{ file.name }}</span>
                                                        <div>{{ formatSize(file.size) }}</div>
                                                        <Badge value="Completed" class="mt-3" severity="success" />
                                                        <Button icon="pi pi-times"
                                                            @click="onRemoveTemplatingFile(file, removeFileCallback, index, m)"
                                                            class="p-button-rounded p-button-danger p-button-outlined mr-2 mb-2 w-3rem" />
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                        <template #empty>
                                            <div class="flex align-items-center justify-content-center flex-column">
                                                <i
                                                    class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400" />
                                                <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
                                            </div>
                                        </template>
                                    </FileUpload>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </Sidebar>

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