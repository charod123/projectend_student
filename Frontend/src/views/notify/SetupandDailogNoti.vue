<script setup>
import { onMounted, onBeforeMount, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import L from 'leaflet';
import moment from 'moment';
import { useToast } from 'primevue/usetoast';
import config from '@/service/config';
import { useStore } from '@/store';
import Service from '../../service/api';
const service = new Service()
const store = useStore();
const router = useRouter();
const websocket = ref(null)
const message = ref('')
const displayConfirmation = ref(false);
const iduser = JSON.parse(localStorage.getItem("details"))
const map_ = ref(null);
const marker = ref([]);
const pin_icon = ref(null);
const countpat = ref(0);
const visibleFull = ref(false);
const socket = ref(null);
const mapContainer = ref(null);
const link_share_location = ref('');
const toast = useToast();
const subdivision = ref(null);
const show_btn_next = ref(false);
const audio = ref(new Audio('http://localhost:3010/resources/assets/X2Download.app.mp3'))

const data = ref({
    agency_that_forwards: '',
    detail_patient: '',
    select_more_agnecy: '',
    select_more: '',
    select_lavel: ''
})
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

const continue_ = async () => {
    visibleFull.value = true
    StopSound();
    await nextTick();
    getMap();
}
onBeforeMount(() => {
    const port = config.backend_url_socket
    socket.value = new WebSocket(port);

})
const get_subdivision = async () => {
    const res = await service.post('/read/get_subdivison', {});
    if (res.message == 'success') {
        subdivision.value = res.data;
        console.log(subdivision.value);
    }
}

const StopSound = () => {
    const audio = new Audio('http://localhost:3010/resources/assets/X2Download.app.mp3');
    audio.pause();
}
onMounted(() => {
    // getMap();
    socket.value.onopen = () => {
        console.log('WebSocket connected')
    }
    socket.value.onmessage = async (event) => {
        if (!JSON.parse(event.data).status && JSON.parse(event.data) != 'connection') {
            message.value = JSON.parse(event.data);
            console.log(message.value);
            if (message.value.pat && iduser?.email == message.value.pat[0]?.user_id || message.value.pat[0]?.division_id == iduser?.division_id) {
                show_btn_next.value = store.priority.filter(x => x.priority_id == 8)[0].can_write == 1 ? true : false;

                await get_subdivision();
                if (!message.value.not_token_line) {
                    displayConfirmation.value = true;
                }
                console.log(message.value.not_token_line);
                if (message.value.not_token_line) {
                    toast.add({ severity: 'error', summary: 'คุณมีแจ้งเตือนฉุกเฉินใหม่', detail: 'กรุณาแอดลงทะเบียนไลน์', group: 'bc' });
                }
                await nextTick();
                getMap();

            }
        }


    }

    socket.value.onclose = () => {
        console.log('WebSocket closed')
    }
})


const categories = ref([
    { name: 'เร่งด่วน', key: 'A' },
    { name: 'ปานกลาง', key: 'M' },
]);
const selectedCategory = ref(categories.value[1].name);
const checked = ref(false);
const cities = ref([]);
const categories_ = ref([
    { name: 'โรงพยาบาล', key: 'H' },
    { name: 'กู้ภัย', key: 'R' },
    { name: 'ตำรวจ', key: 'P' },
    { name: 'อื่นๆ', key: 'M' }
]);
const save = async (data, message) => {
    console.log(message);
    debugger
    const pay = {
        ni_id: message.ni_id[0].ni_id,
        detail_deliver: data.agency_that_forwards,
        detail_patient: data.detail_patient,
        lavel: data.select_lavel,
        agency_more: data.select_more,
        internal_division: data.select_more_agnecy

    }
    const res = await service.post('/write/performance_record_notify', pay);
    if (res.message == 'success') {
        toast.add({ severity: 'success', summary: 'บันทึกสำเร็จ', life: 2000 });
        displayConfirmation.value = false;
        visibleFull.value = false;
    }
}
const onConfirm = () => {
    toast.removeGroup('bc');
    router.push('/register_linenotify')
}
</script>
<template>
    <div>
        <audio v-if="show_btn_next" src="http://localhost:3010/resources/assets/X2Download.app.mp3" autoplay></audio>
        <Dialog :header="``" v-model:visible="displayConfirmation" :style="{ width: '60vw', height: '100vh' }"
            :closable="false" :modal="true" style="font-family: Kanit;">

            <!-- มีการแจ้งเตือนเมื่อ ${moment(message.notify?.data.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')} -->
            <div class="flex justify-content-center">
                <img :src="`${config.backend_url_img}/resources/assets/mian-icon/default/icon-sos/image_26.png`" alt=""
                    height="100"><br>
            </div>
            <div class="flex justify-content-center">
                <p class="font-bold text-5xl">มีการแจ้งเหตุฉุกเฉิน</p>

            </div>

            <div class="confirmation-content">
                <div class="grid">
                    <div class="col-10" id="map" ref="mapContainer" />
                </div>
                <div class="grid mt-5">
                    <div class="lg:col-10" style="margin: 0 auto;">
                        <div class="grid">
                            <div class="col-6">
                                <p class="text-left text-3xl font-bold text-black-500 mr-3">ข้อมูลผู้สูงอายุหรือ
                                    ผู้ป่วยติดเตียง</p>
                                <p class="line-height-3 text-2xl w-10">ชื่อ-นามสกุล {{ message.pat[0]?.fristname + ' '
                                    + message.pat[0]?.lastname }} อายุ {{ moment(new Date()).format("YYYY") -
        moment(message.pat[0]?.birthday).format('YYYY') }}
                                    เพศ {{ message.pat[0]?.gender }}</p>
                            </div>
                            <div class="col-6">
                                <p class="text-left text-3xl font-bold text-black-500 mr-3">ญาติที่สามารถติดต่อได้</p>
                                <ul class="list-decimal">
                                    <li class="text-2xl" v-for="item in message.usertry" :key="item">
                                        ชื่อ-นามสกุล {{
                                            item.fristname + " " +
                                            item.lastname
                                        }} เบอร์โทร {{ !item.phone ? 'ไม่มีเบอร์มือถือ' : item.phone }} <br>
                                        ความสัมพันธ์กับผู้ป่วย {{ item.ut_relationship }}
                                    </li>

                                </ul>
                            </div>
                        </div>




                    </div>
                </div>
            </div>
            <template #footer>
                <div>
                    <Button v-if="show_btn_next" label="ดำเนินการต่อ" icon="pi pi-angle-right" class="p-button-info mt-4"
                        @click="continue_" />
                </div>
            </template>
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
                        <p class="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-4" style="max-width: 800px">
                            ชื่อ-นามสกุล {{ message.pat[0].fristname + ' ' + message.pat[0].lastname }}
                        </p>
                        <h3 class="text-gray-1000 mb-2 text-3xl">ที่อยุ่</h3>
                        <p class="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-4" style="max-width: 800px">
                            บ้านเลขที่ {{ message.pat[0].member }} ถนน {{ message.pat[0].road }} ซอย {{ message.pat[0].alley
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
                                <Checkbox :inputId="sub.subdivision_id" name="category" :value="sub.subdivision_name"
                                    v-model="data.select_more_agnecy" />
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
        <Toast position="center" group="bc">
            <template #message="slotProps">
                <div class="flex flex-column" style="width: 100%;font-family: Kanit;">
                    <div class="text-center">
                        <i class="pi pi-exclamation-triangle" style="font-size: 3rem"></i>
                        <h4>{{ slotProps.message.summary }}</h4>
                        <p class="mb-4">{{ slotProps.message.detail }}</p>
                    </div>
                    <div class="grid p-fluid">
                        <div class="col-12">
                            <Button class="p-button-success" label="ไปยังหน้าขั้นตอนลงทะเบียน" @click="onConfirm"></Button>
                        </div>

                    </div>
                </div>
            </template>
        </Toast>
    </div>
</template>
<style scoped>
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