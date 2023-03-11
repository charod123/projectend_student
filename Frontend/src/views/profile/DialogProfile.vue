<script setup>
import { ref } from 'vue';
const displayPosition = ref(false);
const position = ref('center');


const openPosition = (pos) => {
    position.value = pos;
    displayPosition.value = true;
};
const closePosition = () => {
    displayPosition.value = false;
};
</script>
<template>
    <div>
        <!-- <div class="grid flex-column">
            <div class="col">
                <Button label="Left" icon="pi pi-arrow-right" @click="openPosition('left')" class="p-button-warning" />
                <Button label="Right" icon="pi pi-arrow-left" @click="openPosition('right')" class="p-button-warning" />
            </div>
            <div class="col">
                <Button label="Top" icon="pi pi-arrow-down" @click="openPosition('top')" class="p-button-warning" />
                <Button label="TopLeft" icon="pi pi-arrow-down-right" @click="openPosition('topleft')"
                    class="p-button-warning" />
                <Button label="TopRight" icon="pi pi-arrow-down-left" @click="openPosition('topright')"
                    class="p-button-warning" />
            </div>
            <div class="col">
                <Button label="Bottom" icon="pi pi-arrow-up" @click="openPosition('bottom')" class="p-button-warning" />
                <Button label="BottomLeft" icon="pi pi-arrow-up-right" @click="openPosition('bottomleft')"
                    class="p-button-warning" />
                <Button label="BottomRight" icon="pi pi-arrow-up-left" @click="openPosition('bottomright')"
                    class="p-button-warning" />
            </div>
        </div> -->

        <Dialog header="Header" v-model:visible="displayPosition" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
            :style="{ width: '50vw' }" :position="position" :modal="true">
            <p class="m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
                esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                laborum.</p>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="closePosition" class="p-button-text" />
                <Button label="Yes" icon="pi pi-check" @click="closePosition" autofocus />
            </template>
        </Dialog>
    </div>
</template>