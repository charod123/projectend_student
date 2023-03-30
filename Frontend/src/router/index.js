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
                    meta: { priority: 17 },
                    component: () => import('@/views/pages/Admin/Calendar/Manage_Task_FullCarander.vue')
                },
                {
                    path: '/admin/manage_task',
                    meta: { priority: 13 },
                    component: () => import('@/views/pages/Admin/Manage-Task/Manage_Task_Table.vue')
                },

                {
                    path: '/admin/dashboard_task',
                    meta: { priority: 19 },
                    component: () => import('@/views/pages/Admin/Dashboard_Task/Dashboard_Task.vue')
                },
                {
                    path: '/admin/user',
                    component: () => import('@/views/pages/user_dashboard/MainRoute-Dashboard.vue'),
                    children: [
                        {
                            path: '/admin/user/dashboard',
                            // meta: { priority: 10 },
                            component: () => import('@/views/pages/user_dashboard/menu/Dashboard.vue')
                        },
                        {
                            path: '/admin/user/dashboard_Analysis',
                            // meta: { priority: 10 },
                            component: () => import('@/views/pages/user_dashboard/menu/Dashboard-Analysis.vue')
                        },

                    ]
                },
            ]
        },
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/create/patient',
                    component: () => import('@/views/uikit/patient/FromPatient.vue'),
                    children: [
                        {
                            path: '/create/patient',
                            meta: { priority: 20 },
                            component: () => import('@/views/uikit/patient/menu/FromCreatePatient.vue')
                        },
                        {
                            path: '/create/patient/usertry',
                            meta: { priority: 20 },
                            component: () => import('@/views/uikit/patient/menu/FromCreateUsertry.vue')
                        },
                        {
                            path: '/create/patient/device',
                            meta: { priority: 20 },
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
                            meta: { priority: 15 },
                            component: () => import('@/views/pages/main/menu/Manage_Content_Diseases.vue')
                        },
                        {
                            path: '/main/patient/manage_user_admin',
                            meta: { priority: 12 },
                            component: () => import('@/views/pages/main/menu/Manage_user_Admin.vue')
                        },
                        {
                            path: '/main/patient/manage_user_basic',
                            meta: { priority: 3 },
                            component: () => import('@/views/pages/main/menu/Manage_user_basic.vue')
                        },
                        {
                            path: '/main/patient/manage_disaease',
                            meta: { priority: 21 },
                            component: () => import('@/views/pages/Admin/Manage-Disease/Manage_Disease.vue')
                        },
                    ]
                },
                {
                    path: '/main/patient/content_diseases/create',
                    name: 'create_content',
                    meta: { priority: 15 },
                    component: () => import('@/views/pages/main/menu/Create_Content_Diseases.vue')
                },
                {
                    path: '/main/config',
                    component: () => import('@/views/pages/configPage/MainConfig.vue'),
                    children: [
                        {
                            path: '/main/config/priority',
                            meta: { priority: 14 },
                            component: () => import('@/views/pages/configPage/menu/ConfigPriority.vue')
                        },
                        {
                            path: '/main/config/subdivision',
                            meta: { priority: 5 },
                            component: () => import('@/views/pages/configPage/menu/ConfigSubDivision.vue')
                        },
                        {
                            path: '/main/config/division',
                            meta: { priority: 4 },
                            component: () => import('@/views/pages/configPage/menu/ConfigDivision.vue')
                        },

                    ]
                },

                {
                    path: '/main/recoad_notification',
                    name: 'recoad_notification',
                    meta: { priority: 8 },
                    component: () => import('@/views/pages/notification/RecordNotification.vue'),
                },
                {
                    path: '/main/complain',
                    component: () => import('@/views/pages/complain/Complain_User.vue'),
                    children: [
                        {
                            path: '/main/complain/details',
                            meta: { priority: 6 },
                            component: () => import('@/views/pages/complain/menu/Detail_Complain.vue')
                        },
                        {
                            path: '/main/complain/onmap',
                            meta: { priority: 6 },
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
    const pri = JSON.parse(sessionStorage.getItem('priority'));
    const priority = pri?.filter(x => x.priority_id == to.meta.priority)[0]?.can_read
    console.log(to.meta);
    if (priority == 1) {
        return next()
    }
    if (priority == 0) {
        alert('คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้')
        return router.back()
    }
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
