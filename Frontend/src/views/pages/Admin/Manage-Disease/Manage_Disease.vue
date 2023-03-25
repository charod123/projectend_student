<script setup>
import { ref, watch, onMounted, onBeforeMount, onUpdated } from 'vue';
import Service from '../../../../service/api';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode } from 'primevue/api';
import { useStore } from '../../../../store';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute()
const store = useStore()
const toast = useToast();
const data_user = ref();
const confirm = useConfirm();
const filters1 = ref(null);
const sigup_popup = ref(false);
const service = new Service();
const option_sundivision = ref();
const disabled_on_edit = ref(false);
const conut_user = ref();
const expandedRows = ref([]);
const data_on_table = ref();
const data_main_menu = ref();
const op = ref();
const selectedProduct = ref();
const toggle = (event) => {
    op.value.toggle(event);
};
const data = ref({
    cd_id: 0,
    cp_name: '',

});


const create_main_menu = async (url) => {
    const res3 = await service.post(`/write/${url}`, { cd_id: data.value.cd_id, cd_name: data.value.cp_name });
    if (res3.message == 'success') {
        sigup_popup.value = false;
        get();
        return toast.add({ severity: 'success', summary: res3.message, life: 2000 });
    }
    return toast.add({ severity: 'error', summary: res3.message, life: 2000 });
}
const edit_main_menu = (data_) => {
    data.value.cd_id = data_.cd_id;
    data.value.cp_name = data_.cd_name;
    disabled_on_edit.value = true;
    sigup_popup.value = true;
}
const create_main = () => {
    getmax_id();
    data.value.cd_id = ''
    data.value.cp_name = ''
    disabled_on_edit.value = false;
    sigup_popup.value = true;
}


const get = async () => {
    const res3 = await service.post('/read/get_disease_manage', {});
    if (res3.message == 'success') {
        data_on_table.value = res3.data;
        console.log(data_on_table.value);
    }

}
const getmax_id = async () => {
    const res = await service.post('/get_id', { table: 'disease_master', filed: 'cd_id' });
    if (res.message == 'success') {
        data.value.cd_id = res.data
    }


}



onMounted(() => {
    get();
    getmax_id();

})
const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
};
const confirm2 = (event, data) => {
    confirm.require({
        target: event.currentTarget,
        message: 'คุณต้องการลบข้อมูลนี้ใช่หรือไม่?',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: async () => {
            debugger
            const res = await service.post('/write/delete_disease', { cd_id: data.cd_id });
            if (res.message == 'success') {
                data_on_table.value = data_on_table.value.filter(x => x.cd_id != data.cd_id)
                return toast.add({ severity: 'success', summary: 'ลบข้อมูลสำเร็จ', life: 2000 });
            }
            return toast.add({ severity: 'warn', summary: res.message, life: 2000 });

        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'ยกเลิก', life: 2000 });
        }
    });
}
onBeforeMount(() => {
    initFilters1();
});

</script>
<template>
    <div>
        <DataTable :value="data_on_table" v-model:expandedRows="expandedRows" dataKey="id" style="font-family: Kanit;"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} " responsiveLayout="scroll"
            :paginator="true" :rows="10" @rowCollapse="onRowCollapse">
            <template #header>
                <div class="table-header-container flex justify-content-between">
                    <div>

                    </div>
                    <div>
                        <Button style="font-family: Kanit;" class="w-15rem p-button-success" icon="pi pi-spin pi-plus"
                            label="เพิ่มโรคประจำตัว" @click="create_main"/>
                    </div>
                </div>
            </template>
            <template #empty> ไม่มีข้อมูล</template>
            <template #loading> Loading customers data. Please wait. </template>
            <template #paginatorstart>
                <Button type="button" icon="pi pi-refresh" class="p-button-text" @click="get()" />
            </template>
            <template #paginatorend>
                <Button type="button" icon="pi pi-cloud" class="p-button-text" />
            </template>
            <Column field="cd_id" header="#" style="min-width: 2rem" :sortable="true">
                <template #body="{ data }">
                    {{ data.cd_id }}
                </template>
            </Column>
            <Column field="cd_name" header="ชื่อโรค" style="min-width: 2rem" :sortable="true">
                <template #body="{ data }">
                    {{ data.cd_name }}
                </template>
            </Column>
           
            <Column field="create_date" header="วันที่เพิ่มข้อมูล" style="min-width:15rem" :sortable="true">
                <template #body="{ data }">
                    {{ $moment(data.create_date).format("YYYY-MM-DD HH:mm:ss") }}
                </template>
            </Column>
            <Column field="update_date" header="แก้ไขล่าสุด" style="min-width:15rem" :sortable="true">
                <template #body="{ data }">
                    {{ $moment(data.update_date).format("YYYY-MM-DD HH:mm:ss")=='Invalid date'?'ยังไม่มีการแก้ไข':$moment(data.update_date).format("YYYY-MM-DD HH:mm:ss") }}
                </template>
            </Column>


            <Column style="min-width: 5rem">
                <template #body="{ data }">
                    <Button icon="pi pi-spin pi-pencil" class="p-button-rounded p-button-warning mr-2 mb-2"
                        @click="edit_main_menu(data)" />
                        <Button icon="pi pi-spin pi-trash" class="p-button-rounded p-button-danger mr-2 mb-2"
                        @click="confirm2($event,data)" />
                </template>
            </Column>

        </DataTable>
        <ConfirmPopup></ConfirmPopup>
        <Dialog style="font-family: Kanit;" :header="`${disabled_on_edit ? 'แก้เมนูหลัก' : 'เพิ่มเมนูหลัก'}`"
            v-model:visible="sigup_popup" :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '20vw' }"
            :position="'right'" :modal="true">
            <div class="grid p-fluid">
                <div class="col-12">
                    <InputText v-model="data.cp_name" placeholder="ชื่อเมนูหลัก" />
                </div>
            </div>
            <template #footer>
                <Button label="บันทึก" icon="pi pi-check"
                    @click="create_main_menu(`${disabled_on_edit ? 'udpate_disease' : 'create_disease'}`)" autofocus />
            </template>
        </Dialog>

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