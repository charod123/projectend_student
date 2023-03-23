<script setup>
import { ref, onMounted } from 'vue';
import Service from '../service/api';
import AppMenuItem from './AppMenuItem.vue';
import { useStore } from '../store';

const store = useStore();

const service = new Service();
const model = ref([

    {
        label: 'ระบบเฝ้าระวังฉุกเฉิน',
        items: [
            { label: 'หน้าสรุปข้อมูล', icon: 'pi pi-fw pi-id-card', to: '/admin/user/dashboard', flag: 0, priority_id: 1 },
            { label: 'หน้าหลัก', icon: 'pi pi-fw pi-id-card', to: '/mainstram', flag: 0, priority_id: 1 },
            { label: 'จัดการข้อมูล', icon: 'pi pi-fw pi-id-card', to: '/main/patient/datapatients', flag: 0, priority_id: 16 },
            { label: 'ตั้งค่า', icon: 'pi pi-fw pi-id-card', to: '/main/config/subdivision', flag: 0, priority_id: 2 },
            { label: 'วิธีการลงทะเบียน LINE Notify', icon: 'pi pi-fw pi-id-card', to: '/register_linenotify', flag: 1 },
            { label: 'ประวัติการแจ้งเตือนทั้งหมด', icon: 'pi pi-fw pi-id-card', to: '/main/recoad_notification', flag: 0, priority_id: 8 },
            { label: 'การใช้งานระบบ', icon: 'pi pi-fw pi-id-card', to: '/main/complain/details', flag: 0, priority_id: 6 },
            { label: 'โรคที่มักพบบ่อย', icon: 'pi pi-fw pi-id-card', to: '/landing', flag: 1 },
            // { label: 'รายงาน', icon: 'pi pi-fw pi-id-card',to: '', command: () => store.show_daiolg_reprot = true , flag: 1 },

            // { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
            // { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
            // { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/uikit/floatlabel' },
            // { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', to: '/uikit/invalidstate' },
            // { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
            // { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
            // { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
            // { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
            // { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
            // { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
            // { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
            // { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu', preventExact: true },
            // { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
            // { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
            // { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
            // { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' },
        ]
    },

    {
        label: 'ระบบจัดการแผนปฏิบัติงาน',
        items: [
            { label: 'รายงานสรุป', icon: 'pi pi-fw pi-id-card', to: '/admin/dashboard_task', flag: 1, priority_id: 19 },
            { label: 'ปฏิทินงาน', icon: 'pi pi-fw pi-id-card', to: '/admin/fullcalendar', flag: 1, priority_id: 17 },
            { label: 'จัดการงาน', icon: 'pi pi-fw pi-id-card', to: '/admin/manage_task', flag: 1, priority_id: 9 },

            // { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
            // { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
            // { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/uikit/floatlabel' },
            // { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', to: '/uikit/invalidstate' },
            // { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
            // { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
            // { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
            // { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
            // { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
            // { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
            // { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
            // { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu', preventExact: true },
            // { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
            // { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
            // { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
            // { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' },
        ],
        visible: true,
    },

]);

const get_priority = async () => {
    // if (!store.priority) {
    const res = await service.post('read/get_on_role', {});
    if (res.message == 'success') {
        store.role = res.data[0].role_id
        sessionStorage.setItem('priority', JSON.stringify(res.data))
        for (let i = 0; i < model.value.length; i++) {
            const model_ = model.value[i];
            model.value[model_] = model_.items.map((e) => {
                console.log(e.flag = res.data.filter(x => x.priority_id == e.priority_id)[0]?.can_read ?? 1);
            })
        }
        model.value[1].visible = res.data[0].role_id != 3 ? true : false;
    }
    // // }
    // for (let i = 0; i < model.value.length; i++) {
    //     const model_ = model.value[i];
    //     model.value[model_] = model_.items.map((e) => {
    //         console.log(e.flag = store.priority.filter(x => x.priority_id == e.priority_id)[0]?.can_read ?? 1);
    //     })
    // }


}
onMounted(() => {
    get_priority();
})

// {
    //     label: 'Home',
    //     items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/mainstram' }]
    // },
    // {
    //     label: 'UI Components',
    //     items: [
    //         { label: 'หน้าหลัก', icon: 'pi pi-fw pi-id-card', to: '/mainstram', flag: 1 },
    //         { label: 'จัดการข้อมูล', icon: 'pi pi-fw pi-id-card', to: '/main/patient/datapatients', flag: 1 },
    //         { label: 'ตั้งค่า', icon: 'pi pi-fw pi-id-card', to: '/main/config/priority', flag: 1 },
    //         { label: 'วิธีการลงทะเบียน LINE Notify', icon: 'pi pi-fw pi-id-card', to: '/register_linenotify', flag: 1 },
    //         { label: 'ประวัติการแจ้งเตือนทั้งหมด', icon: 'pi pi-fw pi-id-card', to: '/main/recoad_notification', flag: 1 },
    //         { label: 'แจ้งปัญหาการใช้งาน', icon: 'pi pi-fw pi-id-card', to: '/main/complain/details', flag: 1 },
    //         { label: 'โรคที่มักพบบ่อย', icon: 'pi pi-fw pi-id-card', to: '/landing', flag: 1 },
    //         { label: 'รายงาน', icon: 'pi pi-fw pi-id-card', to: '/register_linenotify', flag: 1 },
    //         { label: 'ปฏิทินงาน', icon: 'pi pi-fw pi-id-card', to: '/admin/fullcalendar', flag: 1 },
    //         // { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
    //         // { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
    //         // { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/uikit/floatlabel' },
    //         // { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', to: '/uikit/invalidstate' },
    //         // { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
    //         // { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
    //         // { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
    //         // { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
    //         // { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
    //         // { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
    //         // { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
    //         // { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu', preventExact: true },
    //         // { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
    //         // { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
    //         // { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
    //         // { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' },
    //     ]
    // },
    // {
    //     label: 'Prime Blocks',
    //     items: [
    //         { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', to: '/blocks', badge: 'NEW' },
    //         { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: 'https://www.primefaces.org/primeblocks-vue', target: '_blank' }
    //     ]
    // },
    // {
    //     label: 'Utilities',
    //     items: [
    //         { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', to: '/utilities/icons' },
    //         { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: 'https://www.primefaces.org/primeflex/', target: '_blank' }
    //     ]
    // },
    // {
    //     label: 'Pages',
    //     icon: 'pi pi-fw pi-briefcase',
    //     to: '/pages',
    //     items: [
    //         {
    //             label: 'Landing',
    //             icon: 'pi pi-fw pi-globe',
    //             to: '/landing'
    //         },
    //         {
    //             label: 'Auth',
    //             icon: 'pi pi-fw pi-user',
    //             items: [
    //                 {
    //                     label: 'Login',
    //                     icon: 'pi pi-fw pi-sign-in',
    //                     to: '/auth/login'
    //                 },
    //                 {
    //                     label: 'Error',
    //                     icon: 'pi pi-fw pi-times-circle',
    //                     to: '/auth/error'
    //                 },
    //                 {
    //                     label: 'Access Denied',
    //                     icon: 'pi pi-fw pi-lock',
    //                     to: '/auth/access'
    //                 }
    //             ]
    //         },
    //         {
    //             label: 'Crud',
    //             icon: 'pi pi-fw pi-pencil',
    //             to: '/pages/crud'
    //         },
    //         {
    //             label: 'Timeline',
    //             icon: 'pi pi-fw pi-calendar',
    //             to: '/pages/timeline'
    //         },
    //         {
    //             label: 'Not Found',
    //             icon: 'pi pi-fw pi-exclamation-circle',
    //             to: '/pages/notfound'
    //         },
    //         {
    //             label: 'Empty',
    //             icon: 'pi pi-fw pi-circle-off',
    //             to: '/pages/empty'
    //         }
    //     ]
    // },
    // {
    //     label: 'Hierarchy',
    //     items: [
    //         {
    //             label: 'Submenu 1',
    //             icon: 'pi pi-fw pi-bookmark',
    //             items: [
    //                 {
    //                     label: 'Submenu 1.1',
    //                     icon: 'pi pi-fw pi-bookmark',
    //                     items: [
    //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
    //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
    //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
    //                     ]
    //                 },
    //                 {
    //                     label: 'Submenu 1.2',
    //                     icon: 'pi pi-fw pi-bookmark',
    //                     items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
    //                 }
    //             ]
    //         },
    //         {
    //             label: 'Submenu 2',
    //             icon: 'pi pi-fw pi-bookmark',
    //             items: [
    //                 {
    //                     label: 'Submenu 2.1',
    //                     icon: 'pi pi-fw pi-bookmark',
    //                     items: [
    //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
    //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
    //                     ]
    //                 },
    //                 {
    //                     label: 'Submenu 2.2',
    //                     icon: 'pi pi-fw pi-bookmark',
    //                     items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
    //                 }
    //             ]
    //         }
    //     ]
    // },
    // {
    //     label: 'Get Started',
    //     items: [
    //         {
    //             label: 'Documentation',
    //             icon: 'pi pi-fw pi-question',
    //             to: '/documentation'
    //         },
    //         {
    //             label: 'View Source',
    //             icon: 'pi pi-fw pi-search',
    //             url: 'https://github.com/primefaces/sakai-vue',
    //             target: '_blank'
    //         },
    //         // { label: 'logout', icon: 'pi pi-fw pi-circle', preventExact: ()=>logout }


    //     ]
    // }
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i" style=" font-family: Kanit;"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>


