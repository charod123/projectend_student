<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import ReadDataJson from '@/service/ReadDataJson.js';
import { ref, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import Service from '../../../../service/api';
import { useStore } from '../../../../store';
const store = useStore();
const service = new Service();


const customer1 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const loading = ref(false);
const dialog = ref(false);
const datapriority = ref(null);
const toast = useToast();
const openBasic2 = async (data) => {
    const res = await service.post('read/get-priority', {});
    if (res.message === 'success') {
        // localStorage.setItem('token', res.data[0].token);
        datapriority.value = res.data;
        datapriority.value = await (datapriority.value.filter(e => {
            if (e.role_id == data.role_id) {
                e.can_read = e.can_read == 1 ? true : false;
                e.can_write = e.can_write == 1 ? true : false;
                e.can_delete = e.can_delete == 1 ? true : false;
                e.disabled = e.can_export == 2 ? true : false;
                e.can_export = e.can_export == 1 ? true : false;
                return e;
            }
        }));
        // const priority = res.data.filter((e, index, self) =>
        //     index === self.findIndex(e_ => e_.priority_id === e.priority_id)
        // )
        // // const priority = [...new Set(res.data.map(e => e.priority_id))];
        // console.log(priority);
        // write function filter unique values
        // console.log(priority);
        // localStorage.setItem('details', JSON.stringify(res.data[0]));
        // toast.add({ severity: 'success', summary: 'Successful', detail: 'Signin Successful', life: 3000 });
        // setTimeout(() => route.push('/dashboard'), 1000);
    } else {
        toast.add({ severity: 'error', summary: res.message, detail: 'Incorrect email or password', life: 3000 });
    }

    dialog.value = true;
}
const submit = async (priority) => {
    loading.value = true;
    dialog.value = false;
    const data = await priority.filter(e => {
        e.can_read = e.can_read == true ? 1 : 0;
        e.can_write = e.can_write == true ? 1 : 0;
        e.can_delete = e.can_delete == true ? 1 : 0;
        e.can_export = e.disabled == true ? 2 : e.can_export == true ? 1 : 0;
        return e;
    });
    const res = await service.post('/write/update_priority', { priority: data })
    if (res.message == "success") {
        store.priority = {};
        return loading.value = false;
    }
    return alert(res.message);
}
const closeBasic2 = () => {
    dialog.value = false;
}
onBeforeMount(async () => {
    loading1.value = true;
    customer1.value = [
        {
            priority_name: "ผู้จัดการหรือตำแหน่งที่สูงกว่า",
            role_id: 1,
        },
        {
            priority_name: "เจ้าหน้าที่หรือพนักงานระดับล่าง",
            role_id: 2
        },
        {
            priority_name: "ผู้ดูแลผู้ป่วยหรือบุคคลทั่วไป",
            role_id: 3
        }
    ];
    loading1.value = false;
    // customer1.value.forEach((customer) => (customer.date = new Date(customer.date)));
    initFilters1();
});

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        priority_name: { value: null, matchMode: FilterMatchMode.EQUALS },
        role_id: { value: null },
    };
};



</script>

<template>
    <div class="grid">
        <div class="col-12">
            <DataTable v-if="!loading" :value="customer1" :paginator="true" class="p-datatable-gridlines mt-5 text-xl"
                style="font-family: Kanit;" :rows="10" dataKey="role_id" :rowHover="true" v-model:filters="filters1"
                sortMode="single"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]" 
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} " sortField="role_id" :sortOrder="1"
                filterDisplay="menu" :loading="loading1" :filters="filters1" responsiveLayout="scroll"
                :globalFilterFields="['role_id', 'priority_name']">
                <template #header>
                    <div class="flex justify-content-between flex-column sm:flex-row">
                        <span class="p-input-icon-left mb-2">
                            <i class="pi pi-search" />
                            <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 25%" />
                        </span>
                    </div>
                </template>
                <template #empty> No customers found. </template>
                <template #loading> Loading customers data. Please wait. </template>
                <Column field="role_id" header="ระดับสิทธิ์" style="min-width: 12rem">
                    <template #body="{ data }">
                        {{ data.role_id }}
                    </template>
                    <template #filter="{ filterModel }">
                        <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                            placeholder="Search by id" />
                    </template>
                </Column>

                <Column field="priority_name" header="สิทธิ์การใช้งาน" style="min-width: 12rem">
                    <template #body="{ data }">
                        {{ data.priority_name }}

                    </template>
                    <template #filter="{ filterModel }">
                        <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                            placeholder="Search by name" />
                    </template>
                </Column>
                <Column field="verified" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">
                    <template #body="{ data }">
                        <Button icon="pi pi-cog" class="p-button-rounded p-button-info mr-2 mb-2"
                            @click="openBasic2(data)" />
                    </template>

                </Column>
            </DataTable>
            <DataTable v-if="loading" :value="customer1" :paginator="true" class="p-datatable-gridlines mt-5" :rows="10"
                dataKey="role_id" :rowHover="true" v-model:filters="filters1" sortMode="single" sortField="role_id"
                :sortOrder="1" filterDisplay="menu" :loading="loading1" :filters="filters1" responsiveLayout="scroll"
                :globalFilterFields="['role_id', 'priority_name']">
                <template #header>
                    <div class="flex justify-content-between flex-column sm:flex-row">
                        <span class="p-input-icon-left mb-2">
                            <i class="pi pi-search" />
                            <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 25%" />
                        </span>
                    </div>
                </template>
                <template #empty> No customers found. </template>
                <template #loading> Loading customers data. Please wait. </template>
                <Column field="role_id" header="ระดับสิทธิ์" style="min-width: 12rem">
                    <template #body>
                        <Skeleton height="3rem"></Skeleton>
                    </template>
                    <template #filter="{ filterModel }">
                        <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                            placeholder="Search by id" />
                    </template>
                </Column>

                <Column field="priority_name" header="สิทธิ์การใช้งาน" style="min-width: 12rem">
                    <template #body>
                        <Skeleton height="3rem"></Skeleton>
                    </template>
                    <template #filter="{ filterModel }">
                        <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                            placeholder="Search by name" />
                    </template>
                </Column>
                <Column field="verified" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">
                    <template #body>
                        <Skeleton height="3rem"></Skeleton>
                    </template>
                </Column>
            </DataTable>

            <Dialog header="กำหนดสิทธิ์การใช้งาน" v-model:visible="dialog"
                :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '50vw' }">
                <div class="grid p-fluid">
                    <div class="col-12 md:col-12">
                        <div class="flex col-12 md:col-12">
                            <div class="col-12 md:col-6 flex justify-content-start">
                                <h4>เมนู</h4>
                            </div>
                            <Divider layout="vertical" />
                            <div class="col-12 md:col-1 flex justify-content-center">
                                <h4>อ่าน</h4>
                            </div>
                            <Divider layout="vertical" />
                            <div class="col-12 md:col-1 flex justify-content-center">
                                <h4>แก้ไข</h4>
                            </div>
                            <Divider layout="vertical" />

                            <div class="col-12 md:col-1 flex justify-content-center">
                                <h4>ลบ</h4>
                            </div>
                            <Divider layout="vertical" />

                            <div class="col-12 md:col-1 flex justify-content-center">
                                <h4>ออกรายงาน</h4>
                            </div>
                        </div>
                        <div v-for="item in datapriority" :key="item" class="flex col-12 md:col-12">
                            <div class="col-12 md:col-6 flex justify-content-start">
                                <h5>{{ item.priority_name_th }}</h5>
                            </div>
                            <Divider layout="vertical" />
                            <div class="col-12 md:col-1 flex justify-content-center">
                                <InputSwitch v-model="item.can_read" />
                            </div>
                            <Divider layout="vertical" />
                            <div class="col-12 md:col-1 flex justify-content-center">
                                <InputSwitch v-model="item.can_write" />
                            </div>
                            <Divider layout="vertical" />

                            <div class="col-12 md:col-1 flex justify-content-center">
                                <InputSwitch v-model="item.can_delete" />
                            </div>
                            <Divider layout="vertical" />

                            <div class="col-12 md:col-1 flex justify-content-center">
                                <InputSwitch :disabled="item.disabled" v-model="item.can_export" />
                            </div>
                        </div>

                    </div>
                </div>
                <template #footer>
                    <Button label="ปิด" icon="pi pi-times" @click="closeBasic2" class="p-button-text" />
                    <Button label="บันทึก" icon="pi pi-check" @click="submit(datapriority)" autofocus />
                </template>
            </Dialog>
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
