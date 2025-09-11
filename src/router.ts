import Index from './main.vue'
import WapDash from "@/views/wap/dash.vue";

const main_child = [
    {
        path: 'home',
        meta: {
            title: 'nav.home'
        },
        name: 'home_index',
        component: () => import('./views/home/home.vue'),

    },
    {
        path: 'query/results',
        meta: {
            title: 'nav.query_progress'
        },
        name: 'query_apply',
        component: () => import('./views/query/refer.vue'),
    },
    {
        path: 'query/tab',
        meta: {
            title: 'nav.query'
        },
        name: 'query_page',
        component: () => import('./views/query/multiSource.vue'),
    },
    {
        path: 'record/profile',
        meta: {
            title: 'nav.query_record_detail'
        },
        name: 'query_review',
        component: () => import('./components/profile/queryProfile.vue'),
    },
    {
        path: '/order/profile',
        meta: {
            title: 'nav.order_detail'
        },
        name: 'profile',
        component: () => import('./components/profile/profile.vue'),
    },
    {
        path: 'personal',
        name: 'my_order',
        meta: {
            title: 'nav.my_order'
        },
        icon: 'person',
        component: () => import('./views/order/basicList.vue')
    },
    {
        path: 'order',
        name: 'order',
        meta: {
            title: 'nav.order_submit'
        },
        icon: 'md-code',
        component: () => import('./views/order/order.vue')
    },
    {
        path: 'board',
        name: 'board',
        meta: {
            title: 'nav.board'
        },
        icon: 'md-clipboard',
        component: () => import('./views/board.vue')
    }
];

export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'nav.login'
    },
    component: () => import('./views/login/login.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    meta: {
        title: 'nav.locking'
    },
    component: () => import('./components/locking-page.vue')
};

export const appRouter = [
    {
        path: '/',
        icon: 'md-home',
        name: 'main',
        meta: {
            title: 'nav.home'
        },
        component: Index,
        redirect: '/home',
        children: [
            ...main_child
        ]
    },
    {
        path: '/query',
        icon: 'md-search',
        name: 'view',
        meta: {
            title: 'nav.query'
        },
        component: Index,
        access: 0,
        children: [
            {
                path: '/query/order',
                name: 'query',
                meta: {
                    title: 'nav.sql_query'
                },
                icon: 'ios-podium',
                component: () => import('./views/query/workFlow.vue')
            }
        ]
    },
    {
        path: '/audit',
        icon: 'md-open',
        name: 'audit',
        meta: {
            title: 'nav.audit'
        },
        component: Index,
        access: 1,
        children: [
            {
                path: '/audit/order',
                name: 'audit-audit',
                meta: {
                    title: 'nav.audit_order'
                },
                icon: 'md-create',
                component: () => import('./views/audit/order/audit.vue')
            },
            {
                path: '/audit/query',
                name: 'query-audit',
                meta: {
                    title: 'nav.query'
                },
                icon: 'logo-rss',
                component: () => import('./views/audit/query/audit.vue')
            }
        ]
    },
    {
        path: '/record',
        icon: 'md-pie',
        name: 'record',
        meta: {
            title: 'nav.records'
        },
        component: Index,
        access: 1,
        children: [
            {
                path: '/record/order',
                name: 'audit-record',
                meta: {
                    title: 'nav.order_records'
                },
                icon: 'md-send',
                component: () => import('./views/records/order.vue')
            },
            {
                path: '/record/query',
                name: 'query-review',
                meta: {
                    title: 'nav.query_records'
                },
                icon: 'md-pulse',
                component: () => import('./views/records/query.vue')
            }

        ]
    },
    {
        path: '/manage',
        icon: 'logo-buffer',
        name: 'management',
        meta: {
            title: 'nav.management'
        },
        access: 2,
        component: Index,
        children: [
            {
                path: '/manage/user',
                name: 'manage-user',
                meta: {
                    title: 'nav.users'
                },
                icon: 'md-people',
                component: () => import('./views/manage/user/user.vue')
            },
            {
                path: '/manage/db',
                name: 'manage-database',
                meta: {
                    title: 'nav.databases',
                },
                icon: 'md-medal',
                component: () => import('./views/manage/db/db.vue')
            },
            {
                path: '/manage/group',
                name: 'roleGroup',
                meta: {
                    title: 'nav.role_groups'
                },
                icon: 'logo-google',
                component: () => import('./views/manage/group/roleGroup.vue')
            },
            {
                path: '/manage/flow',
                name: 'flow',
                meta: {
                    title: 'nav.flow_templates'
                },
                icon: 'md-trophy',
                component: () => import('./views/manage/flow/flow.vue')
            },
            {
                path: '/manage/roles',
                name: 'roles',
                meta: {
                    title: 'nav.audit_rules'
                },
                icon: 'md-aperture',
                component: () => import('./views/manage/role/role.vue')
            },
            {
                path: '/manage/task',
                name: 'task',
                meta: {
                    title: 'nav.auto_tasks'
                },
                icon: 'md-sync',
                component: () => import('./views/manage/autoTask/autoTask.vue')
            },
            {
                path: '/manage/setting',
                name: 'setting',
                meta: {
                    title: 'nav.settings'
                },
                icon: 'md-settings',
                component: () => import('./views/manage/settings/setting.vue')
            },
        ]
    }
];

export const MainRoute = [
    loginRouter,
    locking,
    ...appRouter
];
