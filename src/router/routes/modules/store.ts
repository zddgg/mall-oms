import { DEFAULT_LAYOUT, PAGE_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
    path: '/store',
    name: 'Store',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.store',
        requiresAuth: true,
        order: 14,
    },
    children: [
        {
            path: 'list',
            name: 'StoreList',
            component: () => import('@/views/store/list/index.vue'),
            meta: {
                locale: 'menu.store.list',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'create',
            name: 'StoreCreate',
            component: () => import('@/views/store/list/components/storeDetail.vue'),
            meta: {
                requiresAuth: true,
                roles: ['*'],
                hideInMenu: true,
            },
        },
        {
            path: ':storeNo',
            name: 'StoreDetail',
            component: () => import('@/views/store/list/components/storeDetail.vue'),
            meta: {
                requiresAuth: true,
                roles: ['*'],
                hideInMenu: true,
            },
        },
    ],
};

export default LIST;
