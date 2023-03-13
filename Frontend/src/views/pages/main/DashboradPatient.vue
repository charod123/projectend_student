<script setup>
import { ref, onMounted, nextTick } from 'vue';
import L from 'leaflet';
import Service from "../../../service/api";
import hereIcon from '../../../assets/img/Component.png';
import config from '@/service/config';
import moment from 'moment';
// import 'moment/locale/th'; // import Thai locale
const service = new Service();


onMounted(async () => {
    await get_data_noti();
    await nextTick();
    await getMap();

})
'unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'
const map_ = ref(null);
const marker = ref([]);
const pin_icon = ref(null);
const countpat = ref(0);
const data_noti = ref(null);
const loading = ref(false);
const count_noti = ref(null);
const getMarker = (data) => {
    console.log(data);
    for (let i = 0; i < data.device.length; i++) {
        const dev = data.device[i];
        map_.value.setView([dev.latitude, dev.longgitude], 8);
        console.log(data);
        data.disease = JSON.parse(data.disease);
        const myIcon = L.icon({
            iconUrl: hereIcon,
            iconSize: [50, 60],
            iconAnchor: [22, 94],
            popupAnchor: [-3, -76],
            shadowSize: [68, 95],
            shadowAnchor: [22, 94],
        });

        const map = map_.value;
        let marker_ = L.marker([dev.latitude, dev.longgitude], {
            icon: myIcon,
        }).addTo(map)
            .bindPopup(`<div class="grid p-fluid" style="font-size:1.2rem;color:var(--text-color);width:20rem;">
        <div class="col-12 md:col-12">
        <div ><span>IP อุปกรณ์</span> ${dev.device_ip} <br>
        <span style="color:red">*</span><span style="font-weight: bold;font-size: medium;">ชื่อ</span> ${data.pat_fristname} 
        <span style="font-weight: bold;font-size: medium;">นามสกุล</span>  ${data.pat_lastname}  
        <span style="font-weight: bold;font-size: medium;">อายุ</span> ${moment(new Date()).format("YYYY") - moment(data.patient_birthday).format("YYYY")} 
        <span style="font-weight: bold;font-size: medium;">ระดับความเสี่ยงของโรค</span> ปานกลาง <br>
        <span style="font-weight: bold;font-size: medium;">โรคประจำตัว</span> ${data.disease[0]['cd_name'] + ',' + data.disease[1]['cd_name'] + '........'} 
        </div>
         </div>
        </div>
        `);
        marker_.on("mouseover", (e) => {
            marker_.openPopup();
        });
        marker_.on('click', function () {
            map.flyTo(marker_.getLatLng(), 15, { animate: true, duration: 1.5 });
        });
        marker.value.push(marker);
    }


}
const getMap = async () => {
    var LeafIcon = L.Icon.extend({
        options: {
            iconSize: [26, 26],
            shadowSize: [16, 16],
        },
    });

    var map = L.map(`map`, {
        center: [13.783278, 100.59288],
        zoom: 8,
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
    // map.flyTo([10.324, 104.4342], 15, {animate: true, duration: 1.5});
    marker.value = [];

    map_.value = map;

    const user = JSON.parse(localStorage.getItem("details"))?.user_id
    const getdatapat = await service.post('read/get_patient_all', { user_id: user }).then(e => e.data).catch(err => err)
    countpat.value = getdatapat.length;
    for (let i = 0; i < getdatapat.length; i++) {
        const data = getdatapat[i];
        getMarker(data);
    }
}
const get_data_noti = async () => {
    loading.value = true;
    const res = await service.post('read/get-notify', { limit: 4 });
    if (res.message == "success") {
        data_noti.value = res.data;
        count_noti.value = res.count;
        return loading.value = false;
    }
    loading.value = false;
    return alert(res.message);
}
</script>
<template>
    <div class="grid p-fluid">
        <div class="relative col-12 md:col-12">
            <div v-if="!loading" class="relative p-4 border-round font-bold text-gray-900 z-0" id="map"
                style="min-width: 300px; min-height: 160px">
            </div>
            <Skeleton v-if="loading" width="100%" height="100vh" />
            <div v-if="!loading" class="absolute z-1"
                style="min-width: 320px; min-height: 200px; width:30vw; bottom: 2%; right: 2%;">
                <div class="card mb-0">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-3xl mb-3">จำนวนผู้ป่วยของคุณ</span>
                            <div class="text-4xl text-xl">{{ countpat }}</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
                            style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-user text-blue-500 text-xl"></i>
                        </div>
                    </div>
                </div>
                <div v-if="!loading" class="card mb-0 mt-3">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-3xl mb-3">SOS แจ้งเตือนฉุกเฉิน</span>
                            <div class="text-4xl text-xl">{{ count_noti }}</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-yellow-300 border-round"
                            style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-exclamation-triangle text-blue-500 text-xl"></i>
                        </div>
                    </div>
                </div>
                <div v-if="!loading" class="card mb-0 mt-3">

                    <div class="flex justify-content-between mb-3">
                        <div class="grid p-fluid p-2">
                            <span class="block text-3xl mb-3">SOS แจ้งเตือนฉุกเฉิน</span>
                            <div class="text-1xl text-xl bg-indigo-100 border-round p-4 font-bold text-back hover:bg-indigo-300 m-2 flex justify-content-between"
                                v-for="item in data_noti" :key="item" style="width: 100%;">

                                <span>SOS ฉุกเฉินเมื่อ </span>
                                <span
                                    :class="`customer-badge status-${!item.detail_patient ? 'unqualified' : 'qualified'}`">{{
                                        !item.detail_patient ? 'ไม่มีการการดำเนินการจากเจ้าหน้าที่' :
                                        'ดำเนินการเรียบร้อย' }}</span>
                                <span>{{ item.time_event_dashborad }}</span>
                            </div>
                        </div>

                        <!-- <div class="flex align-items-center justify-content-center bg-red-300 border-round"
                                                style="width: 2.5rem; height: 2.5rem;border: 1px solid red;">
                                                <i class="pi pi-exclamation-triangle text-blue-500 text-xl"></i>
                                            </div> -->
                    </div>
                    <Button style="font-family: Kanit;" label="ดูทั้งหมด" class="p-button-text mr-2 mb-2"
                        @click.prevent="$router.push('/main/recoad_notification')" />

                </div>
            </div>
        </div>

    </div>
</template>
<style scoped>
#map {
    width: auto;
    height: 87vh;
    border-radius: 10px;
}
</style>