<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CustomerService from '@/service/CustomerService';
import ProductService from '@/service/ProductService';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import Service from '../../../service/api';
const service = new Service()
const { contextPath } = useLayout();
const dt = ref()
const customer1 = ref(null);
const customer2 = ref(null);
const customer3 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const loading2 = ref(null);
const idFrozen = ref(false);
const products = ref(null);
const expandedRows = ref([]);
const displayConfirmation = ref(false);
const datadialog = ref(null);
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
const exportCSV = () => {
    dt.value.exportCSV();
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
    datadialog.value = { ...data }
    displayConfirmation.value = true;
}
</script>

<template>
    <div class="grid">
    <div class="col-12">
        <div class="card">
            <h3>ประวัติการแจ้งเตือนทั้งหมด</h3>
            <DataTable :value="customer1" :paginator="true" class="p-datatable-gridlines text-xl" :rows="6" ref="dt"
                dataKey="ni_id" :rowHover="true" v-model:filters="filters1" filterDisplay="menu" :loading="loading1"
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
                            <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
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
                <Column field="gender"  header="เพศ" style="min-width: 5rem" :sortable="true">
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
                <Column field="time_event_table" header="เวลาที่เกิดแจ้งเตือน" dataType="date" style="min-width: 19rem" :sortable="true">
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
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning mr-2 mb-2"
                                @click="editDivision(data)" />

                        </template>
                    </Column>
                    <!-- <Column header="Agent" filterField="representative" :showFilterMatchModes="false"
                                                                                            :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                                                                                            <template #body="{ data }">
                                                                                                <img :alt="data.representative.name"
                                                                                                    :src="contextPath + 'demo/images/avatar/' + data.representative.image" width="32"
                                                                                                    style="vertical-align: middle" />

                                                                                                <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{
                                                                                                    data.representative.name
                                                                                                }}</span>
                                                                                            </template>
                                                                                            <template #filter="{ filterModel }">
                                                                                                <div class="mb-3 text-bold">Agent Picker</div>
                                                                                                <MultiSelect v-model="filterModel.value" :options="representatives" optionLabel="name"
                                                                                                    placeholder="Any" class="p-column-filter">
                                                                                                    <template #option="slotProps">
                                                                                                        <div class="p-multiselect-representative-option">
                                                                                                            <img :alt="slotProps.option.name"
                                                                                                                :src="contextPath + 'demo/images/avatar/' + slotProps.option.image"
                                                                                                                width="32" style="vertical-align: middle" />
                                                                                                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{
                                                                                                                slotProps.option.name
                                                                                                            }}</span>
                                                                                                        </div>
                                                                                                    </template>
                                                                                                </MultiSelect>
                                                                                            </template>
                                                                                        </Column> -->

                    <!-- <Column header="Balance" filterField="balance" dataType="numeric" style="min-width: 10rem">
                                                                                            <template #body="{ data }">
                                                                                                {{ formatCurrency(data.balance) }}
                                                                                            </template>
                                                                                            <template #filter="{ filterModel }">
                                                                                                <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />
                                                                                            </template>
                                                                                        </Column>
                                                                                        <Column field="status" header="Status" :filterMenuStyle="{ width: '14rem' }"
                                                                                            style="min-width: 12rem">
                                                                                            <template #body="{ data }">
                                                                                                <span :class="'customer-badge status-' + data.status">{{ data.status }}</span>
                                                                                            </template>
                                                                                            <template #filter="{ filterModel }">
                                                                                                <Dropdown v-model="filterModel.value" :options="statuses" placeholder="Any"
                                                                                                    class="p-column-filter" :showClear="true">
                                                                                                    <template #value="slotProps">
                                                                                                        <span :class="'customer-badge status-' + slotProps.value" v-if="slotProps.value">{{
                                                                                                            slotProps.value
                                                                                                        }}</span>
                                                                                                        <span v-else>{{ slotProps.placeholder }}</span>
                                                                                                    </template>
                                                                                                    <template #option="slotProps">
                                                                                                        <span :class="'customer-badge status-' + slotProps.option">{{
                                                                                                            slotProps.option
                                                                                                        }}</span>
                                                                                                    </template>
                                                                                                </Dropdown>
                                                                                            </template>
                                                                                        </Column>
                                                                                        <Column field="activity" header="Activity" :showFilterMatchModes="false" style="min-width: 12rem">
                                                                                            <template #body="{ data }">
                                                                                                <ProgressBar :value="data.activity" :showValue="false" style="height: 0.5rem"></ProgressBar>
                                                                                            </template>
                                                                                            <template #filter="{ filterModel }">
                                                                                                <Slider v-model="filterModel.value" :range="true" class="m-3"></Slider>
                                                                                                <div class="flex align-items-center justify-content-between px-2">
                                                                                                    <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
                                                                                                    <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>
                                                                                                </div>
                                                                                            </template>
                                                                                        </Column>
                                                                                        <Column field="verified" header="Verified" dataType="boolean" bodyClass="text-center"
                                                                                            style="min-width: 8rem">
                                                                                            <template #body="{ data }">
                                                                                                <i class="pi"
                                                                                                    :class="{ 'text-green-500 pi-check-circle': data.verified, 'text-pink-500 pi-times-circle': !data.verified }"></i>
                                                                                            </template>
                                                                                            <template #filter="{ filterModel }">
                                                                                                <TriStateCheckbox v-model="filterModel.value" />
                                                                                            </template>
                                                                                        </Column> -->
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
                            <p class="line-height-3">{{ datadialog.time_event }}</p>
                            <div class="flex">
                                <div class="border-round-sm p-2 mr-2" style="background-color: aquamarine;"
                                    v-for="item in datadialog.agency_more">{{ item }}</div>
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
