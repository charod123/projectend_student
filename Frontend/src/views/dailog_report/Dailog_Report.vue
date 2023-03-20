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
const audio = ref(new Audio(`${config.backend_url_img}/resources/assets/X2Download.app.mp3`))

const data = ref({
    agency_that_forwards: '',
    detail_patient: '',
    select_more_agnecy: '',
    select_more: '',
    select_lavel: ''
})

const continue_ = async () => {
    visibleFull.value = true
    StopSound();
    await nextTick();
}
onBeforeMount(() => {

})
const get_subdivision = async () => {
    const res = await service.post('/read/get_subdivison', {});
    if (res.message == 'success') {
        subdivision.value = res.data;
        console.log(subdivision.value);
    }
}

// const StopSound = () => {
//     const audio = new Audio('http://localhost:3010/resources/assets/X2Download.app.mp3');
//     audio.pause();
// }
onMounted(() => {

})


const categories = ref([
    { name: 'เร่งด่วน', key: 'A' },
    { name: 'ปานกลาง', key: 'M' },
]);
const selectedCategory = ref(categories.value[1].name);
const checked = ref(false);
const cities = ref([]);

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
        <!-- <audio v-if="show_btn_next" src="http://localhost:3010/resources/assets/X2Download.app.mp3" autoplay></audio> -->
        <Dialog :header="``" v-model:visible="store.show_daiolg_reprot" :style="{ width: '60vw', height: '100%' }"
           :modal="true" style="font-family: Kanit;">
        
            <template #footer>
                <div>
                    <Button v-if="show_btn_next" label="ดำเนินการต่อ" icon="pi pi-angle-right" class="p-button-info mt-4"
                        @click="continue_" />
                </div>
            </template>
        </Dialog>

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
}</style>