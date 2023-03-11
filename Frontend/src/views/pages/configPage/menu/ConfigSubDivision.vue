<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useConfirm } from "primevue/useconfirm";
import { ref, onBeforeMount, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import Service from '../../../../service/api';
const service = new Service();
const confirm = useConfirm();
const customer1 = ref(null);
const filters1 = ref(null);
const division = ref(null);
const divisionDialog = ref(false)
const loading = ref(false);
const toast = useToast();
const sub = ref(1);
const submitted = ref(false);
const header = ref('');
const sub_dialog = ref(false)
onMounted(() => {
    get_data();
})
onBeforeMount(() => {
    initFilters1();

});
const get_data = async () => {
    loading.value = true;
    try {
        const response = await service.post('/read/get-subdivison', {});
        if (response.message === "success") {
            customer1.value = response.data;
            header.value = response.data[0].division_name;
            console.log(customer1.value);
        } else {
            toast.add({ severity: 'error', summary: response.message, life: 2000 });

        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
}
const create_subdivision = async () => {
    division.value = {
        subdivision_name: ''
    }
    sub_dialog.value = true;
    divisionDialog.value = true;
}
const editDivision = (editdivision) => {
    console.log(editdivision);
    division.value = { ...editdivision };
    console.log(division);
    divisionDialog.value = true;
};

const deletesubdivision = async (data) => {
    try {
        loading.value = true;
        const res = await service.post('/write/delete-subdivison', { subdivision_id: data.subdivision_id })
        if (res.message == 'success') {
            customer1.value = customer1.value.filter((val) => val.subdivision_id !== data.subdivision_id);
            return loading.value = false;
        }
    } catch (error) {
        return new Error(error.message)
    }

}
const save = async (data) => {
    debugger
    submitted.value = true;
    try {
        loading.value = true;
        if (sub_dialog.value == true) {
            const res = await service.post('/write/insert-subdivison', { division_id: customer1.value[0].division_id, subdivision_name: data.subdivision_name })
            if (res.message == 'success') {
                loading.value = false;
                divisionDialog.value = false;
                customer1.value[findIndexById(division.value.subdivision_id)] = division.value;
                sub_dialog.value = false;
                return toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });

            }
            divisionDialog.value = false;
            return toast.add({ severity: 'error', summary: res, life: 3000 });
        } else {
            const res = await service.post('/write/update_subdivison', { subdivision_id: data.subdivision_id, subdivision_name: data.subdivision_name })
            if (res.message == 'success') {
                loading.value = false;
                divisionDialog.value = false;
                customer1.value[findIndexById(division.value.subdivision_id)] = division.value;
                return toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });

            }
            divisionDialog.value = false;
            return toast.add({ severity: 'error', summary: res, life: 3000 });

        }

    } catch (error) {
        return new Error(error.message)
    }
}
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < customer1.value.length; i++) {
        if (customer1.value[i].subdivision_id === id) {
            index = i;
            break;
        }
    }
    return index;
};
const confirm2 = (event, data) => {
    confirm.require({
        target: event.currentTarget,
        message: 'คุณต้องการลบข้อมูลนี้ใช่หรือไม่?',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: async () => {
            await deletesubdivision(data);
            toast.add({ severity: 'success', summary: 'ลบข้อมูลสำเร็จ', life: 2000 });
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'ยกเลิก', life: 2000 });
        }
    });
}
const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        division_name: { value: null, matchMode: FilterMatchMode.EQUALS },
        subdivision_id: { value: null },
        subdivision_name: { value: null, matchMode: FilterMatchMode.EQUALS },
        create_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        update_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },

    };
};



</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div style="text-align: center;margin-top: 1.3rem;">
                <h2>{{ header }}</h2>
            </div>
            <div class="flex justify-content-end">
                <Button style="width: auto" label="เพิ่มผหน่วยงาน" icon="pi pi-plus" @click="create_subdivision"
                    class="p-button-success m-2" />
            </div>
            <DataTable v-if="!loading" :value="customer1" :paginator="true" class="p-datatable-gridlines mt-5 text-xl"
                :rows="10" dataKey="subdivision_id" :rowHover="true" v-model:filters="filters1" sortMode="single"
                sortField="subdivision_id" :sortOrder="1" filterDisplay="menu" :loading="loading1" :filters="filters1"
                responsiveLayout="scroll" :globalFilterFields="['subdivision_id', 'division_name', 'subdivision_name']"
                style="font-family: Kanit;">
                <template #header>
                    <div class="flex justify-content-between flex-column sm:flex-row">
                        <span class="p-input-icon-left mb-2">
                            <i class="pi pi-search" />
                            <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 25%" />
                        </span>
                    </div>
                </template>
                <template #empty> ไม่มีข้อมูล</template>
                <template #loading> Loading customers data. Please wait. </template>
                <Column field="subdivision_id" header="#" style="min-width: 12rem" :sortable="true">
                    <template #body="{ data }">
                        {{ data.subdivision_id }}
                    </template>
                    <template #filter="{ filterModel }">
                        <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                            placeholder="Search by id" />
                    </template>
                </Column>

                <Column field="subdivision_name" header="ชื่อหน่วยงานย่อย" style="min-width: 12rem" :sortable="true">
                    <template #body="{ data }">
                        {{ data.subdivision_name }}

                    </template>
                    <template #filter="{ filterModel }">
                        <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                            placeholder="Search by name" />
                    </template>
                </Column>
                <Column field="create_date" header="วันที่เพิ่มข้อมูล" filterField="create_date" dataType="date" style="min-width: 10rem" :sortable="true">
                    <template #body="{ data }">
                        {{ (data.create_date) }}
                    </template>
                    <template #filter="{ filterModel }">
                        <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                    </template>
                </Column>
                <Column field="update_date" header="วันที่แก้ไขล่าสุด" filterField="update_date" dataType="date" style="min-width: 10rem" :sortable="true">
                    <template #body="{ data }">
                        {{ (data.update_date) }}
                    </template>
                    <template #filter="{ filterModel }">
                        <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                    </template>
                </Column>
                <Column dataType="boolean" bodyClass="text-center" style="min-width: 8rem">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning mr-2 mb-2"
                            @click="editDivision(data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger mr-2 mb-2"
                            @click="confirm2($event, data)" />
                    </template>

                </Column>
            </DataTable>
            <DataTable v-if="loading" :value="customer1" :paginator="true" class="p-datatable-gridlines mt-5" :rows="10"
                dataKey="subdivision_id" :rowHover="true" v-model:filters="filters1" sortMode="single"
                sortField="subdivision_id" :sortOrder="1" filterDisplay="menu" :loading="loading1" :filters="filters1"
                responsiveLayout="scroll"
                :globalFilterFields="['subdivision_id', 'division.division_name', 'subdivision_name']">
                <template #header>
                    <div class="flex justify-content-between flex-column sm:flex-row">
                        <span class="p-input-icon-left mb-2">
                            <i class="pi pi-search" />
                            <InputText placeholder="Keyword Search" style="width: 25%" />
                        </span>
                    </div>
                </template>
                <template #empty>
                    <Skeleton height="40px"></Skeleton>
                </template>
                <template #loading> Loading customers data. Please wait. </template>
                <Column field="role_id" header="ระดับสิทธิ์" style="min-width: 12rem">
                    <template #body>
                        <Skeleton></Skeleton>
                    </template>
                    <template #filter="{ filterModel }">
                        <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                            placeholder="Search by id" />
                    </template>
                </Column>

                <Column field="priority_name" header="สิทธิ์การใช้งาน" style="min-width: 12rem">
                    <template #body>
                        <Skeleton></Skeleton>
                    </template>
                    <template #filter="{ filterModel }">
                        <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                            placeholder="Search by name" />
                    </template>
                </Column>
                <Column field="verified" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">
                    <template #body>
                        <Skeleton></Skeleton>
                    </template>
                </Column>
            </DataTable>
            <ConfirmPopup></ConfirmPopup>
            <Toast />
            <Dialog v-model:visible="divisionDialog" :style="{ width: '450px' }" header="แก้ไขข้อมูล" :modal="true"
                class="p-fluid">
                <!-- <img :src="contextPath + 'demo/images/product/' + product.image" :alt="product.image"
                            v-if="product.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" /> -->
                <div class="field">
                    <label for="name">ชื่อหน่วยงานย่อย</label>
                    <InputText id="name" v-model.trim="division.subdivision_name" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !division.subdivision_name }" />
                    <small class="p-invalid" v-if="submitted && !division.subdivision_name">กรุณากรอกข้อมูล.</small>
                </div>
                <template #footer>
                    <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text"
                        @click="divisionDialog = !divisionDialog" />
                    <Button label="บันทึก" icon="pi pi-check" class="p-button-text" @click="save(division)" />
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
