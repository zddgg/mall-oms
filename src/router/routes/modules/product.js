import { DEFAULT_LAYOUT } from '../base';
const LIST = {
    path: '/product',
    name: 'Product',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.product',
        requiresAuth: true,
        order: 12,
    },
    children: [
        {
            path: 'goods',
            name: 'Goods',
            component: () => import('@/views/product/goods/index.vue'),
            meta: {
                locale: 'menu.product.goods',
                requiresAuth: true,
                roles: ['*'],
            },
            children: [
                {
                    path: 'detail/:skuCode',
                    name: 'GoodsDetail',
                    component: () => import('@/views/product/goods/components/goodsDetail.vue'),
                    meta: {
                        locale: 'menu.product.goods.detail',
                        requiresAuth: true,
                        roles: ['*'],
                        hideInMenu: true,
                    },
                },
            ],
        },
        {
            path: 'brand',
            name: 'Brand',
            component: () => import('@/views/product/brand/index.vue'),
            meta: {
                locale: 'menu.product.brand',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'category',
            name: 'Category',
            component: () => import('@/views/product/category/index.vue'),
            meta: {
                locale: 'menu.product.category',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'property',
            name: 'Property',
            component: () => import('@/views/product/property/index.vue'),
            meta: {
                locale: 'menu.product.property',
                requiresAuth: true,
                roles: ['*'],
            },
        },
    ],
};
export default LIST;
//# sourceMappingURL=product.js.map