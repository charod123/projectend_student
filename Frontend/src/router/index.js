import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import AppLayoutMain from '@/layout/AppLayoutMain.vue';
import AppLayoutMainStram from '@/layout/AppLayoutMainStram.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/admin',
            component: AppLayoutMain,
            children: [
                {
                    path: '/admin/fullcalendar',
                    component: () => import('@/views/pages/Admin/Calendar/Manage_Task_FullCarander.vue')
                },
                {
                    path: '/admin/manage_task',
                    component: () => import('@/views/pages/Admin/Manage-Task/Manage_Task_Table.vue')
                },
                {
                    path: '/admin/dashboard_task',
                    component: () => import('@/views/pages/Admin/Dashboard_Task/Dashboard_Task.vue')
                },
            ]
        },
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/Input.vue')
                },
                {
                    path: '/uikit/floatlabel',
                    name: 'floatlabel',
                    component: () => import('@/views/uikit/FloatLabel.vue')
                },
                {
                    path: '/uikit/invalidstate',
                    name: 'invalidstate',
                    component: () => import('@/views/uikit/InvalidState.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/Button.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/Table.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/List.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/Tree.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/Panels.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/Overlay.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/Media.vue')
                },
                {
                    path: '/uikit/menu',
                    component: () => import('@/views/uikit/Menu.vue'),
                    children: [
                        {
                            path: '/uikit/menu',
                            component: () => import('@/views/uikit/menu/PersonalDemo.vue')
                        },
                        {
                            path: '/uikit/menu/seat',
                            component: () => import('@/views/uikit/menu/SeatDemo.vue')
                        },
                        {
                            path: '/uikit/menu/payment',
                            component: () => import('@/views/uikit/menu/PaymentDemo.vue')
                        },
                        {
                            path: '/uikit/menu/confirmation',
                            component: () => import('@/views/uikit/menu/ConfirmationDemo.vue')
                        }
                    ]
                },
                {
                    path: '/create/patient',
                    component: () => import('@/views/uikit/patient/FromPatient.vue'),
                    children: [
                        {
                            path: '/create/patient',
                            component: () => import('@/views/uikit/patient/menu/FromCreatePatient.vue')
                        },
                        {
                            path: '/create/patient/usertry',
                            component: () => import('@/views/uikit/patient/menu/FromCreateUsertry.vue')
                        },
                        {
                            path: '/create/patient/device',
                            component: () => import('@/views/uikit/patient/menu/FromCreateDevice.vue')
                        }
                    ]
                },
                {
                    path: '/edit/patient',
                    component: () => import('@/views/uikit/patient/FromPatient.vue'),
                    children: [
                        {
                            path: '/edit/patient',
                            component: () => import('@/views/uikit/patient/menu/FromCreatePatient.vue')
                        },
                        {
                            path: '/edit/patient/usertry',
                            component: () => import('@/views/uikit/patient/menu/FromCreateUsertry.vue')
                        },
                        {
                            path: '/edit/patient/device',
                            component: () => import('@/views/uikit/patient/menu/FromCreateDevice.vue')
                        }
                    ]
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/Messages.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/File.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/Chart.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/Misc.vue')
                },
                {
                    path: '/blocks',
                    name: 'blocks',
                    component: () => import('@/views/utilities/Blocks.vue')
                },
                {
                    path: '/utilities/icons',
                    name: 'icons',
                    component: () => import('@/views/utilities/Icons.vue')
                },
                {
                    path: '/pages/timeline',
                    name: 'timeline',
                    component: () => import('@/views/pages/Timeline.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/utilities/Documentation.vue')
                }

            ]
        },
        {
            path: '/main',
            name: 'main',
            component: AppLayoutMain,
            children: [
                {
                    path: '/main/patient',
                    component: () => import('@/views/pages/main/MainPatient.vue'),
                    children: [
                        {
                            path: '/main/patient/datapatients',
                            component: () => import('@/views/pages/main/menu/DataTablePatient.vue')
                        },
                        {
                            path: '/main/patient/analysis',
                            component: () => import('@/views/pages/main/menu/AnalysisOfDisease.vue')
                        },
                        {
                            path: '/main/patient/content_diseases',
                            component: () => import('@/views/pages/main/menu/Manage_Content_Diseases.vue')
                        },
                        {
                            path: '/main/patient/manage_user_admin',
                            component: () => import('@/views/pages/main/menu/Manage_user_Admin.vue')
                        },
                        {
                            path: '/main/patient/manage_user_basic',
                            component: () => import('@/views/pages/main/menu/Manage_user_basic.vue')
                        },

                    ]
                },
                {
                    path: '/main/patient/content_diseases/create',
                    name: 'create_content',
                    component: () => import('@/views/pages/main/menu/Create_Content_Diseases.vue')
                },
                {
                    path: '/main/config',
                    component: () => import('@/views/pages/configPage/MainConfig.vue'),
                    children: [
                        {
                            path: '/main/config/priority',
                            component: () => import('@/views/pages/configPage/menu/ConfigPriority.vue')
                        },
                        {
                            path: '/main/config/subdivision',
                            component: () => import('@/views/pages/configPage/menu/ConfigSubDivision.vue')
                        },
                        {
                            path: '/main/config/division',
                            component: () => import('@/views/pages/configPage/menu/ConfigDivision.vue')
                        },

                    ]
                },

                {
                    path: '/main/recoad_notification',
                    name: 'recoad_notification',
                    component: () => import('@/views/pages/notification/RecordNotification.vue'),
                },
                {
                    path: '/main/complain',
                    component: () => import('@/views/pages/complain/Complain_User.vue'),
                    children: [
                        {
                            path: '/main/complain/details',
                            component: () => import('@/views/pages/complain/menu/Detail_Complain.vue')
                        },
                        {
                            path: '/main/complain/onmap',
                            component: () => import('@/views/pages/complain/menu/Map_on_Complain.vue')

                        }

                    ]
                }

            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/:NotFound(.*)*',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/',
            component: AppLayoutMainStram,
            children: [
                {
                    path: '/mainstram',
                    name: 'mainstram',
                    component: () => import('@/views/pages/main/DashboradPatient.vue')
                },
                {
                    path: '/register_linenotify',
                    name: 'LINE',
                    component: () => import('@/views/pages/LINE/Empty_LINE.vue')
                },

            ]
        },
        {
            path: '/report_pdf',
            name: 'report_pdf',
            component: () => import('@/views/pages/Report-page/Report_Pdf.vue')
        },
        {
            path: '/report_export',
            name: 'report_export',
            component: () => import('@/views/pages/Report-page/Report_Export.vue')
        }

    ]
});
router.beforeEach((to, from, next) => {
    const auth = JSON.parse(localStorage.getItem('details'))?.token;
    if (auth) {
        if (to.path === '/') {
            return next({ path: '/mainstram' });
        } else {
            return next();
        }
    } else {
        if (to.path === '/') {
            return next();
        } else {
            return next({ name: 'login' });
        }
    }
});

export default router;
