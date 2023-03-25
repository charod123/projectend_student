<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed, ref, watch, onMounted } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import config from '../../service/config';
import Service from '../../service/api';
const { layoutConfig, contextPath } = useLayout();
const service = new Service();
const content_new = ref();
const click = ref({});
const content = ref();
const aaa = ref()
const smoothScroll = (id) => {
    document.querySelector(id).scrollIntoView({
        behavior: 'smooth'
    });
};
const items = [
    {
        label: 'File',
        icon: 'pi pi-fw pi-file',
        items: [
            {
                label: 'Delete',
                icon: 'pi pi-fw pi-trash',
                command: () => test('das')
            },
            {
                separator: true
            },
            {
                label: 'Export',
                icon: 'pi pi-fw pi-external-link'
            }
        ]
    }]
const options = ref({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],

    initialDate: '2023-02-01',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true
});
const data_create_complain = ref(``);

watch(data_create_complain, (newVal) => {
    console.log(newVal);
});
onMounted(async () => {
    await get_content();
})

const logoUrl = computed(() => {
    return `${config.backend_url_img}/resources/assets/mian-icon/default/logo-main/78a0ef24252625.56331cb43dba4.jpg`;
});
const get_content = async () => {
    const res = await service.post('/read/get_content_on_show', {});
    if (res.message == 'success') {
        content_new.value = res.data.map(e => {
            console.log(e);
            const data_ = e.sub_menu.map(e_ => {
                return {
                    label: e_.sub_menu_name,
                    command: () => render_content(e_)
                }
            })
            return {
                label: e.main_menu_name,
                items: data_
            }
        })
        console.log(content_new.value);
        content.value = res.data[0].sub_menu[0].detail_on_show
    }
    console.log(res.data);
}
const render_content = (data) => {
    console.log(data);
    content.value = data.detail_on_show

}

const test = (event) => {

    console.log(event);
}
</script>

<template>
    <div class="surface-0 flex justify-content-center">
    <div class="landing-wrapper overflow-hidden w-100rem">
        <div class="block-content">
                <div>
                    <!-- {{ content_new }} -->
                <div
                    class="surface-overlay py-3 px-6 shadow-2 flex align-items-center justify-content-between relative lg:static">
                    <img :src="logoUrl" alt="Image" height="70"><a class="cursor-pointer block lg:hidden text-700"><i
                            class="pi pi-bars text-4xl"></i></a>
                    <div
                        class="align-items-center flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full surface-overlay left-0 top-100 px-6 lg:px-0 z-2 shadow-2 lg:shadow-none">
                        <section></section>
                        <ul
                            class="list-none p-0 m-0 flex lg:align-items-center text-900 select-none flex-column lg:flex-row cursor-pointer">
                            <Menubar style="font-family: Kanit;font-size: 1.2rem;" :model="content_new" />

                            <!-- <li class="relative" @click="click[i] = !click[i]" v-for="(item, i) in content_new"
                                :key="item">
                                <a
                                    class="flex px-0 lg:px-5 py-3 align-items-center hover:text-blue-600 font-medium transition-colors transition-duration-150 p-ripple">

                                    <span>{{ item.main_menu_name }}</span><i
                                        class="pi pi-chevron-down ml-auto lg:ml-3"></i><span class="p-ink"
                                        role="presentation" aria-hidden="true"
                                        style="height: 160px; width: 160px; top: -54.8px; left: 22.5625px;"></span>
                                </a>
                                <ul
                                    :class="`list-none p-0 m-0 border-round shadow-0 lg:shadow-2 lg:absolute surface-overlay origin-top w-full lg:w-15rem ${click[i] ? '' : 'hidden'}`">
                                    <li v-for="ite in item.sub_menu" :key="ite">
                                        <a class="flex p-3 align-items-center hover:surface-50 transition-colors transition-duration-150 p-ripple"
                                            @click="render_content(ite)">
                                            <i class="pi pi-list text-2xl mr-2 text-blue-600"></i>
                                            <span>{{ ite.sub_menu_name }}</span>
                                            <span class="p-ink" role="presentation" aria-hidden="true"
                                                style="height: 240px; width: 240px; top: -93.4px; left: 5.5625px;"></span>
                                        </a>
                                    </li>
                                </ul>
                            </li> -->
                        </ul>
                        <div
                            class="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                            <button class="p-button p-component ml-3 p-button-outlined font-bold" type="button"
                                style="font-family: Kanit;" aria-label="Register"
                                @click="$router.push('/')"><!----><!----><span
                                    class="p-button-label text-xl">กลับไปหน้าหลัก</span><!----><span class="p-ink"
                                    role="presentation" aria-hidden="true"></span></button>
                        </div>
                    </div>
                </div>
                <div class="flex justify-content-center m-4">
                    <div class="md:w-12 lg:w-11 xl:w-10 sm:w-12">
                        <div v-html="content" style="font-family: Kanit;"
                            class="surface-section px-4 py-8 md:px-6 lg:px-8 w-auto"></div>
                    </div>
                </div>
                <!-- <div class="surface-section px-4 py-8 md:px-6 lg:px-8 text-center">
                        <div class="mb-3 font-bold text-3xl"><span class="text-900">One Product, </span><span
                                class="text-blue-600">Many Solutions</span></div>
                        <div class="text-700 mb-6">Ac turpis egestas maecenas pharetra convallis posuere morbi leo urna.
                        </div>
                        <div class="grid">
                            <div class="col-12 md:col-4 mb-4 px-5"><span class="p-3 shadow-2 mb-3 inline-block surface-card"
                                    style="border-radius: 10px;"><i class="pi pi-desktop text-4xl text-blue-500"></i></span>
                                <div class="text-900 text-xl mb-3 font-medium">Built for Developers</div><span
                                    class="text-700 line-height-3">Duis aute irure dolor in reprehenderit in voluptate velit
                                    esse cillum dolore eu fugiat nulla pariatur.</span>
                            </div>
                            <div class="col-12 md:col-4 mb-4 px-5"><span class="p-3 shadow-2 mb-3 inline-block surface-card"
                                    style="border-radius: 10px;"><i class="pi pi-lock text-4xl text-blue-500"></i></span>
                                <div class="text-900 text-xl mb-3 font-medium">End-to-End Encryption</div><span
                                    class="text-700 line-height-3">Risus nec feugiat in fermentum posuere urna nec. Posuere
                                    sollicitudin aliquam ultrices sagittis.</span>
                            </div>
                            <div class="col-12 md:col-4 mb-4 px-5"><span class="p-3 shadow-2 mb-3 inline-block surface-card"
                                    style="border-radius: 10px;"><i
                                        class="pi pi-check-circle text-4xl text-blue-500"></i></span>
                                <div class="text-900 text-xl mb-3 font-medium">Easy to Use</div><span
                                    class="text-700 line-height-3">Ornare suspendisse sed nisi lacus sed viverra tellus.
                                    Neque volutpat ac tincidunt vitae semper.</span>
                            </div>
                            <div class="col-12 md:col-4 mb-4 px-5"><span class="p-3 shadow-2 mb-3 inline-block surface-card"
                                    style="border-radius: 10px;"><i class="pi pi-globe text-4xl text-blue-500"></i></span>
                                <div class="text-900 text-xl mb-3 font-medium">Fast &amp; Global Support</div><span
                                    class="text-700 line-height-3">Fermentum et sollicitudin ac orci phasellus egestas
                                    tellus rutrum tellus.</span>
                            </div>
                            <div class="col-12 md:col-4 mb-4 px-5"><span class="p-3 shadow-2 mb-3 inline-block surface-card"
                                    style="border-radius: 10px;"><i class="pi pi-github text-4xl text-blue-500"></i></span>
                                <div class="text-900 text-xl mb-3 font-medium">Open Source</div><span
                                    class="text-700 line-height-3">Nec tincidunt praesent semper feugiat. Sed adipiscing
                                    diam donec adipiscing tristique risus nec feugiat. </span>
                            </div>
                            <div class="col-12 md:col-4 md:mb-4 mb-0 px-3"><span
                                    class="p-3 shadow-2 mb-3 inline-block surface-card" style="border-radius: 10px;"><i
                                        class="pi pi-shield text-4xl text-blue-500"></i></span>
                                <div class="text-900 text-xl mb-3 font-medium">Trusted Security</div><span
                                    class="text-700 line-height-3">Mattis rhoncus urna neque viverra justo nec ultrices. Id
                                    cursus metus aliquam eleifend.</span>
                            </div>
                        </div>
                    </div> -->

                <!-- <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
                        <div>
                            <div class="text-blue-600 text-2xl mb-4 text-center">Save up to 25% today</div>
                            <div class="text-900 font-bold text-4xl text-center mb-4">Pricing Plans</div>
                            <div class="flex align-items-center justify-content-center text-900"><span
                                    class="font-semibold mr-3">Monthly</span>
                                                        <div class="p-inputswitch p-component">
                                        <div class="p-hidden-accessible"><input type="checkbox" role="switch" class=""
                                                        aria-checked="false"></div><span class="p-inputswitch-slider"></span>
                                </div><span class="ml-3">Yearly</span>
                            </div>
                            <div class="flex flex-column md:flex-row mt-6">
                                        <div class="mb-6 md:mb-0 mr-0 md:mr-4 flex flex-column flex-grow-1">
                                        <div class="bg-bluegray-100 text-center p-3" style="border-radius: 6px 6px 0px 0px;">
                                                            <div class="text-2xl font-bold text-bluegray-900 mb-3">Basic</div>
                                            <div class="flex align-items-center justify-content-center"><span
                                                    class="font-bold text-bluegray-900 text-5xl mr-2">10$</span><span
                                                class="text-2xl text-bluegray-400"> / month</span></div>
                                        </div>
                                    <div class="bg-bluegray-50 p-4 flex flex-column flex-grow-1"
                                        style="box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 8px inset; border-radius: 0px 0px 6px 6px;">
                                            <div class="text-bluegray-500 font-bold line-height-3 mb-4">Ut enim ad minim veniam,
                                            quis nostrud exercitation.</div>
                                        <ul class="list-none p-0 m-0 mb-5 text-bluegray-600">
                                                <li class="flex align-items-center mb-3"><i
                                                    class="pi pi-circle-fill mr-2 text-sm"></i><span>Arcu vitae
                                                            elementum</span></li>
                                            <li class="flex align-items-center"><i
                                                    class="pi pi-circle-fill mr-2 text-sm"></i><span>Dui faucibus in
                                                    ornare</span></li>
                                        </ul><button class="p-button p-component p-button-secondary w-full mt-auto"
                                            type="button" aria-label="Try Free"><span
                                                class="p-button-label">Try Free</span><span class="p-ink"
                                                role="presentation" aria-hidden="true"></span></button>
                                    </div>
                                </div>
                                <div class="mb-6 md:mb-0 mr-0 md:mr-4 flex flex-column flex-grow-1">
                                    <div class="bg-bluegray-800 text-center p-3 border-3 border-green-500 border-bottom-none"
                                        style="border-radius: 6px 6px 0px 0px;">
                                        <div class="bg-green-500 text-0 font-bold text-sm inline-block p-2 mb-3"
                                            style="border-radius: 20px;">MOST POPULAR</div>
                                        <div class="text-2xl font-bold text-white mb-3">Premium</div>
                                        <div class="flex align-items-center justify-content-center"><span
                                                class="font-bold text-white text-5xl mr-2">20$</span><span
                                                class="text-2xl text-bluegray-400"> / month</span></div>
                                        </div>
                                    <div class="bg-bluegray-900 p-4 flex flex-column flex-grow-1 border-3 border-green-500 border-top-none"
                                        style="box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 8px inset; border-radius: 0px 0px 6px 6px;">
                                        <div class="text-bluegray-400 font-bold line-height-3 mb-4">Ullamco laboris nisi ut
                                            aliquip ex ea commodo consequat.</div>
                                                                <ul class="list-none p-0 m-0 mb-5 text-bluegray-100">
                                                                        <li class="flex align-items-center mb-3"><i
                                                                                            class="pi pi-circle-fill mr-2 text-sm"></i><span>Arcu vitae
                                                                                            elementum</span></li>
                                                                                    <li class="flex align-items-center mb-3"><i
                                                                                            class="pi pi-circle-fill mr-2 text-sm"></i><span>Dui faucibus in
                                                                                                    ornare</span></li>
                                                                                                <li class="flex align-items-center mb-3"><i
                                                                                                                            class="pi pi-circle-fill mr-2 text-sm"></i><span>Morbi tincidunt
                                                                                                                                augue</span></li>
                                                                                                                            <li class="flex align-items-center"><i
                                                                                                                                    class="pi pi-circle-fill mr-2 text-sm"></i><span>Duis ultricies lacus
                                                                                                                                        sed</span></li>
                                                                                                                            </ul><button class="p-button p-component p-button-success w-full mt-auto"
                                                                                                                                type="button" aria-label="Buy Now"><span
                                                                                                                                    class="p-button-label">Buy Now</span><span class="p-ink"
                                                                                                                                    role="presentation" aria-hidden="true"></span></button>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div class="mb-6 md:mb-0 flex flex-column flex-grow-1">
                                                                                                                                <div class="bg-blue-800 text-center p-3" style="border-radius: 6px 6px 0px 0px;">
                                                                                                                                    <div class="text-2xl font-bold text-white mb-3">Enterprise</div>
                                                                                                                                    <div class="flex align-items-center justify-content-center"><span
                                                                                                                                                class="font-bold text-white text-5xl mr-2">30$</span><span
                                                                                                                                        class="text-2xl text-blue-400"> / month</span></div>
                                                                                                                            </div>
                                                                                                                                <div class="bg-blue-900 p-4 flex flex-column flex-grow-1"
                                                                                                                                style="box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 8px inset; border-radius: 0px 0px 6px 6px;">
                                                                                                                                <div class="text-blue-400 font-bold line-height-3 mb-4">Duis aute irure dolor in
                                                                                                                                reprehenderit in voluptate velit.</div>
                                                                                                                            <ul class="list-none p-0 m-0 mb-5 text-blue-100">
                                                                                                                                <li class="flex align-items-center mb-3"><i
                                                                                                                                            class="pi pi-circle-fill mr-2 text-sm"></i><span>Arcu vitae
                                                                                                                                        elementum</span></li>
                                                                                                                                <li class="flex align-items-center mb-3"><i
                                                                                                                                        class="pi pi-circle-fill mr-2 text-sm"></i><span>Dui faucibus in
                                                                                                                                ornare</span></li>
                                                                                                                        <li class="flex align-items-center mb-3"><i
                                                                                                                class="pi pi-circle-fill mr-2 text-sm"></i><span>Morbi tincidunt
                                                                                                                    augue</span></li>
                                                                                                            <li class="flex align-items-center mb-3"><i
                                                                                                                    class="pi pi-circle-fill mr-2 text-sm"></i><span>Duis ultricies lacus
                                                                                                            sed</span></li>
                                                                                                <li class="flex align-items-center mb-3"><i
                                                                                            class="pi pi-circle-fill mr-2 text-sm"></i><span>Imperdiet proin</span>
                                                                            </li>
                                                                            </ul><button class="p-button p-component p-button-outlined w-full mt-auto"
                                                                    type="button" aria-label="Contact Us"><span
                                                                    class="p-button-label">Contact Us</span><span class="p-ink"
                                                                    role="presentation" aria-hidden="true"></span></button>
                                                                </div>
                                                    </div>
                                                                </div>
                                            </div>
                                    </div> -->
                <!-- <div class="surface-ground">
                                <div class="grid grid-nogutter">
                                <div class="col-12 md:col-6 bg-no-repeat bg-cover p-8"
                                    style="background-image: url(&quot;images/blocks/contact/contact-2.jpg&quot;);">
                                        <div class="text-white text-2xl font-medium mb-6">Contact Us</div>
                                    <div class="text-gray-300 line-height-3 mb-6">Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </div><a
                                        class="inline-flex align-items-center text-blue-300 font-bold no-underline cursor-pointer"><span
                                                    class="mr-3">View Address on Google Maps</span><i class="pi pi-arrow-right"></i></a>
                                    <ul class="list-none p-0 m-0 mt-6 text-white">
                                        <li class="flex align-items-center mb-3"><i
                                                class="pi pi-phone mr-2"></i><span>+123456789</span></li>
                                        <li class="flex align-items-center mb-3"><i
                                                class="pi pi-twitter mr-2"></i><span>@prime_vue</span></li>
                                        <li class="flex align-items-center"><i
                                                class="pi pi-inbox mr-2"></i><span>contact@primetek.com.tr</span></li>
                                    </ul>
                                </div>
                            <div class="col-12 md:col-6">
                            <div class="p-fluid formgrid grid px-4 py-8 md:px-6 lg:px-8">
                                <div class="field col-12 lg:col-6 mb-4"><input
                                        class="p-inputtext p-component py-3 px-2 text-lg" id="firstname" type="text"
                                        placeholder="First Name"></div>
                                <div class="field col-12 lg:col-6 mb-4"><input
                                        class="p-inputtext p-component py-3 px-2 text-lg" id="lastname" type="text"
                                        placeholder="Last Name"></div>
                                    <div class="field col-12 mb-4"><input class="p-inputtext p-component py-3 px-2 text-lg"
                                            id="email" type="text" placeholder="Email"></div>
                                <div class="field col-12 mb-4"><input class="p-inputtext p-component py-3 px-2 text-lg"
                                        id="phone" type="text" placeholder="Phone"></div>
                                <div class="field col-12 mb-4"><textarea
                                        class="p-inputtextarea p-inputtext p-component p-inputtextarea-resizable py-3 px-2 text-lg"
                                        id="message" rows="3" placeholder="Message"
                                        style="height: calc(105.6px); overflow: hidden;"></textarea></div>
                                <div class="col-12 text-right"><button class="p-button p-component px-5 py-3 w-auto"
                                        type="button" aria-label="Submit"><span
                                            class="pi pi-envelope p-button-icon p-button-icon-left"></span><span
                                            class="p-button-label">Submit</span><span class="p-ink"
                                            role="presentation" aria-hidden="true"></span></button></div>
                            </div>
                        </div>
                    </div>
                </div> -->
                <div class="bg-gray-900 px-4 py-8 md:px-6 lg:px-8">
                    <div class="grid">
                        <div class="col-12 md:col-6">
                            <div class="pr-0 md:pr-8">
                                <div class="text-blue-500 font-bold text-5xl mb-5">ข้อมูลผิดพลาดประการใดขออภัยมา ณ
                                    ที่นี้</div>
                                <div class="mb-5 border-blue-500 pl-3" style="border-left: 4px solid;"><span
                                        class="text-white font-bold text-2xl">โรคที่พบบ่อย</span>
                                    <div class="text-gray-400 line-height-3 mt-3"> โรคที่มักพบบ่อย:
                                        <strong>โรคหัวใจและหลอดเลือด</strong>, <strong>โรคเบาหวาน</strong>,
                                        <strong>โรคความดันโลหิตสูง</strong>, <strong>โรคมะเร็ง</strong>, และอื่นๆ.</div>
                                </div>

                            </div>
                        </div>
                        <div class="md:col-3"></div>
                        <div class="col-12 md:col-3"><img
                                src="https://ehr.meditech.com/themes/ehrmeditech/images/campaigns/physician-sitting-with-patient-talking.jpg"
                                alt="Image" class="w-full" height="280" ></div>
                    </div>
                </div>
            </div><!---->
        </div>

        <!-- <Editor v-model="content" :style="{ height: '100vh' }" :init="tinymceSettings">
            <template #toolbar>
                <span class="ql-formats">
                    <button class="ql-bold"></button>
                    <button class="ql-italic"></button>
                    <button class="ql-underline"></button>
                </span>
            </template>
        </Editor> -->
        <!-- 
            <div id="hero" class="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
                style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%)">
                <div class="mx-4 md:mx-8 mt-0 md:mt-4">
                    <h1 class="text-6xl font-bold text-gray-900 line-height-2"><span class="font-light block">Eu sem
                            integer</span>eget magna fermentum</h1>
                    <p class="font-normal text-2xl line-height-3 md:mt-3 text-gray-700">Sed blandit libero volutpat sed
                        cras. Fames ac turpis egestas integer. Placerat in egestas erat...</p>
                    <Button label="Get Started"
                        class="p-button-rounded text-xl border-none mt-5 bg-blue-500 font-normal text-white line-height-3 px-3"></Button>
                </div>
                <div class="flex justify-content-center md:justify-content-end">
                    <img src="/demo/images/landing/screen-1.png" alt="Hero Image" class="w-9 md:w-auto" />
                </div>
            </div>

            <div id="features" class="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                <div class="grid justify-content-center">
                    <div class="col-12 text-center mt-8 mb-4">
                        <h2 class="text-900 font-normal mb-2">Marvelous Features</h2>
                        <span class="text-600 text-2xl">Placerat in egestas erat...</span>
                    </div>

                    <div class="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))">
                            <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                <div class="flex align-items-center justify-content-center bg-yellow-200 mb-3"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-users text-2xl text-yellow-700"></i>
                                </div>
                                <h5 class="mb-2 text-900">Easy to Use</h5>
                                <span class="text-600">Posuere morbi leo urna molestie.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))">
                            <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                <div class="flex align-items-center justify-content-center bg-cyan-200 mb-3"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-palette text-2xl text-cyan-700"></i>
                                </div>
                                <h5 class="mb-2 text-900">Fresh Design</h5>
                                <span class="text-600">Semper risus in hendrerit.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 md:col-12 lg:col-4 p-0 lg:pb-5 mt-4 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(246, 158, 188, 0.2))">
                            <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                <div class="flex align-items-center justify-content-center bg-indigo-200"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-map text-2xl text-indigo-700"></i>
                                </div>
                                <h5 class="mb-2 text-900">Well Documented</h5>
                                <span class="text-600">Non arcu risus quis varius quam quisque.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(187, 199, 205, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(145, 210, 204, 0.2))">
                            <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                <div class="flex align-items-center justify-content-center bg-bluegray-200 mb-3"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-id-card text-2xl text-bluegray-700"></i>
                                </div>
                                <h5 class="mb-2 text-900">Responsive Layout</h5>
                                <span class="text-600">Nulla malesuada pellentesque elit.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(187, 199, 205, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(145, 226, 237, 0.2), rgba(160, 210, 250, 0.2))">
                            <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                <div class="flex align-items-center justify-content-center bg-orange-200 mb-3"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-star text-2xl text-orange-700"></i>
                                </div>
                                <h5 class="mb-2 text-900">Clean Code</h5>
                                <span class="text-600">Condimentum lacinia quis vel eros.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 md:col-12 lg:col-4 p-0 lg:pb-5 mt-4 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(251, 199, 145, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(212, 162, 221, 0.2))">
                            <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                <div class="flex align-items-center justify-content-center bg-pink-200 mb-3"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-moon text-2xl text-pink-700"></i>
                                </div>
                                <h5 class="mb-2 text-900">Dark Mode</h5>
                                <span class="text-600">Convallis tellus id interdum velit laoreet.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 mt-4 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(160, 210, 250, 0.2)), linear-gradient(180deg, rgba(187, 199, 205, 0.2), rgba(145, 210, 204, 0.2))">
                            <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                <div class="flex align-items-center justify-content-center bg-teal-200 mb-3"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-shopping-cart text-2xl text-teal-700"></i>
                                </div>
                                <h5 class="mb-2 text-900">Ready to Use</h5>
                                <span class="text-600">Mauris sit amet massa vitae.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 mt-4 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(251, 199, 145, 0.2), rgba(160, 210, 250, 0.2))">
                            <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                <div class="flex align-items-center justify-content-center bg-blue-200 mb-3"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-globe text-2xl text-blue-700"></i>
                                </div>
                                <h5 class="mb-2 text-900">Modern Practices</h5>
                                <span class="text-600">Elementum nibh tellus molestie nunc non.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 md:col-12 lg:col-4 p-0 lg-4 mt-4 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(160, 210, 250, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(246, 158, 188, 0.2), rgba(212, 162, 221, 0.2))">
                            <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                <div class="flex align-items-center justify-content-center bg-purple-200 mb-3"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-eye text-2xl text-purple-700"></i>
                                </div>
                                <h5 class="mb-2 text-900">Privacy</h5>
                                <span class="text-600">Neque egestas congue quisque.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 mt-8 mb-8 p-2 md:p-8"
                        style="border-radius: 20px; background: linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #efe1af 0%, #c3dcfa 100%)">
                        <div
                            class="flex flex-column justify-content-center align-items-center text-center px-3 py-3 md:py-0">
                            <h3 class="text-gray-900 mb-2">Joséphine Miller</h3>
                            <span class="text-gray-600 text-2xl">Peak Interactive</span>
                            <p class="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-4"
                                style="max-width: 800px">
                                “Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                                nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                deserunt mollit anim id est laborum.”
                            </p>
                            <img src="/demo/images/landing/peak-logo.svg" class="mt-4" alt="Company logo" />
                        </div>
                    </div>
                </div>
            </div>

            <div id="highlights" class="py-4 px-4 lg:px-8 mx-0 my-6 lg:mx-8">
                <div class="text-center">
                    <h2 class="text-900 font-normal mb-2">Powerful Everywhere</h2>
                    <span class="text-600 text-2xl">Amet consectetur adipiscing elit...</span>
                </div>

                <div class="grid mt-8 pb-2 md:pb-8">
                    <div class="flex justify-content-center col-12 lg:col-6 bg-purple-100 p-0 flex-order-1 lg:flex-order-0"
                        style="border-radius: 8px">
                        <img src="/demo/images/landing/mockup.svg" class="w-11" alt="mockup mobile" />
                    </div>

                    <div class="col-12 lg:col-6 my-auto flex flex-column lg:align-items-end text-center lg:text-right">
                        <div class="flex align-items-center justify-content-center bg-purple-200 align-self-center lg:align-self-end"
                            style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                            <i class="pi pi-fw pi-mobile text-5xl text-purple-700"></i>
                            </div>
                            <h2 class="line-height-1 text-900 text-4xl font-normal">Congue Quisque Egestas</h2>
                            <span class="text-700 text-2xl line-height-3 ml-0 md:ml-2" style="max-width: 650px">Lectus arcu
                                        bibendum at varius vel pharetra vel turpis nunc. Eget aliquet nibh praesent tristique magna sit
                                        amet purus gravida. Sit amet mattis vulputate enim nulla aliquet.</span>
                                </div>
                                </div>

                                        <div class="grid my-8 pt-2 md:pt-8">
                                                <div class="col-12 lg:col-6 my-auto flex flex-column text-center lg:text-left lg:align-items-start">
                                                    <div class="flex align-items-center justify-content-center bg-yellow-200 align-self-center lg:align-self-start"
                                                        style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                                                                <i class="pi pi-fw pi-desktop text-5xl text-yellow-700"></i>
                                                            </div>
                                                            <h2 class="line-height-1 text-900 text-4xl font-normal">Celerisque Eu Ultrices</h2>
                                                                <span class="text-700 text-2xl line-height-3 mr-0 md:mr-2" style="max-width: 650px">Adipiscing
                                                                    commodo elit at imperdiet dui. Viverra nibh cras pulvinar mattis nunc sed blandit libero.
                                                                    Suspendisse in est ante in. Mauris pharetra et ultrices neque ornare aenean euismod elementum
                                                                    nisi.</span>
                                                            </div>

                                                            <div class="flex justify-content-end flex-order-1 sm:flex-order-2 col-12 lg:col-6 bg-yellow-100 p-0"
                                                                style="border-radius: 8px">
                                                                <img src="/demo/images/landing/mockup-desktop.svg" class="w-11" alt="mockup" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div id="pricing" class="py-4 px-4 lg:px-8 my-2 md:my-4">
                                                        <div class="text-center">
                                                            <h2 class="text-900 font-normal mb-2">Matchless Pricing</h2>
                                                            <span class="text-600 text-2xl">Amet consectetur adipiscing elit...</span>
                                                        </div>

                                                        <div class="grid justify-content-between mt-8 md:mt-0">
                                                            <div class="col-12 lg:col-4 p-0 md:p-3">
                                                                <div class="p-3 flex flex-column border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all"
                                                                    style="border-radius: 10px">
                                                                    <h3 class="text-900 text-center my-5">Free</h3>
                                                                    <img src="/demo/images/landing/free.svg" class="w-10 h-10 mx-auto" alt="free" />
                                                                    <div class="my-5 text-center">
                                                                        <span class="text-5xl font-bold mr-2 text-900">$0</span>
                                                                        <span class="text-600">per month</span>
                                                                        <Button label="Get Started"
                                                                            class="block mx-auto mt-4 p-button-rounded border-none ml-3 font-light line-height-2 bg-blue-500 text-white"></Button>
                                                                    </div>
                                                                    <Divider class="w-full bg-surface-200"></Divider>
                                                                    <ul class="my-5 list-none p-0 flex text-900 flex-column">
                                                                        <li class="py-2">
                                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                                            <span class="text-xl line-height-3">Responsive Layout</span>
                                                                        </li>
                                                                        <li class="py-2">
                                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                                            <span class="text-xl line-height-3">Unlimited Push Messages</span>
                                                                        </li>
                                                                        <li class="py-2">
                                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                                            <span class="text-xl line-height-3">50 Support Ticket</span>
                                                                        </li>
                                                                        <li class="py-2">
                                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                                            <span class="text-xl line-height-3">Free Shipping</span>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>

                                                            <div class="col-12 lg:col-4 p-0 md:p-3 mt-4 md:mt-0">
                                                                <div class="p-3 flex flex-column border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all"
                                                                    style="border-radius: 10px">
                                                                    <h3 class="text-900 text-center my-5">Startup</h3>
                                                                    <img src="/demo/images/landing/startup.svg" class="w-10 h-10 mx-auto" alt="startup" />
                                                                    <div class="my-5 text-center">
                                                                        <span class="text-5xl font-bold mr-2 text-900">$1</span>
                                                                        <span class="text-600">per month</span>
                                                                        <Button label="Try Free"
                                                                            class="block mx-auto mt-4 p-button-rounded border-none ml-3 font-light line-height-2 bg-blue-500 text-white"></Button>
                                                                    </div>
                                                                    <Divider class="w-full bg-surface-200"></Divider>
                                                                    <ul class="my-5 list-none p-0 flex text-900 flex-column">
                                                                        <li class="py-2">
                                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                                            <span class="text-xl line-height-3">Responsive Layout</span>
                                                                                                </li>
                                                                                                    <li class="py-2">
                                                                                                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                                                                                    <span class="text-xl line-height-3">Unlimited Push Messages</span>
                                                                                                                </li>
                                                                                                                <li class="py-2">
                                                                                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                                                                                                <span class="text-xl line-height-3">50 Support Ticket</span>
                                                                                                                                                </li>
                                                                                                                                                    <li class="py-2">
                                                                                                                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                                                                                                                            <span class="text-xl line-height-3">Free Shipping</span>
                                                                                                                                                            </li>
                                                                                                                                                        </ul>
                                                                                                                                                    </div>
                                                                                                                                                    </div>

                                                                                                                                                    <div class="col-12 lg:col-4 p-0 md:p-3 mt-4 md:mt-0">
                                                                                                                                                            <div class="p-3 flex flex-column border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all"
                                                                                                                                                                style="border-radius: 10px">
                                                                                                                                                                        <h3 class="text-900 text-center my-5">Enterprise</h3>
                                                                                                                                                                        <img src="/demo/images/landing/enterprise.svg" class="w-10 h-10 mx-auto" alt="enterprise" />
                                                                                                                                                                        <div class="my-5 text-center">
                                                                                                                                                                            <span class="text-5xl font-bold mr-2 text-900">$999</span>
                                                                                                                                                                            <span class="text-600">per month</span>
                                                                                                                                                                            <Button label="Get a Quote"
                                                                                                                                                                                class="block mx-auto mt-4 p-button-rounded border-none ml-3 font-light line-height-2 bg-blue-500 text-white"></Button>
                                                                                                                                                                        </div>
                                                                                                                                                                                <Divider class="w-full bg-surface-200"></Divider>
                                                                                                                                                                                        <ul class="my-5 list-none p-0 flex text-900 flex-column">
                                                                                                                                                                                            <li class="py-2">
                                                                                                                                                                                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                                                                                                                                                                <span class="text-xl line-height-3">Responsive Layout</span>
                                                                                                                                                                                            </li>
                                                                                                                                                                                            <li class="py-2">
                                                                                                                                                                                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                                                                                                                                                                <span class="text-xl line-height-3">Unlimited Push Messages</span>
                                                                                                                                                                                                </li>
                                                                                                                                                                                                <li class="py-2">
                                                                                                                                                                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                                                                                                                                                                            <span class="text-xl line-height-3">50 Support Ticket</span>
                                                                                                                                                                                                            </li>
                                                                                                                                                                                                                <li class="py-2">
                                                                                                                                                                                                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                                                                                                                                                                                    <span class="text-xl line-height-3">Free Shipping</span>
                                                                                                                                                                                                                </li>
                                                                                                                                                                                                            </ul>
                                                                                                                                                                                                        </div>
                                                                                                                                                                                                    </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                            </div>

                                                                                                                                                                                            <div class="py-4 px-4 mx-0 mt-8 lg:mx-8">
                                                                                                                                                                                                <div class="grid justify-content-between">
                                                                                                                                                                                                    <div class="col-12 md:col-2" style="margin-top: -1.5rem">
                                                                                                                                                                                                        <a @click="smoothScroll('#home')"
                                                                                                                                                                                                            class="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer">
                                                                                                                                                                                                            <img :src="logoUrl" alt="footer sections" width="50" height="50" class="mr-2" />
                                                                                                                                                                                                            <h4 class="font-medium text-3xl text-900">SAKAI</h4>
                                                                                                                                                                                                        </a>
                                                                                                                                                                                                    </div>

                                                                                                                                                                                                    <div class="col-12 md:col-10 lg:col-7">
                                                                                                                                                                                                        <div class="grid text-center md:text-left">
                                                                                                                                                                                                            <div class="col-12 md:col-3">
                                                                                                                                                                                                                <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Company</h4>
                                                                                                                                                                                                            <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">About Us</a>
                                                                                                                                                                                                            <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">News</a>
                                                                                                                                                                                                            <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Investor Relations</a>
                                                                                                                                                                                                            <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Careers</a>
                                                                                                                                                                                                            <a class="line-height-3 text-xl block cursor-pointer text-700">Media Kit</a>
                                                                                                                                                                                                        </div>

                                                                                                                                                                                                        <div class="col-12 md:col-3 mt-4 md:mt-0">
                                                                                                                                                                                                            <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Resources</h4>
                                                                                                                                                                                                            <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Get Started</a>
                                                                                                                                                                                                            <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Learn</a>
                                                                                                                                                                                                            <a class="line-height-3 text-xl block cursor-pointer text-700">Case Studies</a>
                                                                                                                                                                                                        </div>

                                                                                                                                                                                                        <div class="col-12 md:col-3 mt-4 md:mt-0">
                                                                                                                                                                                                            <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Community</h4>
                                                                                                                                                                                                            <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Discord</a>
                                                                                                                                                                                                            <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Events<img
                                                                                                                                                                                                                    src="/demo/images/landing/new-badge.svg" class="ml-2" /></a>
                                                                                                                                                                                                            <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">FAQ</a>
                                                                                                                                                                                                            <a class="line-height-3 text-xl block cursor-pointer text-700">Blog</a>
                                                                                                                                                                                                        </div>

                                                                                                                                                                                                        <div class="col-12 md:col-3 mt-4 md:mt-0">
                                                                                                                                                                                                            <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Legal</h4>
                                                                                                                                                                                                            <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Brand Policy</a>
                                                                                                                                                                                                            <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Privacy Policy</a>
                                                                                                                                                                                                        <a class="line-height-3 text-xl block cursor-pointer text-700">Terms of Service</a>
                                                                                                                                                                                                    </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                            </div>
                                                                                                                                                                                        </div>
                                                                                                                                                                                    </div> -->
        </div>
    </div>
    <AppConfig simple />
</template>

<!-- <style scoped>
#hero {
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #eeefaf 0%, #c3e3fa 100%);
    height: 700px;
    overflow: hidden;
}

@media screen and (min-width: 768px) {
    #hero {
        -webkit-clip-path: ellipse(150% 87% at 93% 13%);
        clip-path: ellipse(150% 87% at 93% 13%);
        height: 530px;
    }
}

@media screen and (min-width: 1300px) {
    #hero > img {
        position: absolute;
    }

    #hero > div > p {
        max-width: 450px;
    }
}

@media screen and (max-width: 1300px) {
    #hero {
        height: 600px;
    }

    #hero > img {
        position: static;
        transform: scale(1);
        margin-left: auto;
    }

    #hero > div {
        width: 100%;
    }

    #hero > div > p {
        width: 100%;
        max-width: 100%;
    }
}
</style> --> 


<style scoped>
@media screen and (max-width: 960px) {
    ::v-deep(.fc-header-toolbar) {
        display: flex;
        flex-wrap: wrap;
    }
}</style>