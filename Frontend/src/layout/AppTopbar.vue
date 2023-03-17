<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import config from '@/service/config';
import { useStore } from '../store';
const { layoutConfig, onMenuToggle, contextPath } = useLayout();
const store = useStore();
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const img_user = JSON.parse(localStorage.getItem("details"))?.img_path;
const displayConfirmation = ref(false);
onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const items = [
    {
        label: 'Add',
        icon: 'pi pi-pencil',
        command: () => {
            this.$toast.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
        }
    },
    {
        label: 'Update',
        icon: 'pi pi-refresh',
        command: () => {
            this.$toast.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
        }
    },
    {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
            this.$toast.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
        }
    },
    {
        label: 'Upload',
        icon: 'pi pi-upload',
        command: () => {
            this.$router.push('fileupload');
        }
    },
    {
        label: 'Vue Website',
        icon: 'pi pi-external-link',
        command: () => {
            window.location.href = 'https://vuejs.org/'
        }
    }
]
const logoUrl = computed(() => {
    return `${contextPath}layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
const openConfirmation = () => {

    displayConfirmation.value = true;
}
const Confirmation = () => {
    localStorage.clear();
    store.priority = {};

    router.push('/');
}
const closeConfirmation = () => {
    displayConfirmation.value = !displayConfirmation.value;
}

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const onSettingsClick = () => {
    topbarMenuActive.value = false;
    router.push('/documentation');
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/mainstram" class="layout-topbar-logo mr-4">
            <img :src="`${config.backend_url_img}/resources/assets/mian-icon/default/logo-main/78a0ef24252625.56331cb43dba4.jpg`"
                height="50" alt="logo" />
            <span>ระบบเฝ้าระวังผู้สูงอายุและผู้ป่วยติดเตียง</span>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <Toast />
            <!-- <div class="">
                        <SpeedDial showIcon="pi pi-user" :model="items" direction="down" />
                    </div> -->
            <Avatar :image="img_user" class="p-link layout-topbar-button mr-2" size="large" shape="circle" />

            <!-- <button @click="onSettingsClick()" class="p-link layout-topbar-button" badge="8">
                <i class="pi pi-bell"></i>
                <span>Settings</span>
            </button> -->
            <!-- <Badge value="8"></Badge> -->
            <button @click="openConfirmation" class="p-link layout-topbar-button p-button-danger">
                <i class="pi pi-sign-out"></i>
                <span>Logout</span>
            </button>
            <Dialog header="คุณต้องการออกจากระบบใช่หรือไม่" v-model:visible="displayConfirmation"
                :style="{ width: '350px' }" :modal="true">
                <template #footer>
                    <Button label="ไม่ใช่" icon="pi pi-times" @click="closeConfirmation" class="p-button-text" />
                    <Button label="ใช่" icon="pi pi-check" @click="Confirmation" class="p-button-text" autofocus />
                </template>
            </Dialog>

        </div>

    </div>
</template>

<style lang="scss" scoped></style>
