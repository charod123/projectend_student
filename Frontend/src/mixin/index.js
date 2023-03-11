import service from '../service/api';
import loadding from '@/views/Loadding.vue';
import config from '../service/config';
const mixin = {
    data() {
        return {
            priority_role: null,

            service: new service(),
            menu_1: [{
                menu_th: 'หน้าหลัก',
                menu_en: 'Home',
                url: '/mainsteam',
                logo: 'bx bx-grid-alt',
                noti: 0,
                priority_id: 1,
            },],
            street_menu: [],
            menu_2: [],
            sub_menu: [],
            cms_menu: [],
            sub_menu_smart_pole: [],
            notitype_data: [],
            noti_data: [],
            config: config,
            thaiCalendar: {
                firstDayOfWeek: 0,
                dayNames: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'อาทิตย์'],
                dayNamesShort: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
                dayNamesMin: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
                monthNames: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
                monthNamesShort: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
                weekHeader: 'Wk'
            },
            theme_color: '#ffffff',
            role: null
        };
    },
    mounted() {
        // for (let i = 0; i < 200; i++) {
        //     const element = 200[i];
        //     const res =  this.service.post('read/get_on_role', {});
        // }
        this.priority_role = localStorage.getItem('priority') != null ? JSON.parse(localStorage.getItem('priority')).role : [];
        if (this.priority_role.length > 0) {
            (this.menu_1 = [
                {
                    menu_th: 'หน้าหลัก',
                    menu_en: 'Home',
                    url: '/mainsteam',
                    logo: 'bx bx-grid-alt',
                    noti: 0,
                    priority_id: 1,
                    flag: +this.priority_role.filter((f) => f.priority_id == 1)[0].can_read
                },
                {
                    menu_th: 'ซีเอ็มเอส',
                    menu_en: 'CMS',
                    url: '/cms',
                    logo: 'bx bx-cctv',
                    noti: 0,
                    priority_id: 2,
                    flag: +this.priority_role.filter((f) => f.priority_id == 2)[0].can_read
                },
                {
                    menu_th: 'ไฟส่องสว่าง',
                    menu_en: 'Street Light',
                    url: '/street-light',
                    logo: 'bx bx-bulb',
                    noti: 0,
                    priority_id: 3,
                    flag: +this.priority_role.filter((f) => f.priority_id == 3)[0].can_read
                },
                {
                    menu_th: 'รายงาน',
                    menu_en: 'Report',
                    url: '/report',
                    logo: 'bx bx-notepad',
                    noti: 0,
                    priority_id: 4,
                    flag: +this.priority_role.filter((f) => f.priority_id == 4)[0].can_read
                }
            ]),
                (this.menu_2 = [
                    {
                        menu_th: 'ตั้งค่าผู้ใช้งาน',
                        menu_en: 'User Managements',
                        url: '/settings/user',
                        logo: 'bx bx-cog',
                        noti: 0,
                        priority_id: 14,
                        flag: +this.priority_role.filter((f) => f.priority_id == 14)[0].can_read
                    },
                    {
                        menu_th: 'ตั้งค่าเสาอัจฉริยะ',
                        menu_en: 'Smartpole Managements',
                        url: '/settings/smartpole',
                        logo: 'bx bx-cog',
                        noti: 0,
                        priority_id: 22,
                        flag: +this.priority_role.filter((f) => f.priority_id == 22)[0].can_read,
                        chk_edit: +this.priority_role.filter((f) => f.priority_id == 22)[0].can_write,
                        chk_delete: +this.priority_role.filter((f) => f.priority_id == 22)[0].can_delete
                    }
                ]),
                (this.sub_menu = [
                    {
                        menu_th: 'ตั้งค่าหน่วยงาน',
                        menu_en: 'Setting Division',
                        url: '/settings/user',
                        noti: 0,
                        priority_id: 16,
                        flag: +this.priority_role.filter((f) => f.priority_id == 16)[0].can_read,
                        chk_edit: +this.priority_role.filter((f) => f.priority_id == 16)[0].can_write,
                        chk_delete: +this.priority_role.filter((f) => f.priority_id == 16)[0].can_delete
                    },
                    {
                        menu_th: 'ตั้งค่าแผนก/ฝ่าย',
                        menu_en: 'Setting SubDivision',
                        url: '/settings/user/subdivision',
                        noti: 0,
                        priority_id: 17,
                        flag: +this.priority_role.filter((f) => f.priority_id == 17)[0].can_read,
                        chk_edit: +this.priority_role.filter((f) => f.priority_id == 17)[0].can_write,
                        chk_delete: +this.priority_role.filter((f) => f.priority_id == 17)[0].can_delete
                    },
                    {
                        menu_th: 'ตั้งค่ารูปแบบสิทธิ์',
                        menu_en: 'Setting Priority',
                        url: '/settings/user/typecontrol',
                        noti: 0,
                        priority_id: 15,
                        flag: +this.priority_role.filter((f) => f.priority_id == 15)[0].can_read,
                        chk_edit: +this.priority_role.filter((f) => f.priority_id == 15)[0].can_write,
                        chk_delete: +this.priority_role.filter((f) => f.priority_id == 15)[0].can_delete
                    },
                    {
                        menu_th: 'ตั้งค่าผู้ใช้งาน',
                        menu_en: 'Setting User',
                        url: '/settings/user/settinguser',
                        noti: 0,
                        priority_id: 14,
                        flag: +this.priority_role.filter((f) => f.priority_id == 14)[0].can_read,
                        chk_edit: +this.priority_role.filter((f) => f.priority_id == 14)[0].can_write,
                        chk_delete: +this.priority_role.filter((f) => f.priority_id == 14)[0].can_delete
                    }
                ]),
                (this.sub_menu_smart_pole = [
                    {
                        menu_th: 'ตั้งค่าจุดติดตั้ง',
                        menu_en: 'setting installation',
                        url: '/settings/smartpole',
                        logo: 'bx bxs-pie-chart-alt-2',
                        noti: 0,
                        priority_id: 20,
                        flag: +this.priority_role.filter((f) => f.priority_id == 20)[0].can_read,
                        chk_edit: +this.priority_role.filter((f) => f.priority_id == 20)[0].can_write,
                        chk_delete: +this.priority_role.filter((f) => f.priority_id == 20)[0].can_delete
                    },
                    {
                        menu_th: 'ตั้งค่าเซิฟเวอร์',
                        menu_en: 'Setting server',
                        url: '/settings/smartpole/server',
                        logo: 'bx bxs-pie-chart-alt-2',
                        noti: 0,
                        priority_id: 18,
                        flag: +this.priority_role.filter((f) => f.priority_id == 18)[0].can_read,
                        chk_edit: +this.priority_role.filter((f) => f.priority_id == 18)[0].can_write,
                        chk_delete: +this.priority_role.filter((f) => f.priority_id == 18)[0].can_delete
                    },
                    {
                        menu_th: 'ตั้งค่าตัวควบคุม',
                        menu_en: 'setting Control',
                        url: '/settings/smartpole/control',
                        logo: 'bx bxs-pie-chart-alt-2',
                        noti: 0,
                        priority_id: 19,
                        flag: +this.priority_role.filter((f) => f.priority_id == 19)[0].can_read,
                        chk_edit: +this.priority_role.filter((f) => f.priority_id == 19)[0].can_write,
                        chk_delete: +this.priority_role.filter((f) => f.priority_id == 19)[0].can_delete
                    },

                    {
                        menu_th: 'ตั้งค่าเสา',
                        menu_en: 'setting pole',
                        url: '/settings/smartpole/pole',
                        logo: 'bx bxs-pie-chart-alt-2',
                        noti: 0,
                        priority_id: 22,
                        flag: +this.priority_role.filter((f) => f.priority_id == 22)[0].can_read,
                        chk_edit: +this.priority_role.filter((f) => f.priority_id == 22)[0].can_write,
                        chk_delete: +this.priority_role.filter((f) => f.priority_id == 22)[0].can_delete
                    },
                    {
                        menu_th: 'ตั้งค่ากล้อง CCTV',
                        menu_en: 'setting CCTV',
                        url: '/settings/smartpole/cctv',
                        logo: 'bx bxs-pie-chart-alt-2',
                        noti: 0,
                        priority_id: 21,
                        flag: +this.priority_role.filter((f) => f.priority_id == 21)[0].can_read,
                        chk_edit: +this.priority_role.filter((f) => f.priority_id == 21)[0].can_write,
                        chk_delete: +this.priority_role.filter((f) => f.priority_id == 21)[0].can_delete
                    }
                ]),
                (this.cms_menu = [
                    {
                        menu_th: 'กล้องปัจจุบัน',
                        menu_en: 'Liveview',
                        url: '/cms',
                        logo: 'bx bxs-pie-chart-alt-2',
                        noti: 0,
                        priority_id: 8,
                        flag: +this.priority_role.filter((f) => f.priority_id == 8)[0].can_read
                    },
                    {
                        menu_th: 'กล้องย้อนหลัง',
                        menu_en: 'Playback',
                        url: '/cms/playback',
                        logo: 'bx bxs-pie-chart-alt-2',
                        noti: 0,
                        priority_id: 9,
                        flag: +this.priority_role.filter((f) => f.priority_id == 9)[0].can_read
                    }
                ]),
                (this.street_menu = [
                    {
                        menu_th: 'หน้าหลักไฟอัจฉริยะ',
                        menu_en: 'MainStreetLight',
                        url: '/street-light',
                        logo: 'bx bxs-pie-chart-alt-2',
                        noti: 0,
                        priority_id: 10,
                        flag: +this.priority_role.filter((f) => f.priority_id == 10)[0].can_read,
                        chk_edit: +this.priority_role.filter((f) => f.priority_id == 10)[0].can_write,
                        chk_delete: +this.priority_role.filter((f) => f.priority_id == 10)[0].can_delete
                    },
                    {
                        menu_th: 'สร้างไฟอัจฉริยะ',
                        menu_en: 'CreateLight',
                        url: '/street-light/street-create',
                        logo: 'bx bxs-pie-chart-alt-2',
                        noti: 0,
                        priority_id: 11,
                        flag: +this.priority_role.filter((f) => f.priority_id == 11)[0].can_read,
                        chk_edit: +this.priority_role.filter((f) => f.priority_id == 11)[0].can_write,
                        chk_delete: +this.priority_role.filter((f) => f.priority_id == 11)[0].can_delete
                    },
                    {
                        menu_th: 'ตั้งค่า เปิด-ปิด ไฟอัจฉริยะ',
                        menu_en: 'CreateGroupLight',
                        url: '/street-light/street-time',
                        logo: 'bx bxs-pie-chart-alt-2',
                        noti: 0,
                        priority_id: 12,
                        flag: +this.priority_role.filter((f) => f.priority_id == 12)[0].can_read,
                        chk_edit: +this.priority_role.filter((f) => f.priority_id == 12)[0].can_write,
                        chk_delete: +this.priority_role.filter((f) => f.priority_id == 12)[0].can_delete
                    }
                ]);
            // console.log(this.menu_1)

            this.theme_color = this.$store.state.theme == 'light' ? '#393939' : '#ffffff';
        }
    },
    methods: {
        base64ArrayBuffer(arrayBuffer) {
            var base64 = '';
            var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

            var bytes = new Uint8Array(arrayBuffer);
            var byteLength = bytes.byteLength;
            var byteRemainder = byteLength % 3;
            var mainLength = byteLength - byteRemainder;

            var a, b, c, d;
            var chunk;

            // Main loop deals with bytes in chunks of 3
            for (var i = 0; i < mainLength; i = i + 3) {
                // Combine the three bytes into a single integer
                chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

                // Use bitmasks to extract 6-bit segments from the triplet
                a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
                b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
                c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
                d = chunk & 63; // 63       = 2^6 - 1

                // Convert the raw binary segments to the appropriate ASCII encoding
                base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
            }

            // Deal with the remaining bytes and padding
            if (byteRemainder == 1) {
                chunk = bytes[mainLength];

                a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

                // Set the 4 least significant bits to zero
                b = (chunk & 3) << 4; // 3   = 2^2 - 1

                base64 += encodings[a] + encodings[b] + '==';
            } else if (byteRemainder == 2) {
                chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

                a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
                b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

                // Set the 2 least significant bits to zero
                c = (chunk & 15) << 2; // 15    = 2^4 - 1

                base64 += encodings[a] + encodings[b] + encodings[c] + '=';
            }

            return base64;
        },

    },
    computed: {},
    components: {
        loadding
    },
    watch: {
        theme_color(e) {
            console.log(e);
        }
    }
};

export default mixin;
