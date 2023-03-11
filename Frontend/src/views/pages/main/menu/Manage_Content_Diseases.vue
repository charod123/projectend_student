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
    main_menu_id: 0,
    content_id: 0,
    main_menu_name: '',
    province_id: 0,
    subdistrict_id: 0,
    district_id: 0,
    file: null,
    role_id: null,
});



function pushWithQuery(query) {
    store.content_data = query
    router.push({
        name: 'create_content',
    })

}
const create_main_menu = async (url) => {
    const res3 = await service.post(`/write/${url}`, { main_menu_id: data.value.main_menu_id, main_menu_name: data.value.main_menu_name });
    if (res3.message == 'success') {
        sigup_popup.value = false;
        get();
        return toast.add({ severity: 'success', summary: res3.message, life: 2000 });
    }
    return toast.add({ severity: 'error', summary: res3.message, life: 2000 });
}
const edit_main_menu = (data_) => {
    data.value.main_menu_id = data_.main_menu_id;
    data.value.main_menu_name = data_.main_menu_name;
    disabled_on_edit.value = true;
    sigup_popup.value = true;
}
const create_main = () => {
    getmax_id();
    data.value.main_menu_id = ''
    data.value.main_menu_name = ''
    disabled_on_edit.value = false;
    sigup_popup.value = true;
}
// const save = async () => {
//     const res = await service.post('/register', {});
//     if (res.message == 'success') {
//         sigup_popup.value = false
//         get();
//         return toast.add({ severity: 'success', summary: res.message, life: 3000 });
//     }
// }
// const edit_save = async (data_) => {
//     const res = await service.post('/write/update_user', { data: data_ });
//     if (res.message == 'success') {
//         if (data_.file?.length > 0) {
//             sigup_popup.value = false
//             get();
//             return toast.add({ severity: 'success', summary: res.message, life: 3000 });
//         }
//         sigup_popup.value = false
//         get();
//         return toast.add({ severity: 'success', summary: res.message, life: 3000 });
//     }
//     return toast.add({ severity: 'warn', summary: res.message, life: 3000 });

// }

const get = async () => {
    const res3 = await service.post('/read/get_content', {});
    if (res3.message == 'success') {
        data_on_table.value = res3.data;
        console.log(data_on_table.value);
    }
    const res4 = await service.post('/read/get_main_menu', {});
    if (res4.message == 'success') {
        data_main_menu.value = res4.data;
        console.log(data_main_menu.value);
    }
}
const getmax_id = async () => {
    const res = await service.post('/get_id', { table: 'main_menu', filed: 'main_menu_id' });
    if (res.message == 'success') {
        data.value.main_menu_id = res.data
    }
    const res1 = await service.post('/get_id', { table: 'content_diseases', filed: 'content_id' });
    if (res1.message == 'success') {
        data.value.content_id = res1.data
        console.log(data.value);
    }

}
// const playSound = () => {
//     const audio = new Audio('http://localhost:3010/resources/assets/X2Download.app.mp3');
//     audio.play();
// }


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
            const res = await service.post('/write/delete_main_menu', { main_menu_id: data.main_menu_id });
            if (res.message == 'success') {
                data_main_menu.value = data_main_menu.value.filter(x => x.main_menu_id != data.main_menu_id)
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll"
            :paginator="true" :rows="10" @rowCollapse="onRowCollapse">
            <template #header>
                <div class="table-header-container flex justify-content-between">
                    <div>

                    </div>
                    <div>
                        <Button style="font-family: Kanit;" class="w-15rem p-button-success" icon="pi pi-spin pi-plus"
                            label="เพิ่มโรคที่มักพบบ่อย"
                            @click="$router.push('/main/patient/content_diseases/create', { data_: data_on_table })" />
                        <Button style="font-family: Kanit;" class="w-12rem p-button-warning ml-2" icon="pi pi-spin pi-wrench"
                            label="จัดการเมณูหลัก" @click="toggle" />

                    </div>
                </div>
            </template>
            <OverlayPanel ref="op" appendTo="body" :showCloseIcon="true" id="overlay_panel" style="width: 450px"
                :breakpoints="{ '960px': '75vw' }">
                <DataTable :value="data_main_menu" v-model:selection="selectedProduct" selectionMode="single"
                    :paginator="true" :rows="4" @rowSelect="onProductSelect" responsiveLayout="scroll">
                    <template #header>
                        <div class="flex justify-content-between">
                            <h1></h1>
                            <Button icon="pi pi-plus" class="p-button-rounded p-button-success mr-2 mb-2"
                                @click="create_main" />
                        </div>

                    </template>
                    <Column field="main_menu_name" header="ชื่อเมณูหลัก" sortable style="width: 50%"></Column>
                    <Column style="width: 40%">
                        <template #body="{ data }">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning mr-2 mb-2"
                                @click="edit_main_menu(data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger mr-2 mb-2"
                                @click="confirm2($event, data)" />
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
            <Column field="content_id" header="#" style="min-width: 2rem" :sortable="true">
                <template #body="{ data }">
                    {{ data.content_id }}
                </template>
            </Column>
            <Column field="sub_menu_name" header="ชื่อเมณูย่อย" style="min-width: 2rem" :sortable="true">
                <template #body="{ data }">
                    {{ data.sub_menu_name }}
                </template>
            </Column>
            <Column field="main_menu_name" header="เมณูหลัก" style="min-width: 2rem" :sortable="true">
                <template #body="{ data }">
                    {{ data.main_menu_name }}
                </template>
            </Column>
            <Column field="create_date" header="วันที่เพิ่มข้อมูล" style="min-width:15rem" :sortable="true">
                <template #body="{ data }">
                    {{ $moment(data.create_date).format("YYYY-MM-DD HH:mm:ss") }}
                </template>
            </Column>
            <Column field="update_date" header="แก้ไขล่าสุด" style="min-width:15rem" :sortable="true">
                <template #body="{ data }">
                    {{ $moment(data.update_date).format("YYYY-MM-DD HH:mm:ss") }}
                </template>
            </Column>


            <Column style="min-width: 5rem">
                <template #body="{ data }">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning mr-2 mb-2"
                        @click="pushWithQuery(data)" />
                    <!-- <Button icon="pi pi-trash" class="p-button-rounded p-button-danger mr-2 mb-2"
                                                                                                                                                                                                                                                                @click="confirm2($event, data)" /> -->
                </template>
            </Column>

        </DataTable>
        <ConfirmPopup></ConfirmPopup>
        <Dialog style="font-family: Kanit;" :header="`${disabled_on_edit ? 'แก้เมณูหลัก' : 'เพิ่มเมณูหลัก'}`"
            v-model:visible="sigup_popup" :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '20vw' }"
            :position="'right'" :modal="true">
            <div class="grid p-fluid">
                <div class="col-12">
                    <InputText v-model="data.main_menu_name" placeholder="ชื่อเมณูหลัก" />
                </div>
            </div>
            <template #footer>
                <Button label="บันทึก" icon="pi pi-check"
                    @click="create_main_menu(`${disabled_on_edit ? 'update_main_menu' : 'create_main_menu'}`)" autofocus />
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