<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CustomerService from '@/service/CustomerService';
import ProductService from '@/service/ProductService';
import { ref, onMounted, onBeforeMount, nextTick } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import config from '@/service/config';
import moment from 'moment';
import L from 'leaflet';
import { useToast } from 'primevue/usetoast';
import Service from '../../../service/api';
import { useRouter } from 'vue-router';
import { useStore } from '../../../store';
const service = new Service()
const store = useStore();
const { contextPath } = useLayout();
const dt = ref()
const customer1 = ref(null);
const customer2 = ref(null);
const customer3 = ref(null);
const filters1 = ref(null);
const router = useRouter();
const loading1 = ref(null);
const loading2 = ref(null);
const toast = useToast();
const idFrozen = ref(false);
const products = ref(null);
const visibleFull = ref(false);
const marker = ref([]);
const map_ = ref(null);
const expandedRows = ref([]);
const displayConfirmation = ref(false);
const message = ref();
const pin_icon = ref(null);
const datadialog = ref(null);
const subdivision = ref();
const mapContainer = ref(null);
const edit_data = ref();
const showreport = ref(false);
const data_on_report = ref({
    select_type_report: '',
    select_type_complain: '',
    start_date: '',
    end_date: ''
})
const data = ref({
    agency_that_forwards: '',
    detail_patient: '',
    select_more_agnecy: '',
    select_more: '',
    select_lavel: ''
})
const categories_ = ref([
    { name: 'โรงพยาบาล', key: 'H' },
    { name: 'กู้ภัย', key: 'R' },
    { name: 'ตำรวจ', key: 'P' },
    { name: 'อื่นๆ', key: 'M' }
]);
const categories = ref([
    { name: 'เร่งด่วน', key: 'A' },
    { name: 'ปานกลาง', key: 'M' },
]);
const selectedCategory = ref(categories.value[1].name);
const get_subdivision = async () => {
    const res = await service.post('/read/get_subdivison', {});
    if (res.message == 'success') {
        subdivision.value = res.data;
        console.log(subdivision.value);
    }
}
const statuses = ref(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);
const representatives = ref([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);
const type_report = ref([
    {
        report_type_id: 1,
        report_type_name: 'excel'
    },
    {
        report_type_id: 2,
        report_type_name: 'print pdf'
    },

])
const exportCSV = async () => {

    console.log(data_on_report.value);
    const res = await service.post('/read/get_notify_on_report', { start_date: data_on_report.value.start_date, end_date: data_on_report.value.end_date });
    if (res.message == 'success') {
        const data_report = res.data.map((e, i) => {
            return {
                'ลำดับ': i + 1,
                'ชื่อ-นามสกุลผู้ป่วย': e.fristname + ' ' + e.lastname,
                'ชื่ออุปกรณ์/IPอุปกรณ์': e.device_name + '/' + e.device_ip,
                'เวลาที่เกิดแจ้งเตือน': e.time_event,
                'สถานะการดำเนินการ': e.status_noti,
            }
        })
        store.data_report = { data: data_report, header: `รายงานการแจ้งเตือนระหว่าง ${moment(data_on_report.value.start_date).format('DD/MM/YYYY')} ถึง ${moment(data_on_report.value.end_date).format('DD/MM/YYYY')}`, type: 'noti', name_excel: 'รายงานแจ้งเตือนฉุกเฉิน' }
        if (data_report.length > 0 && data_on_report.value.select_type_report == 2) {
            return router.push('/report_pdf')
        }
        if (data_report.length > 0 && data_on_report.value.select_type_report == 1) {
            return router.push('/report_export')
        }
        return toast.add({ severity: 'warn', summary: 'ไม่มีข้อมูลที่คุณเลือก', life: 2000 });
    }
};

const get_data_notification = async () => {
    const res = await service.post('/read/get-notify', {});
    if (res.message == 'success') {
        customer1.value = res.data;
        console.log(customer1.value);
    }
}
onMounted(() => {
    get_data_notification();
    get_subdivision();
})
onBeforeMount(() => {
    initFilters1();
});

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        ni_id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

    };
};

const clearFilter1 = () => {
    initFilters1();
};

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
const getMarker = (data) => {
    console.log(data);
    map_.value.setView([data.device[0].latitude, data.device[0].longgitude], 15);
    console.log(data);
    const myIcon = L.icon({
        iconUrl: `${config.backend_url_img}/resources/assets/mian-icon/default/icon-map/alert.gif`,
        iconSize: [80, 80],
        iconAnchor: [22, 94],
        popupAnchor: [18, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94],
    });

    const map = map_.value;
    let marker_ = L.marker([data.device[0].latitude, data.device[0].longgitude], {
        icon: myIcon,
    }).addTo(map)
        .bindPopup(`<div class="grid p-fluid" style="font-size:1.2rem;color:var(--text-color);width:20rem;">
    <div class="col-12 md:col-12">
    <div><span>ชื่อ-นามสกุล</span> ${data.pat[0].fristname + " " + data.pat[0].lastname} อายุ ${moment(new Date()).format("YYYY") - moment(data.pat[0].patient_birthday).format("YYYY")}<br>
    
    </div>
     </div>
    </div>
    `);
    marker_.on("mouseover", (e) => {
        marker_.openPopup();
    });
    marker_.on('click', () => {
        map.flyTo(marker_.getLatLng(), 18, { animate: true, duration: 1.5 });
        link_share_location.value = `https://www.google.com/maps/place/${data.device[0].latitude},${data.device[0].longgitude}`
        navigator.clipboard.writeText(link_share_location.value);
        toast.add({ severity: 'success', summary: 'Copy ลิงค์แชร์ตำแหน่งผู้ป่วยเรียบร้อย', detail: 'คุณสามารถนำลิงค์ที่ได้งานได้เลย เช่น วางบน Bowser จะนำคุณไปยัง GoogleMap', life: 5000 });
    });
    marker.value.push(marker_);
    //link share google map// https://www.google.com/maps/place/[latitude],[longitude]
}
const getMap = () => {
    var LeafIcon = L.Icon.extend({
        options: {
            iconSize: [26, 26],
            shadowSize: [16, 16],
        },
    });
    const map = L.map(mapContainer.value, {
        center: [message.value.device[0]?.latitude, message.value.device[0]?.longgitude],
        zoom: 7,
        maxZoom: 20,
        layers: [L.tileLayer(`https://www.deemap.com/DeeMap/gwc/service/tms/1.0.0/DeeMap2_THA_Map_No_POI@EPSG%3A900913@png8/{z}/{x}/{-y}.png8`)],
        zoomControl: false,
    })

    pin_icon.value = new LeafIcon({
        iconUrl: 'http://localhost:3010/resources/assets/mian-icon/default/icon-map/Pin_alt.png',
        popupAnchor: [0, -5],
    });


    L.control
        .zoom({
            position: `bottomright`,
        })
        .addTo(map);
    marker.value = [];
    map_.value = map;
    getMarker(message.value);

}
const calculateCustomerTotal = (name) => {
    let total = 0;
    if (customer3.value) {
        for (let customer of customer3.value) {
            if (customer.representative.name === name) {
                total++;
            }
        }
    }

    return total;
};
const openviewdetailnoti = async (e, data) => {
    console.log(data);
    data.agency_more = JSON.parse(data.agency_more)
    data.internal_division = JSON.parse(data.internal_division)
    datadialog.value = { ...data }
    displayConfirmation.value = true;
}
const edit = async (data_) => {
    console.log(data_);
    edit_data.value = { ...data_ }
    const res = await service.post('/read/getData_notify', { device_ip: data_.device_ip, pat_id: data_.pat_id });
    if (res.message == 'success') {
        message.value = res.data;
        visibleFull.value = true;
        await nextTick();
        getMap();
        message.value.pat[0].disease = JSON.parse(message.value.pat[0].disease)
        data.value.detail_patient = data_.detail_patient
        data.value.select_lavel = data_.lavel
        data.value.select_more = JSON.parse(data_.agency_more)
        data.value.select_more_agnecy = JSON.parse(data_.internal_division)
        data.value.agency_that_forwards = data_.detail_deliver
    }
}
const save = async (data, message_) => {
    console.log(edit_data.value);
    debugger
    const pay = {
        ni_id: edit_data.value.ni_id,
        detail_deliver: data.agency_that_forwards,
        detail_patient: data.detail_patient,
        lavel: data.select_lavel,
        agency_more: data.select_more,
        internal_division: data.select_more_agnecy,
        pat_data: message.value

    }
    const res = await service.post('/write/performance_record_notify', pay);
    if (res.message == 'success') {
        toast.add({ severity: 'success', summary: 'บันทึกสำเร็จ', life: 2000 });
        displayConfirmation.value = false;
        visibleFull.value = false;
    }
}
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h3>ประวัติการแจ้งเตือนทั้งหมด</h3>
                <DataTable :value="customer1" :paginator="true" class="p-datatable-gridlines text-xl"  ref="dt"
                    dataKey="ni_id" :rowHover="true" v-model:filters="filters1" filterDisplay="menu" :loading="loading1"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    :rows="5"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} " 
                    style="font-family:Kanit" :filters="filters1" responsiveLayout="scroll"
                    :globalFilterFields="['ni_id', 'fristname', 'gender', 'birthday', 'device_ip']">
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters1['global'].value" placeholder="Keyword Search"
                                    style="width: 100%" />
                            </span>
                            <div>
                                <Button icon="pi pi-external-link" label="ออกรายงาน" @click="showreport = true;" />
                            </div>

                        </div>
                    </template>
                    <template #empty> No customers found. </template>
                    <template #loading> Loading customers data. Please wait. </template>
                    <Column field="ni_id" header="#" style="min-width: 2rem" :sortable="true">
                        <template #body="{ data }">
                            {{ data.ni_id }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                                placeholder="Search by name" />
                        </template>
                    </Column>
                    <Column header="รูปประจำตัว" style="min-width: 10rem">
                        <template #body="{ data }">
                            <img :src="`${data.img_path}`" :alt="data.img_path" class="shadow-2" width="100" />
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
                    <Column field="birthday" header="อายุ" style="min-width: 5rem" :sortable="true">
                        <template #body="{ data }">
                            {{ data.birthday }}
                        </template>
                    </Column>
                    <Column field="device_ip" header="IP อุปกรณ์" style="min-width: 12rem" :sortable="true">
                        <template #body="{ data }">
                            {{ data.device_ip }}
                        </template>
                    </Column>
                    <Column field="time_event_table" header="เวลาที่เกิดแจ้งเตือน" dataType="date" style="min-width: 19rem"
                        :sortable="true">
                        <template #body="{ data }">
                            {{ data.time_event_table }}
                        </template>
                    </Column>
                    <Column field="detail_patient" header="สถานะการดำเนินการ" style="min-width: 15rem" :sortable="true">
                        <template #body="{ data }">
                            <span :class="`customer-badge status-${!data.detail_patient ? 'unqualified' : 'qualified'}`">{{
                                !data.detail_patient ? 'ไม่มีการดำเนินการจากเจ้าหน้าที่' :
                                data.detail_patient }}</span>

                        </template>
                    </Column>
                    <Column style="min-width: 12rem">
                        <template #body="{ data }">
                            <Button icon="pi pi-search" class="p-button-rounded p-button-info mr-2 mb-2"
                                @click="openviewdetailnoti($event, data)" />
                            <Button v-if="store.priority?.filter(x => x.priority_id == 8)[0]?.can_write == 1 ? true : false"
                                icon="pi pi-pencil" class="p-button-rounded p-button-warning mr-2 mb-2"
                                @click="edit(data)" />

                        </template>
                    </Column>

                </DataTable>

                <Dialog header="Dialog" v-model:visible="displayConfirmation" :breakpoints="{ '960px': '75vw' }"
                    :style="{ width: '40vw' }" :modal="true">
                    <template #header>
                        <span
                            :class="`customer-badge status-${!datadialog.detail_patient ? 'unqualified' : 'qualified'}`">{{
                                !datadialog.detail_patient ? 'ไม่มีการดำเนินการจากเจ้าหน้าที่' :
                                'มีการดำเนินการจากเจ้าหน้าที่เรียบร้อย' }}</span>
                    </template>
                    <div class="grid" style="margin: 0 auto;">
                        <div class="col-6">
                            <span>ชื่อ-นามสกุล</span>
                            <p class="line-height-3 mt-3">{{ datadialog.fristname + ' ' + datadialog.lastname }}</p>
                            <p class="line-height-3">เวลาที่เกิดแจ้งเตือน {{ datadialog.time_event }}</p>
                            <p class="text-md">หน่วยงานภายใน</p>
                            <div class="flex">
                                <div class="border-round-sm p-2 mr-2" style="background-color: aquamarine;"
                                    v-for="item in datadialog.internal_division" :key="item">{{ item }}</div>



                            </div>
                            <p class="text-md mt-2">หน่วยงานภายนอก</p>
                            <div class="flex">
                                <div class="border-round-sm p-2 mr-2" style="background-color: aquamarine;"
                                    v-for="item in datadialog.agency_more" :key="item">{{ item }}</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <span>เพศ</span>
                            <p class="line-height-2 mt-3">{{ datadialog.gender }}</p>
                        </div>
                    </div>
                    <div class="grid">
                        <div class="col-12">
                            <h5>รายละเอียดหลังจากติดต่อกับผู้ป่วย</h5>
                            <div class="border-round-sm surface-200 p-3">
                                {{ datadialog.detail_patient }}
                            </div>
                            <h5>รายละเอียดการต่อส่งไปยังหน่วยงานอื่นๆ</h5>
                            <div class="border-round-sm surface-200 p-3">
                                {{ datadialog.detail_deliver }}
                            </div>
                        </div>
                    </div>


                </Dialog>
                <Sidebar v-model:visible="visibleFull" :baseZIndex="10000" position="full">
                    <div class="grid">
                        <div class="col-3" style="outline;:1px solid red">
                            <div class="flex align-items-center justify-content-center">
                                <img :src="message.pat[0].img_path" alt="" height="150">
                            </div>
                            <div class="col-12 mt-8 mb-8 p-2 md:p-8"
                                style="border-radius: 20px; background: linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #efe1af 0%, #c3dcfa 100%);font-family: Kanit;">
                                <!-- <div class="flex flex-column justify-content-center align-items-center px-3 py-3 md:py-0"> -->
                                <h3 class="text-gray-1000 mb-2 text-4xl">รายละเอียดผู้ป่วย</h3>
                                <p class="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-4"
                                    style="max-width: 800px">
                                    ชื่อ-นามสกุล {{ message.pat[0].fristname + ' ' + message.pat[0].lastname }}
                                </p>
                                <h3 class="text-gray-1000 mb-2 text-3xl">ที่อยุ่</h3>
                                <p class="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-4"
                                    style="max-width: 800px">
                                    บ้านเลขที่ {{ message.pat[0].member }} ถนน {{ message.pat[0].road }} ซอย {{
                                        message.pat[0].alley
                                    }}
                                    อ.{{ message.pat[0].dis_name_in_thai }}
                                    ต.{{ message.pat[0].sub_name_in_thai }} จ.{{ message.pat[0].pro_name_in_thai }} {{
                                        message.pat[0].postal_code }}
                                </p>
                                <h3 class="text-gray-1000 mb-2 text-3xl">โรค</h3>
                                <ul class="list-decimal">
                                    <li class="text-2xl" v-for="item in message.pat[0].disease" :key="item">
                                        {{ item.cd_name }}
                                    </li>
                                </ul>
                                <h3 class="text-gray-1000 mb-2 text-3xl">อุปกรณ์</h3>
                                <ul class="list-decimal">
                                    <li class="text-2xl" v-for="item in message.device" :key="item">
                                        IP@ {{ item.device_ip }} ชื่ออุปกณ์ {{ item.device_name }} ประเภท ปุ่ม
                                    </li>
                                </ul>
                                <!-- <img src="/demo/images/landing/peak-logo.svg" class="mt-4" alt="Company logo" /> -->

                                <!-- </div> -->
                            </div>
                        </div>
                        <div class="col-6" style="outline;:1px solid red">
                            <div style="overflow: hidden;" id="map_" ref="mapContainer"></div>
                        </div>
                        <div class="col-3" style="outline;:1px solid red">

                            <div>
                                <h3 class="text-gray-1000 mb-2 text-3xl">ระดับการแจ้งเตือน</h3>
                                <div class="grid mt-4">
                                    <div v-for="category of categories" :key="category.key" class="field-radiobutton col-6">
                                        <RadioButton :inputId="category.key" name="category" :value="category.name"
                                            v-model="data.select_lavel" :disabled="category.key === 'P'" />
                                        <label :for="category.key">{{ category.name }}</label>
                                    </div>

                                </div>
                                <h3 class="text-gray-1000 mb-2 text-3xl">ส่งต่อเรื่องไปยังหน่วยงานภายใน</h3>
                                <div class="grid mt-4">
                                    <div v-for="sub of subdivision" :key="sub" class="field-checkbox col-6">
                                        <Checkbox :inputId="sub.subdivision_id" name="category"
                                            :value="sub.subdivision_name" v-model="data.select_more_agnecy" />
                                        <label :for="sub.subdivision_id">{{ sub.subdivision_name }}</label>
                                    </div>
                                </div>
                                <h3 class="text-gray-1000 mb-2 text-3xl">ส่งต่อเรื่องไปยังหน่วยงานภายนอก</h3>
                                <div class="grid mt-4">
                                    <div v-for="category of categories_" :key="category.key" class="field-checkbox col-6">
                                        <Checkbox :inputId="category.key" name="category" :value="category.name"
                                            v-model="data.select_more" />
                                        <label :for="category.key">{{ category.name }}</label>
                                    </div>
                                </div>
                                <h3 class="text-gray-1000 mb-4 text-3xl">รายละเอียดหลังติดต่อกับผู้แลติดผู้ป่วย</h3>
                                <Textarea v-model="data.detail_patient" rows="5" cols="65" />
                                <h3 class="text-gray-1000 mb-4 text-3xl">รายละเอียดการส่งต่อไปยังหน่วยงานอื่นๆ</h3>
                                <Textarea v-model="data.agency_that_forwards" rows="5" cols="65" />
                                <br>
                                <br>
                                <div class="flex justify-content-end">
                                    <Button class="p-button-success p-3" @click="save(data, message)">บันทึก</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Sidebar>
                <Toast />
            </div>
        </div>
        <Dialog header="เลือกรูปแบบรายงาน" v-model:visible="showreport" :breakpoints="{ '1080px': '75vw' }"
            :style="{ width: '45vw' }" :modal="true" style="font-family:Kanit">
            <div class="grid p-fluid">

                <div class="col-12 md:col-6 sm:col-12">
                    <p>เลือกวันเริ่มต้น</p>
                    <Calendar v-model="data_on_report.start_date" showIcon dateFormat="yy-mm-dd" />

                </div>
                <div class="col-12 md:col-6 sm:col-12">
                    <p>เลือกวันสิ้นสุด</p>
                    <Calendar v-model="data_on_report.end_date" showIcon dateFormat="yy-mm-dd" />
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

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';

::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}

#map {
    width: 100%;
    height: 400px;
    border-radius: 10px;
    margin-top: 15px;
}

#map_ {
    width: 100%;
    height: 90vh;
    border-radius: 10px;
    margin-top: 15px;
}
</style>
