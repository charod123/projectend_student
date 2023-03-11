<script setup>
import { ref, watch, onMounted } from 'vue';
import Service from '../../../../service/api';
import { useRouter } from 'vue-router';
import { useStore } from '../../../../store';
import { useToast } from 'primevue/usetoast';
const store = useStore();
const router = useRouter();
const content = ref();
const service = new Service();
const loading = ref(true);
const toast = useToast();
const header = ref('เพิ่มโรคที่มักพบบ่อย');
const edit = ref(false);
const data = ref({
    content_id: null,
    main_menu_id: null,
    sub_menu_name: ''
});
const data_on_table = ref({});
const disabled_on_edit = ref(false);
setTimeout(() => {
    loading.value = false;
}, 600);
const tinymceSettings = {
    menubar: false,
    toolbar: false,
    selector: 'textarea',
    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss',
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Author name',
    mergetags_list: [
        { value: 'First.Name', title: 'First Name' },
        { value: 'Email', title: 'Email' },
    ]
}
const get = async () => {
    const res = await service.post('/read/get_main_menu', {});
    if (res.message == 'success') {
        data_on_table.value = res.data;
    }

    console.log(store.content_data);
    if (store.content_data) {
        // data.value.main_menu_id = store.content_data?.main_menu_id
        edit.value = true;
        header.value = 'แก้ไขเนื้อหาโรคที่มักพบบ่อย'
        data.value.sub_menu_name = store.content_data?.sub_menu_name
        content.value = store.content_data?.detail_on_show
        data.value.main_menu_id = store.content_data?.main_menu_id
        data.value.content_id = store.content_data?.content_id
    }

}
const save = async () => {
    const res = await service.post(`/write/${edit.value ? 'update_content' : 'create_content'}`, {
        detail_on_edit: content.value,
        detail_on_show: content.value,
        sub_menu_name: data.value.sub_menu_name,
        main_menu_id: data.value.main_menu_id,
        content_id: data.value.content_id ?? null,
    });
    if (res.message == 'success') {
        return router.push('/main/patient/content_diseases')
    }
    return toast.add({ severity: 'warn', summary: res.message, life: 2000 });

}
onMounted(() => {
    get();

})
store.$subscribe((mutation) => {
    console.log('Global state changed', store.content_data);
    console.log('Global state changed', mutation);
});
</script>

<template>
    <div class="grid p-fluid">
        <div :class="`col-12 lg:col-12 xl:col-12`">
            <div class="p-3 flex justify-content-between align-items-end">
                <p class="text-5xl">{{ header }}</p>
                <div>
                    <Button style="font-family: Kanit;" label="กลับ" class="p-button-lg p-button-secondary w-10rem mr-2"
                        @click="$router.back()" />
                    <Button style="font-family: Kanit;" label="บันทึก" icon="pi pi-check" class="p-button-lg w-10rem"
                        @click="save" />
                </div>

            </div>
            <div class="card">
                <div class="grid">
                    <div class="col-12 mb-2 lg:col-3 md:col-12 sm:col-12 lg:mb-0">
                        <div class="grid p-fluid">
                            <div class="col-12" v-if="!disabled_on_edit">
                                <label class="text-base" for="integeronly"><label
                                        class="text-red-500">*</label>เลือกเมณูหลัก</label>
                                <Dropdown id="state" v-model="data.main_menu_id" :options="data_on_table"
                                    optionLabel="main_menu_name" optionValue="main_menu_id" placeholder="*เลือกเมณูหลัก">
                                </Dropdown>
                            </div>
                            <div class="col-12">
                                <label class="text-base" for="integeronly"><label
                                        class="text-red-500">*</label>ชื่อเมณูย่อย</label>
                                <InputText v-model="data.sub_menu_name" placeholder="*ชื่อเมณูย่อย" />
                            </div>


                        </div>


                    </div>
                    <div class="col-12 mb-2 lg:col-9 md:col-12 sm:col-12 lg:mb-0">
                        <h3>จัดรูป Content ที่คุณต้องการ</h3>
                        <Editor v-if="!loading" v-model="content" :init="tinymceSettings" :readonly="true"
                            :style="{ height: '100vh' }" />

                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
