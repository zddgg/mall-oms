import { DEFAULT_LAYOUT, PAGE_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
    path: '/merchant',
    name: 'Merchant',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.merchant',
        requiresAuth: true,
        order: 13,
    },
    children: [
        {
            path: 'list',
            name: 'MerchantList',
            component: () => import('@/views/merchant/list/index.vue'),
            meta: {
                locale: 'menu.merchant.list',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'create',
            name: 'MerchantCreate',
            component: () => import('@/views/merchant/list/components/merchantDetail.vue'),
            meta: {
                requiresAuth: true,
                roles: ['*'],
                hideInMenu: true,
            },
        },
        {
            path: ':merNo',
            name: 'MerchantDetail',
            component: () => import('@/views/merchant/list/components/merchantDetail.vue'),
            meta: {
                requiresAuth: true,
                roles: ['*'],
                hideInMenu: true,
            },
        },
    ],
};

export default LIST;
