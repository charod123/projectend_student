

<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Multimonth from '@fullcalendar/multimonth';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import moment from 'moment';
import { useStore } from "../../../../store";
import { useToast } from 'primevue/usetoast';
import Service from '../../../../service/api';
const service = new Service();
const evnet_task = ref();
const evnet_backup = ref();
const store = useStore();
const view_detail = ref(false);
const task_type = ref();
const show_input_end_task = ref(false);
const event = ref();
const event_resources = ref();
const end_task = ref();
const tasks = ref();
const toast = useToast();
const showbtn = ref(false);
const header_end_task = ref('เหตุผลที่จบงาน');
const subdivision = ref();

onBeforeMount(() => {
})

onMounted(() => {
    get();
})

const get = async () => {
    const res = await service.post('/read/get_type_task', {});
    if (res.message == 'success') {
        task_type.value = res.data;
    }
    const sub = await service.post('/read/get_subdivison', {});
    if (sub.message == 'success') {
        subdivision.value = sub.data[0];
    }

}
const ddd = async () => {
    const task_ = await service.post('/read/get_task', {});
    if (task_.message == 'success') {
        console.log(task_.data);
        event_resources.value = task_.data.map(e => {
            return {
                id: e.task_id,
                title: e.opener_task,
                eventColor: e.status == 1 ? 'blue' : e.status == 2 ? 'orange' : e.status == 3 ? 'grey' : e.status == 8 ? 'help' : 'red',
            }
        })
        return event_resources.value
    }
}

const options_ = ref({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, Multimonth, resourceTimelinePlugin],
    initialDate: moment().format("YYYY-MM-DD"),
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: JSON.parse(sessionStorage.getItem('priority'))[0].role_id == 1 ? 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth' : 'dayGridMonth,dayGridWeek,dayGridDay,multiMonthYear'
    },
    locale: 'th',
    timeZone: 'Bangkok',
    resourceAreaHeaderContent: 'พนักงาน',
    resources: async () => await ddd(),
    events: async () => {
        JSON.parse(sessionStorage.getItem('priority'))[0].role_id == 1 ? showbtn.value = true : false
        const task_ = await service.post('/read/get_task', {});
        if (task_.message == 'success') {
            evnet_task.value = task_.data;
            evnet_backup.value = task_.data
            event.value = task_.data.map(e => {
                return {
                    id: e.task_id,
                    title: e.task_title,
                    start: moment(e.start_date, 'YYYY-MM-DD').format("YYYY-MM-DD"),
                    end: moment(e.end_date, 'YYYY-MM-DD').format("YYYY-MM-DD"),
                    resourceId: e.task_id
                }
            })
            return event.value
        }
    },
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventClick: (e) => {
        const task_id = e.event._def.publicId
        evnet_task.value = evnet_backup.value.filter(x => x.task_id == task_id)
        if (evnet_task.value.length > 0) {
            view_detail.value = true;
        }
    },
    // select:  (e) => {
    //     console.log(e);
    // },

});
const update_task = async (data) => {
    if (data.status == 8 || data.status == 2) {
        tasks.value = data;
        if (data.status == 2) {
            header_end_task.value = 'ข้อแนะนำ'
            return show_input_end_task.value = true;
        }
        header_end_task.value = 'เหตุผลที่จบงาน'
        return show_input_end_task.value = true;
    }
    tasks.value = null;
    const res = await service.post('/write/update_status_task', { status: data.status, task_id: data.task_id });
    if (res.message == 'success') {
        data.status = res.data[0].status;
        get();
        ddd();
    }
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
const save_end_task = async (data) => {
    const res = await service.post('/write/update_end_task', { task: tasks.value, end_task: data });
    if (res.message == 'success') {
        get();
        ddd();
        show_input_end_task.value = false;
        view_detail.value = false
        window.location.reload();
        return toast.add({ severity: 'success', summary: res.message, life: 3000 });
    }
}

// const option = ref({
//     plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, Multimonth],

//     headerToolbar: {
//         left: 'prev,next today',
//         center: 'title',
//         right: 'dayGridMonth,dayGridWeek,dayGridDay,multiMonthYear'
//     },
//     locale: 'th',
//     events: [
//         { "id": 1, "title": "All Day Event", "start": "2017-02-01", resourceId: 'a', commad: () => test('ds'), "eventColor": "red" },
//         { "id": 2, "title": "Long Event", "start": "2017-02-07", "end": "2017-02-10", resourceId: 'd1', eventColor: 'red' },
//         { "id": 3, "title": "Repeating Event", "start": "2017-02-09T16:00:00", resourceId: 'g' },
//         { "id": 4, "title": "Repeating Event", "start": "2017-02-16T16:00:00" },
//         { "id": 5, "title": "Conference", "start": "2017-02-11", "end": "2017-02-13" },
//         { "id": 6, "title": "Meeting", "start": "2017-02-12T10:30:00", "end": "2017-02-12T12:30:00" },
//         { "id": 7, "title": "Lunch", "start": "2017-02-12T12:00:00" },
//         { "id": 8, "title": "Meeting", "start": "2017-02-12T14:30:00" },
//         { "id": 9, "title": "Happy Hour", "start": "2017-02-12T17:30:00" },
//         { "id": 10, "title": "Dinner", "start": "2017-02-12T20:00:00" },
//         { "id": 11, "title": "Birthday Party", "start": "2017-02-13T07:00:00" },
//         { "id": 12, "title": "Click for Google", "start": "2017-02-28" }
//     ],
//     timeZone: 'Bangkok',
//     resourceAreaHeaderContent: 'Rooms',
//     initialDate: moment().format("YYYY-MM-DD"),
//     selectable: true,
//     selectMirror: true,
//     dayMaxEvents: true
// })

</script>



<template>
    <div>
        <div class="flex justify-content-center">
            <h1>เทศบาล {{ subdivision?.division_name }} &nbsp;&nbsp; หน่วยงาน {{ subdivision?.subdivision_name }}</h1>
        </div>
        <FullCalendar :events="events" :options="options_" />
        <Dialog v-model:visible="view_detail" style="font-family: Kanit;" maximizable modal header="รายละเอียดงาน"
            :style="{ width: '100vw' }">
            <template #header>

                <div class="flex justify-content-between align-items-center w-60rem  gap-6">
                    <div>
                        <p class="text-6xl font-semibold">รายละเอียดงาน</p>
                    </div>

                    <div v-if="on_edit_task">
                        <Button label="บันทึก" icon="pi pi-check" class="p-button-success m-1" aria-label="Filter"
                            @click="save_edit(data_view)" />
                    </div>


                </div>
            </template>
            <div class="flex gap-5 flex-column-reverse md:flex-row">

                <div class="flex-auto p-fluid grid max-w-full">

                    <div class="sm:col-12 md:col-12 lg:col-12 xl:col-12">
                        <div class="mt-5" v-for="(m, index) in evnet_task" :key="index">

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
                                <DataTable :value="evnet_task" class="col-12">
                                    <Column field="task_id" header="#">
                                    </Column>
                                    <Column field="task_title" header="หัวข้องาน">
                                    </Column>
                                    <Column field="task_detail" header="รายละเอียดงาน">
                                    </Column>
                                    <Column field="person_responsible" header="ผู้รับผิดชอบ">
                                        <template #body="{ data }">
                                            {{ data.person_responsible }}
                                        </template>
                                    </Column>
                                    <Column field="start_date" header="วันที่เริ่มต้น">
                                        <template #body="{ data }">
                                            {{ $moment(data.start_date, 'YYYY-MM-DD').format("YYYY-MM-DD") }}
                                        </template>
                                    </Column>
                                    <Column field="end_date" header="วันที่สิ้นสุด">
                                        <template #body="{ data }">
                                            {{ $moment(data.end_date, 'YYYY-MM-DD').format("YYYY-MM-DD") }}
                                        </template>
                                    </Column>
                                    <Column field="end_date" header="เหลือ (วัน)">
                                        <template #body="{ data }">
                                            {{ $moment(data.end_date).diff(moment(data.start_date), 'days')
                                            }}
                                        </template>
                                    </Column>
                                    <Column field="real_work" header="ชั่วโมงทำงานจริง">
                                    </Column>
                                    <Column field="status" header="สถานะ" style="width: 15rem">
                                        <template #body="{ data }">
                                            <div v-if="!showbtn">
                                                <Button
                                                    :label="data.status == 1 ? 'รับงาน' : data.status == 8 ? 'ส่งงาน' : data.status == 3 ? 'ปิดงานแล้ว' : data.status == 0 ? 'งานยกเลิก' : 'รอดำเนินการตรวจสอบ'"
                                                    :severity="data.status == 1 ? 'info' : data.status == 8 ? 'help' : data.status == 3 ? 'secondary' : data.status == 0 ? 'danger' : 'warning'"
                                                    rounded :disabled="data.status == 2" @click="update_task(data)" />
                                            </div>
                                            <div v-if="showbtn && (data.status == 2 || data.status == 4)">
                                                <Button :label="data.status == 3 ? 'งานปิดแล้ว' : 'ปิดงาน'"
                                                    :severity="'secondary'" rounded @click="update_task(data)"
                                                    :disabled="data.status == 3" />
                                            </div>
                                            <div v-if="showbtn && (data.status != 2 && data.status != 4)">
                                                <Button
                                                    :label="data.status == 1 ? 'รับงาน' : data.status == 8 ? 'ส่งงาน' : data.status == 3 ? 'ปิดงานแล้ว' : data.status == 0 ? 'งานยกเลิก' : 'รอดำเนินการตรวจสอบ'"
                                                    :severity="data.status == 1 ? 'info' : data.status == 8 ? 'help' : data.status == 3 ? 'secondary' : data.status == 0 ? 'danger' : 'warning'"
                                                    rounded disabled />
                                            </div>

                                        </template>
                                    </Column>
                                </DataTable>
                                <div class="col-12 bg-orange-100" v-if="m.status == 2 || m.status == 3">
                                    <p class="text-xl">เหตุผลที่จบงาน</p>
                                    <div v-html="m.detail_end_html"></div>
                                </div>
                                <div class="col-12">
                                    <p class="text-xl">อำอธิบายเพิ่มเติม</p>
                                    <div v-html="m.remark"></div>
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

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </Dialog>
        <Dialog v-model:visible="show_input_end_task" style="font-family: Kanit;" maximizable modal header="เหตุผลที่จบงาน"
            :style="{ width: '50vw' }">
            <template #header>
                <div class="flex justify-content-between align-items-center w-60rem  gap-6">
                    <div>
                        <p class="text-6xl font-semibold">{{ header_end_task }}</p>
                    </div>

                </div>
            </template>
            <div class="flex gap-5 flex-column-reverse md:flex-row">

                <div class="flex-auto p-fluid grid max-w-full">

                    <div class="sm:col-12 md:col-12 lg:col-12 xl:col-12">

                        <div class="mt-5">
                            <Editor v-model="end_task" :style="{ height: '70vh' }" :init="tinymceSettings">
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
                </div>
            </div>
            <template #footer>
                <div class="flex justify-content-between align-items-center w-60rem  gap-6">
                    <div>
                    </div>
                    <div>
                        <Button label="บันทึก" icon="pi pi-check" class="p-button-success m-1" aria-label="Filter"
                            @click="save_end_task(end_task)" />
                    </div>
                </div>
            </template>
        </Dialog>
    </div>
</template>
<style scoped>
@media screen and (max-width: 960px) {
    ::v-deep(.fc-header-toolbar) {
        display: flex;
        flex-wrap: wrap;
    }
}
</style>