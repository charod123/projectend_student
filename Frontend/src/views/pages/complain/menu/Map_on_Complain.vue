<script setup>
import { ref, onMounted, nextTick } from "vue";
import config from '../../../../service/config';
import L from 'leaflet';
import moment from "moment";
import { useStore } from '@/store';
import Service from "../../../../service/api";
const service = new Service();
const store = useStore();
const getMarker = (data) => {
    console.log(data);
    // map_.value.setView([data.device[0].latitude, data.device[0].longgitude], 15);
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
    let marker_ = L.marker([data.latitude, data.longgitude], {
        icon: myIcon,
    }).addTo(map).bindPopup(`
        <div class="grid" style="font-size:1.2rem;color:var(--text-color);width:auto;">
    <div class="col-12">
        <p>เรื่องร้องเรียน</p>
       <p> ${data.cp_title}</p>
       <p>IP@${data.device_ip}</p>
       <p>แจ้งเมื่อ ${data.cp_create_date}</p>
        
    </div>
   
     </div>
    </div>
    `);
    // <div><span>ชื่อ-นามสกุล</span> ${data.pat[0].fristname + " " + data.pat[0].lastname} อายุ ${moment(new Date()).format("YYYY") - moment(data.pat[0].patient_birthday).format("YYYY")}<br>

    marker_.on('mouseover', (e) => {
        marker_.openPopup();
    });
    marker_.on('click', () => {
        map.flyTo(marker_.getLatLng(), 18, { animate: true, duration: 1.5 });
        // link_share_location.value = `https://www.google.com/maps/place/${data.device[0].latitude},${data.device[0].longgitude}`
        // navigator.clipboard.writeText(link_share_location.value);
        // toast.add({ severity: 'success', summary: 'Copy ลิงค์แชร์ตำแหน่งผู้ป่วยเรียบร้อย', detail: 'คุณสามารถนำลิงค์ที่ได้งานได้เลย เช่น วางบน Bowser จะนำคุณไปยัง GoogleMap', life: 5000 });
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
        center: [14, 104],
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
    for (let i = 0; i < data_on_map.value.length; i++) {
        const data = data_on_map.value[i];
        getMarker(data);
    }

}
const map_ = ref(null);
const data_on_map = ref(null);
const mapContainer = ref(null);
const marker = ref(null);
const pin_icon = ref(null);
onMounted(async () => {
    const res = await service.post('read/get-complain', {});
    console.log(res);
    if (res.message == 'success') {
        data_on_map.value = res.data.filter(e => e.latitude != null)
        await nextTick();
        getMap();
    }

})
</script>
<template>
    <div style="overflow: hidden;" id="map_" ref="mapContainer"></div>
</template>
<style scoped>
#map_ {
    width: 100%;
    height: 600px;
    border-radius: 10px;
    margin-top: 15px;
}
</style>