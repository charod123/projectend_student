
<script setup>
import { onMounted, ref, nextTick } from "vue";
import L from 'leaflet';
import axios from 'axios';
import Service from "../../../../service/api";
import { useRouter, useRoute } from 'vue-router';
import config from '@/service/config';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();
const service = new Service();
const router = useRouter();
const route = useRoute();
const device = JSON.parse(sessionStorage.getItem(`device`));
const toast = useToast();
const displayConfirmation = ref(false);
const openConfirmation = () => {
    displayConfirmation.value = !displayConfirmation.value;
};
onMounted(async () => {
    if (route.path !== '/edit/patient/device') {
        await nextTick();
        getMap();
    }
    if (route.path == '/edit/patient/device') {
        values.value.device = device.map(e => {

            return {
                device_name: e.device_name,
                deive_type: 1,
                datetimedevice: e.device_time,
                device_ip: e.device_ip,
                lat: e.latitude,
                long: e.longgitude
            }
        })
        loading.value = false;
        for (let i = 0; i < values.value.device.length; i++) {
            const dv = values.value.device[i];
            setTimeout(() => {
                getMap(i + 1);
                testout({ lat: dv.lat, long: dv.long }, dv, i);
            }, 200);
        }
    }
})
const map_ = ref([]);
const marker = ref([]);
const lat = ref('');
const long = ref('');
const temp_tambon = ref('');
const temp_amphoe = ref('');
const temp_province = ref('');
const pin_icon = ref(null);
// const datetimedevice = ref('');
// const device_name = ref('');
// const device_ip = ref('');
const loading = ref(false);
const values = ref({ device: [{}] });

const testout = async (ll, m, i) => {
    console.log(ll);
    console.log(map_.value);
    let map = map_.value;
    if (!marker.value) {
        marker.value = [];
    }

    if (marker.value.length > 0) {
        console.log(marker.value);
        map[i].removeLayer(marker.value[0]);
        // map[i].removeLayer(marker.value[1]);
        marker.value = [];
    }

    !m ? null : m.lat = ll.lat
    !m ? null : m.long = ll.long
    let address = await axios.get(`https://www.deemap.com/DeeMap2WS_GC_dtc-ws/geocodingWithPOI.jsp?lat=` + Number(ll.lat) + `&lon=` + Number(ll.long) + `&radius=1`);
    temp_tambon.value = {
        th: address.data.tambon[0].TAM_TNAME,
        en: address.data.tambon[0].TAM_ENAME,
    };
    temp_amphoe.value = {
        th: address.data.tambon[0].AMP_TNAME,
        en: address.data.tambon[0].AMP_ENAME,
    };
    temp_province.value = {
        th: address.data.tambon[0].PROV_TNAME,
        en: address.data.tambon[0].PROV_ENAME,
    };
    var tempmarker = L.marker([ll.lat, ll.long], {
        icon: pin_icon.value
    }).addTo(map[i]).bindPopup(`
        <div style="font-family: 'kanit';">
          ตำบล : ${address.data.tambon[0].TAM_TNAME}
            <br>
           อำเภอ : ${address.data.tambon[0].AMP_TNAME}<br>
           จังหวัด : ${address.data.tambon[0].PROV_TNAME}
        </div>
        `);
    marker.value.push(tempmarker);
    tempmarker.openPopup();
}
const confirm2 = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Do you want to delete this record?',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: () => {
            toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
}
const getMap = (i) => {
    var LeafIcon = L.Icon.extend({
        options: {
            iconSize: [26, 26],
            shadowSize: [16, 16],
        },
    });

    var map = L.map(`map_${i ? i : '1'}`, {
        center: [13.783278, 100.59288],
        zoom: 7,
        maxZoom: 20,
        layers: [L.tileLayer(`https://www.deemap.com/DeeMap/gwc/service/tms/1.0.0/DeeMap2_THA_Map_No_POI@EPSG%3A900913@png8/{z}/{x}/{-y}.png8`)],
        zoomControl: false,
    });

    pin_icon.value = new LeafIcon({
        iconUrl: `${config.backend_url_img}/resources/assets/mian-icon/default/icon-map/Pin_alt.png`,
        popupAnchor: [0, -5],
    });


    L.control
        .zoom({
            position: `bottomright`,
        })
        .addTo(map);
    marker.value = [];
    map.on(`click`, (e) => {
        lat.value = e.latlng.lat
        long.value = e.latlng.lng
    });
    map_.value.push(map);
}
const getmarker = async (m, i) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            m.lat = position.coords.latitude
            m.long = position.coords.longitude
            testout({ lat: position.coords.latitude, long: position.coords.longitude }, null, i);
        })
    } else {
        console.log(`Geolocation is not supported by this browser.`);
    }
}

const patient = JSON.parse(sessionStorage.getItem(`patient`));
const usertry = JSON.parse(sessionStorage.getItem(`usertry`));
const savedata = async () => {
    loading.value = true;
    const pat = {
        alley: patient.alley,
        disease: JSON.parse(patient.disease),
        district_id: patient.district_id.dis_id,
        member: patient.member,
        pat_birthday: patient.pat_birthday,
        pat_fristname: patient.pat_fristname,
        pat_gender: patient.pat_gender,
        pat_height: patient.pat_height,
        pat_lastname: patient.pat_lastname,
        pat_phone: patient.pat_phone,
        pat_weight: patient.pat_weight,
        postal_code: patient.postal_code,
        province_id: patient.province_id.pro_id,
        road: patient.road,
        subdistrict_id: patient.subdistrict_id.sub_id,
        user_id: patient.user_id,
        user_pro_id: patient.user_pro_id,
        pat_id: patient.pat_id
    };
    const device = values.value.device.map(e => {
      
        return {
            deive_name: e.device_name,
            deive_type: 1,
            deive_time: e.datetimedevice,
            device_ip: e.device_ip,
            latitude: e.lat,
            longitude: e.long
        }
    })

    const res = await service.post(route.fullPath == '/edit/patient/device' ? '/write/update-patient' : '/write/add-patient', { pat, usertry, device });
    if (res.message == "success") {
        sessionStorage.clear();
        toast.add({ severity: 'success', summary: 'เพิ่มข้อมูลสำเร็จ', life: 2000 });
        loading.value = false;
        return router.push('/main/patient/datapatients');
    }
    toast.add({ severity: 'error', summary: res.message, life: 2000 });
    loading.value = false;
    if (route.fullPath == '/edit/patient/device') {
        return router.push('/edit/patient')
    }
    if (route.fullPath == '/create/patient/device') {
        return router.push('/create/patient');

    }
}
const addUertry = async (value) => {
    values.value.device.length > 2 ? toast.add({ severity: 'warn', summary: 'สามารถเพิ่มอุปกรณ์ได้แค่ 3 ชิ้น', life: 3000 }) : values.value.device = (value.device || []).concat([{}]);
    setTimeout(() => {
        getMap(values.value.device.length);
    }, 100);

}
// delete new member
const removeUsertry = async (i, values) => {
    toast.add({ severity: 'success', summary: 'ลบสำเร็จ', detail: 'คุณได้ลบฟอร์มเพิ่มญาติแล้ว', life: 3000 });
    const v = values.device.filter((_, index) => {
        return i !== index;
    });
    displayConfirmation.value = !displayConfirmation.value;

    values.device = v;

}
const testcick = (m, i) => {
    setTimeout(() => {
        testout({ lat: lat.value, long: long.value }, m, i);
    }, 200);
}
</script>

<template>
    <div>
        <div class="card mt-5" v-for="(m, index) in values.device" :key="index">
            <div v-if="!loading">
                <div class="grid p-fluid">
                    <div class="col-12 md:col-8">
                        <div :id="`map_${(index + 1).toString()}`" @click="testcick(m, index)"
                            style=" width: 100%;height: 700px;border-radius: 10px;margin-top: 15px;"></div>
                    </div>
                    <div class="col-12 md:col-4">
                        <div class="grid formgrid mt-4">
                            <div class="col-12 mb-2 md:col-12 lg:mb-0">
                                <h4>กรอกรายละเอียดข้อมูลอุปกรณ์</h4>
                                <span class="p-float-label mt-5">
                                    <InputText id="inputtext" type="text" v-model="m.device_name" />
                                    <label for="inputtext">*ชื่ออุปกรณ์</label>
                                </span>
                            </div>
                            <div class="col-12 mb-2 lg:col-12 lg:mb-0 mt-5">
                                <span class="p-float-label">
                                    <InputText id="inputtext" type="text" v-model="m.device_ip" />
                                    <label for="inputtext">*IP อุปกรณ์</label>
                                </span>
                            </div>
                            <div class="col-12 mb-2 lg:col-12 lg:mb-0 mt-5">
                                <span class="p-float-label">
                                    <label for="time24">Time / 24h</label>
                                    <Calendar inputId="time24" v-model="m.datetimedevice" :showTime="true"
                                        :showSeconds="true" />
                                </span>
                            </div>
                            <div class="col-12 mb-2 lg:col-12 lg:mb-0 mt-5">
                                <span class="p-float-label">
                                    <InputText id="inputtext" v-model="m.lat" disabled />
                                    <label for="inputtext">*ละติจูด</label>
                                </span>
                            </div>
                            <div class="col-12 mb-2 lg:col-12 lg:mb-0 mt-5">
                                <span class="p-float-label">
                                    <InputText id="inputtext" v-model="m.long" disabled />
                                    <label for="inputtext">*ลองจิจูด</label>
                                </span>
                            </div>
                            <div class="col-12 mb-2 lg:col-12 lg:mb-0 mt-5">
                                <Button
                                    class="p-button-outlined p-button-secondary mr-2 mb-2 w-full p-3 text-xl w-auto mt-5"
                                    @click.prevent="getmarker(m, index)">ค้นหาตำแหน่งปัจุบันของคุณ</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-wrap md:justify-content-between justify-content-center card-container">
                    <Button label="ลบฟอร์ม" icon="pi pi-trash" class="p-button-danger" @click="openConfirmation"
                        style="width: auto" />
                </div>

            </div>
            <Dialog header="กรุณาเลือก" v-model:visible="displayConfirmation" :style="{ width: '350px' }" :modal="true"
                style="font-family: kanit;">
                <div class="flex align-items-center justify-content-center">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span>คุณต้องการลบแบบพอร์มใช่หรือไม่?</span>
                </div>
                <template #footer>
                    <Button label="ไม่" icon="pi pi-times" @click="openConfirmation" class="p-button-text" />
                    <Button label="ใช่" icon="pi pi-check" @click="removeUsertry(index, values)" class="p-button-text"
                        autofocus />
                </template>
            </Dialog>

        </div>

        <div v-if="loading">
            <div class="grid p-fluid">
                <div class="col-12 md:col-8">
                    <Skeleton height="700px"></Skeleton>
                </div>
                <div class="col-12 md:col-4">
                    <div class="grid formgrid mt-4">
                        <div class="col-12 mb-2 md:col-12 lg:mb-0">
                            <h4>กรอกรายละเอียดข้อมูลอุปกรณ์</h4>
                            <span class="p-float-label mt-5">
                                <Skeleton height="40px"></Skeleton>
                                <label for="inputtext">*ชื่ออุปกรณ์</label>
                            </span>
                        </div>
                        <div class="col-12 mb-2 lg:col-12 lg:mb-0 mt-5">
                            <span class="p-float-label">
                                <InputText id="inputtext" type="text" v-model="device_ip" />
                                <label for="inputtext">*IP อุปกรณ์</label>
                            </span>
                        </div>
                        <div class="col-12 mb-2 lg:col-12 lg:mb-0 mt-5">
                            <span class="p-float-label">
                                <label for="time24">Time / 24h</label>
                                <Skeleton height="40px"></Skeleton>
                                :showSeconds="true" />
                            </span>
                        </div>
                        <div class="col-12 mb-2 lg:col-12 lg:mb-0 mt-5">
                            <span class="p-float-label">
                                <Skeleton height="40px"></Skeleton>
                                <label for="inputtext">*ละติจูด</label>
                            </span>
                        </div>
                        <div class="col-12 mb-2 lg:col-12 lg:mb-0 mt-5">
                            <span class="p-float-label">
                                <Skeleton height="40px"></Skeleton>
                                <label for="inputtext">*ลองจิจูด</label>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap md:justify-content-between justify-content-center card-container">
                <Skeleton height="40px" width="50px"></Skeleton>
                <Skeleton height="40px" width="50px"></Skeleton>
                <Skeleton height="40px" width="50px"></Skeleton>
            </div>
        </div>
        <div v-if="!loading" class="flex justify-content-between">
            <Button class="w-full p-button-info p-3 text-xl w-auto mb-5" @click.prevent="$router.back()">ย้อนกลับ</Button>
            <Button class="w-full p-button-info p-3 text-xl w-auto mb-5" color="#2EAEA7"
                @click="addUertry(values)">เพิ่มฟอร์ม</Button>
            <Button class="w-full p-button-success p-3 text-xl w-auto mb-5" @click.prevent="savedata">บันทึก</Button>

        </div>

    </div>
</template>
<style scoped>
Button {
    font-family: 'kanit';
}
</style>
