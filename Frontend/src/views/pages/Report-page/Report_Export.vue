<script setup >
import { ref, onMounted } from 'vue';
import XLSX from 'xlsx-js-style';
import { useStore } from '../../../store';
const store = useStore();
onMounted(() => {
    const wsxzz = XLSX.utils.json_to_sheet(store.data_report?.data);
    for (var i in wsxzz) {
        console.log(wsxzz[i]);
        if (typeof wsxzz[i] != 'object') continue;
        let cell = XLSX.utils.decode_cell(i);

        wsxzz[i].s = {

            // styling for all cells
            font: {
                name: 'Angsana New',
                sz: "16"
            },
            alignment: {
                vertical: 'center',
                horizontal: 'center',
                wrapText: '1', // any truthy value here
            },
            border: {
                right: {
                    style: 'thin',
                    color: '000000',
                },
                left: {
                    style: 'thin',
                    color: '000000',
                },
                top: {
                    style: 'thin',
                    color: '000000',
                },
                bottom: {
                    style: 'thin',
                    color: '000000',

                }

            },
        };

        if (cell.c == 6) {
            // first column
            wsxzz[i].s.numFmt = 'DD-MM-YYYY'; // for dates
            wsxzz[i].z = 'DD-MM-YYYY';
        } else {
            wsxzz[i].s.numFmt = '00'; // other numbers
        }

        if (cell.r == 0) {
            // first row
            wsxzz[i].s.border.bottom = {
                // bottom border
                style: 'thin',
                color: '000000',
            };
        }

        if (cell.r == 0) {
            // every other row
            wsxzz[i].s.fill = {
                // background color
                patternType: 'solid',
                fgColor: { rgb: 'b2b2b2' },
                bgColor: { rgb: 'b2b2b2' },
            };
        }
    }
    const wo = XLSX.utils.book_new();
    wsxzz['!cols'] = [{ width: 10 }, { width: 20 }, { width: 30 }, { width: 50 }, { width: 30 }, { width: 50 }];
    XLSX.utils.book_append_sheet(wo, wsxzz, 'Reports');
    XLSX.writeFile(wo, `${store.data_report.name_excel}.xlsx`);
    
})
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        loading..................
    </div>
</template>
<style scoped lang="scss">
@media print {}
</style>