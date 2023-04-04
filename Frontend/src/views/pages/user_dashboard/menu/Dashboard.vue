<script setup>
import { onMounted, reactive, ref, watch, onBeforeMount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import Service from '../../../../service/api';
import moment from 'moment';
import { useStore } from '../../../../store';

const { isDarkTheme, contextPath } = useLayout();
const { layoutConfig } = useLayout();
let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');
const service = new Service();
const products = ref(null);
const lineData = reactive({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
});
const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-minus' }
]);
const date = ref({
    date_start: moment().format('YYYY-MM-DD'),
    date_end: moment().add(2, 'day').format('YYYY-MM-DD'),
})

const lineOptions = ref(null);
const subdivision = ref(null);
const store = useStore();
const pieData = ref(null);
const polarData = ref(null);
const barData = ref(null);
const radarData = ref(null);
const count_task = ref();
const pieOptions = ref(null);
const polarOptions = ref(null);
const barOptions = ref(null);
const radarOptions = ref(null);
const task_type = ref();
const pie_label_task_type = ref();
const pie_value_task_type = ref();
const label_dis = ref('');
const dis_count = ref();
const barData_ = ref();
onMounted(() => {
});
onBeforeMount(() => {
    setChart();

})
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

const setColorOptions = () => {
    documentStyle = getComputedStyle(document.documentElement);
    textColor = documentStyle.getPropertyValue('--text-color');
    textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    surfaceBorder = documentStyle.getPropertyValue('--surface-border');
};


const setChart = async () => {
    await get();
    barData.value = {
        labels: ['00.01 - 04.00', '04.01 - 08.00', '08.01 - 12.00', '12.01 - 16.00', '16.01 - 20.00', '20.00 - 00.00'],
        datasets: [
            {
                label: 'ค่าเฉลี่ย',
                backgroundColor: [documentStyle.getPropertyValue('--primary-500')],
                borderColor: documentStyle.getPropertyValue('--primary-500'),
                data: [count_task.value?.time_00_04, count_task.value?.time_04_08, count_task.value?.time_08_12, count_task.value?.time_12_16, count_task.value?.time_16_20, count_task.value?.time_20_00]
            }

        ]
    };
    barData_.value = {
        labels: label_dis.value,
        datasets: [
            {
                label: 'ค่าเฉลี่ยโรค',
                backgroundColor: [documentStyle.getPropertyValue('--red-500'),documentStyle.getPropertyValue('--indigo-500'),documentStyle.getPropertyValue('--purple-500'),documentStyle.getPropertyValue('--teal-500'),documentStyle.getPropertyValue('--teal-500'),documentStyle.getPropertyValue('--indigo-500')],
                borderColor: documentStyle.getPropertyValue('--primary-500'),
                data: dis_count.value.sums
            }

        ]
    };
    barOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };

    pieData.value = {
        labels: ['das', 'dsad'],
        datasets: [
            {
                data: [10, 5],
                backgroundColor: [documentStyle.getPropertyValue('--red-500'), documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--red-500'), documentStyle.getPropertyValue('--indigo-400'), documentStyle.getPropertyValue('--purple-400'), documentStyle.getPropertyValue('--teal-400')]
            }
        ]
    };

    pieOptions.value = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };

    lineData.value = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                borderColor: documentStyle.getPropertyValue('--primary-500'),
                tension: 0.4
            },
            {
                label: 'Second Dataset',
                data: [28, 48, 40, 19, 86, 27, 90],
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                borderColor: documentStyle.getPropertyValue('--primary-200'),
                tension: 0.4
            }
        ]
    };

    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };

    polarData.value = {
        datasets: [
            {
                data: [11, 16, 7, 3],
                backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500'), documentStyle.getPropertyValue('--orange-500')],
                label: 'My dataset'
            }
        ],
        labels: ['Indigo', 'Purple', 'Teal', 'Orange']
    };

    polarOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            r: {
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };

    radarData.value = {
        labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
        datasets: [
            {
                label: 'My First dataset',
                borderColor: documentStyle.getPropertyValue('--indigo-400'),
                pointBackgroundColor: documentStyle.getPropertyValue('--indigo-400'),
                pointBorderColor: documentStyle.getPropertyValue('--indigo-400'),
                pointHoverBackgroundColor: textColor,
                pointHoverBorderColor: documentStyle.getPropertyValue('--indigo-400'),
                data: [65, 59, 90, 81, 56, 55, 40]
            },
            {
                label: 'My Second dataset',
                borderColor: documentStyle.getPropertyValue('--purple-400'),
                pointBackgroundColor: documentStyle.getPropertyValue('--purple-400'),
                pointBorderColor: documentStyle.getPropertyValue('--purple-400'),
                pointHoverBackgroundColor: textColor,
                pointHoverBorderColor: documentStyle.getPropertyValue('--purple-400'),
                data: [28, 48, 40, 19, 96, 27, 100]
            }
        ]
    };

    radarOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            r: {
                grid: {
                    color: textColorSecondary
                }
            }
        }
    };
};

watch(isDarkTheme, (val) => {
    if (val) {
        applyDarkTheme();
    } else {
        applyLightTheme();
    }
},
    { immediate: true }
);
watch(
    layoutConfig.theme,
    () => {
        console.log('1');
        setColorOptions();
        setChart();
    },
    { immediate: true }
);

const get = async () => {
    date.value.date_start = moment(date.value.date_start).format("YYYY-MM-DD")
    date.value.date_end = moment(date.value.date_end).format("YYYY-MM-DD")
    const res = await service.post('/read/get_dashboard_count_time', { start_date: date.value.date_start, end_date: date.value.date_end });
    if (res.message == 'success') {
        count_task.value = res.data[0];
        console.log(count_task.value);
        dis_count.value = res.count
        label_dis.value = res.count.data.map(x => x.cd_name)
        console.log(dis_count.value);
        // pie_value_task_type.value = res.data.task_type.map(e => e.count_task_type);
    }

}
</script>

<template>
    <div class="grid p-5">
        <div class="col-12 card">
            <div class="grid">
                <div class="col-12 md:col-2 sm:col-2">
                    <p>เลือกวันเริ่มต้น</p>
                    <Calendar v-model="date.date_start" showIcon dateFormat="yy-mm-dd" />

                </div>
                <div class="col-12 md:col-2 sm:col-2">
                    <p>เลือกวันสิ้นสุด</p>
                    <Calendar v-model="date.date_end" showIcon dateFormat="yy-mm-dd" />

                </div>
                <div class="col-0 md:col-6"></div>
                <div class="col-2 align-self-end">
                    <Button label="ค้นหา" severity="success" class="w-10rem" @click="setChart()" />
                </div>
            </div>

        </div>

        <div :class="`col-12 lg:col-6 xl:col-4`">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">จำนวนการแจ้งเตือนทั้งหมด</span>
                        <div class="text-900 font-medium text-xl">{{ count_task?.count_noti }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-megaphone text-orange-500 text-xl"></i>
                    </div>
                </div>
                <!-- <span class="text-green-500 font-medium">24 new </span>
                                                                    <span class="text-500">since last visit</span> -->
            </div>
        </div>
        <div :class="`col-12 lg:col-6 xl:col-4`">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">จำนวนผู้ป่วย </span>
                        <div class="text-900 font-medium text-xl">{{ count_task?.count_pat }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-user text-blue-500 text-xl"></i>
                    </div>
                </div>
                <!-- <span class="text-green-500 font-medium">24 new </span>
                                                                    <span class="text-500">since last visit</span> -->
            </div>
        </div>

        <div :class="`col-12 lg:col-6 xl:col-4`">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">จำนวนอุปกรณ์ </span>
                        <div class="text-900 font-medium text-xl">
                            {{ count_task?.count_device }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-inbox text-blue-500 text-xl"></i>
                    </div>
                </div>
                <!-- <span class="text-green-500 font-medium">24 new </span>
                                                                    <span class="text-500">since last visit</span> -->
            </div>
        </div>


        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>รายงานสรุปการแจ้งเตือนฉุกเฉินแบ่งตามช่วงเวลา</h5>
                <Chart type="bar" :data="barData" :options="barOptions"></Chart>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>รายงานสรุปโรคที่เป็นมากที่สดตามลำดับ</h5>
                <Chart type="bar" :data="barData_" :options="barOptions"></Chart>
            </div>
        </div>
        <!-- <div class="col-12 xl:col-3">
            <div class="card">
                <h5>เฉลี่ยนตามประเภทงาน</h5>
                <Chart type="pie" :data="pieData" :options="pieOptions" />
            </div>
        </div>

        <div class="col-12 xl:col-3">
            <div class="card">
                <h5>ปิดงานสำเร็จ</h5>
                <Chart type="pie" :data="pieData" :options="pieOptions" />
            </div>
        </div> -->


    </div>
</template>
<style scoped>
.sm-visible {
    display: none;
}

@media screen and (max-width: 40em) {
    ::v-deep(.sm-invisible) {
        display: none;
    }

    ::v-deep(.sm-visible) {
        display: inline;
        margin-right: .5rem;
    }
}
</style>