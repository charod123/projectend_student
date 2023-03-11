<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import ReadDataJson from '@/service/ReadDataJson.js';
import { useConfirm } from "primevue/useconfirm";
import { ref, onBeforeMount, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import moment from 'moment';
import L from 'leaflet';
import Service from '../../../../service/api';
import config from '@/service/config';
const service = new Service();

const confirm = useConfirm();
const customer1 = ref(null);
const filters1 = ref(null);
const division = ref(null);
const divisionDialog = ref(false)
const loading = ref(false);
const dialog = ref(false);
const toast = useToast();
const sub = ref(1);
const submitted = ref(false);

const map_ = ref(null);
const marker = ref([]);
const pin_icon = ref(null);
const getMarker = (data) => {
    console.log(data);
    map_.value.setView([data.lat, data.long], 7);
    console.log(data);
    const myIcon = L.icon({
        iconUrl: 'http://localhost:3010/resources/assets/mian-icon/default/icon-map/Pin_alt.png',
        iconSize: [30, 30],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94],
    });

    const map = map_.value;
    let marker_ = L.marker([data.lat, data.long], {
        icon: myIcon,
    }).addTo(map)
        .bindPopup(` ${data.division_name} 
        `);
    marker_.on("mouseover", (e) => {
        marker_.openPopup();
    });
    marker_.on('click', () => {
        map.flyTo(marker_.getLatLng(), 15, { animate: true, duration: 1.5 });
    });
    marker.value.push(marker);

}
const getMap = () => {
    var LeafIcon = L.Icon.extend({
        options: {
            iconSize: [26, 26],
            shadowSize: [16, 16],
        },
    });

    var map = L.map(`map`, {
        center: [customer1.value[0].lat, customer1.value[0].long],
        zoom: 7,
        maxZoom: 20,
        layers: [L.tileLayer(`https://www.deemap.com/DeeMap/gwc/service/tms/1.0.0/DeeMap2_THA_Map_No_POI@EPSG%3A900913@png8/{z}/{x}/{-y}.png8`)],
        zoomControl: false,
    });

    pin_icon.value = new LeafIcon({
        iconUrl: `${config.backend_url_img}/resources/assets/mian-icon/default/icon-map/Pin_alt.png`,
        popupAnchor: [0, -5],
    });


    L.control.zoom({ position: `bottomright`, }).addTo(map);
    marker.value = [];
    map_.value = map;

    for (let i = 0; i < customer1.value.length; i++) {
        const data = customer1.value[i];
        getMarker(data);
    }
}

onMounted(async (e) => {
    console.log(e);
    loading.value = true;
    try {
        const response = await service.post('/read/get-divison', {});
        if (response.message === "success") {
            customer1.value = response.data;
            console.log(response);
            const res = await service.post('/read/get-pro-dis-sub-by-id', { province_id: response.data[0].province_id, district_id: response.data[0].district_id, subdistrict_id: response.data[0].subdistrict_id });
            console.log(res);
            await getMap();
        } else {
            toast.add({ severity: 'error', summary: response.message, life: 2000 });
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
})
onBeforeMount(() => {
    initFilters1();
});
const editDivision = (editdivision) => {
    console.log(editdivision);
    division.value = { ...editdivision };
    console.log(division);
    divisionDialog.value = true;
    getMap();
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
        division_lat: { value: null },
        division_lon: { value: null },


    };
};

const save = async (data) => {
    console.log(data);
    submitted.value = true;
    try {
        loading.value = true;
        const res = await service.post('/write/update-divison', { division_name: data.division_name, division_email: data.email, subdistrict_id: data.subdistrict_id, long: data.long, lat: data.lat, tel: data.tel })
        if (res.message == 'success') {
            loading.value = false;
            divisionDialog.value = false;
            console.log(customer1.value);
            customer1.value[0] = data;
            return toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });

        }

    } catch (error) {
        return new Error(error.message)
    }
}

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div id="map"></div>
            <DataTable v-if="!loading" :value="customer1" :paginator="true" class="p-datatable-gridlines mt-5 text-xl"
                :rows="10" dataKey="division_name" :rowHover="true" v-model:filters="filters1" sortMode="single"
                sortField="division_name" :sortOrder="1" filterDisplay="menu" :loading="loading1" :filters="filters1"
                responsiveLayout="scroll" :globalFilterFields="['division_name']">
                <template #header>
                    <div class="flex justify-content-between flex-column sm:flex-row">
                        <span class="p-input-icon-left mb-2">
                            <i class="pi pi-search" />
                            <InputText v-model="filters1['global'].value" placeholder="Keyword Search"
                                style="width: 25%" />
                        </span>
                    </div>
                </template>
                <template #empty> ไม่มีข้อมูล</template>
                <template #loading> Loading customers data. Please wait. </template>
                <Column field="division_name" header="ชื่อหน่วยงาน" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        {{ data.division_name }}
                    </template>
                  
                </Column>

                <Column field="lat" header="ละติจูด" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        {{ data.lat }}

                    </template>
                   
                </Column>
                <Column field="long" header="ลองจิจูด" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        {{ data.long }}

                    </template>
                  
                </Column>

                <Column field="verified" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">
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
                    <label for="name">ชื่อหน่วยงาน</label>
                    <InputText id="name" v-model.trim="division.division_name" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !division.division_name }" />
                    <small class="p-invalid" v-if="submitted && !division.division_name">กรุณากรอกข้อมูล.</small>
                </div>
                <div class="field">
                    <label for="name">อีเมล</label>
                    <InputText id="name" v-model.trim="division.email" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !division.email }" />
                    <small class="p-invalid" v-if="submitted && !division.email">กรุณากรอกข้อมูล.</small>
                </div>
                <div class="field">
                    <label for="name">เบอร์โทร</label>
                    <InputText id="name" v-model.trim="division.tel" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !division.tel }" />
                    <small class="p-invalid" v-if="submitted && !division.tel">กรุณากรอกข้อมูล.</small>
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
#map {
    width: 100%;
    height: 450px;
    border-radius: 10px;
    margin-top: 15px;
}

@import '@/assets/demo/styles/badges.scss';

::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
