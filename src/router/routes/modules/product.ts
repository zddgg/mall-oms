import { DEFAULT_LAYOUT, PAGE_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
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
      component: PAGE_LAYOUT,
      meta: {
        locale: 'menu.product.goods',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: 'spu',
          name: 'Spu',
          component: () => import('@/views/product/goods/spu/index.vue'),
          meta: {
            locale: 'menu.product.goods.spu',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'spu/create',
          name: 'SpuCreate',
          component: () => import('@/views/product/goods/create/index.vue'),
          meta: {
            requiresAuth: true,
            roles: ['*'],
            hideInMenu: true
          },
        },
        {
          path: 'spu/:spuId',
          name: 'SpuDetail',
          component: () => import('@/views/product/goods/spu/detail/spuDetail.vue'),
          meta: {
            requiresAuth: true,
            roles: ['*'],
            hideInMenu: true
          },
        },
        {
          path: 'sku',
          name: 'Sku',
          component: () => import('@/views/product/goods/sku/index.vue'),
          meta: {
            locale: 'menu.product.goods.sku',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'sku/create',
          name: 'SkuCreate',
          component: () => import('@/views/product/goods/sku/detail/skuCreate.vue'),
          meta: {
            requiresAuth: true,
            roles: ['*'],
            hideInMenu: true
          },
        },
        {
          path: 'sku/:skuId',
          name: 'SkuDetail',
          component: () => import('@/views/product/goods/sku/detail/skuDetail.vue'),
          meta: {
            requiresAuth: true,
            roles: ['*'],
            hideInMenu: true
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
      path: 'brand/create',
      name: 'BrandCreate',
      component: () =>
        import('@/views/product/brand/components/brandCreate.vue'),
      meta: {
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
    {
      path: 'brand/:brandId',
      name: 'BrandDetail',
      component: () =>
        import('@/views/product/brand/components/brandDetail.vue'),
      meta: {
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
    {
      path: 'category',
      name: 'Category',
      component: PAGE_LAYOUT,
      meta: {
        locale: 'menu.product.category',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: 'backend',
          name: 'BackendCategory',
          component: () => import('@/views/product/category/backend/index.vue'),
          meta: {
            locale: 'menu.product.category.backend',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'backend/create',
          name: 'BackendCategoryCreate',
          component: () => import('@/views/product/category/backend/components/create.vue'),
          meta: {
            requiresAuth: true,
            roles: ['*'],
            hideInMenu: true,
          },
        },
        {
          path: 'backend/:categoryId',
          name: 'BackendCategoryDetail',
          component: () => import('@/views/product/category/backend/components/detail.vue'),
          meta: {
            requiresAuth: true,
            roles: ['*'],
            hideInMenu: true,
          },
        },
        {
          path: 'frontend',
          name: 'FrontendCategory',
          component: () =>
            import('@/views/product/category/frontend/index.vue'),
          meta: {
            locale: 'menu.product.category.frontend',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },
    {
      path: 'attr',
      component: PAGE_LAYOUT,
      meta: {
        locale: 'menu.product.property',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: 'unit',
          name: 'AttrUnit',
          component: () => import('@/views/product/attr/unit/index.vue'),
          meta: {
            locale: 'menu.product.property.unit',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'unit/create',
          name: 'AttrUnitCreate',
          component: () =>
            import(
              '@/views/product/attr/unit/components/detail.vue'
            ),
          meta: {
            requiresAuth: true,
            roles: ['*'],
            hideInMenu: true,
          },
        },
        {
          path: 'unit/:attrId',
          name: 'AttrUnitDetail',
          component: () =>
            import(
              '@/views/product/attr/unit/components/detail.vue'
            ),
          meta: {
            requiresAuth: true,
            roles: ['*'],
            hideInMenu: true,
          },
        },
        {
          path: 'group',
          name: 'AttrGroup',
          component: () => import('@/views/product/attr/group/index.vue'),
          meta: {
            locale: 'menu.product.property.group',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'group/create',
          name: 'AttrGroupCreate',
          component: () =>
              import(
                  '@/views/product/attr/group/components/detail.vue'
                  ),
          meta: {
            requiresAuth: true,
            roles: ['*'],
            hideInMenu: true,
          },
        },
        {
          path: 'group/:groupId',
          name: 'AttrGroupDetail',
          component: () =>
              import(
                  '@/views/product/attr/group/components/detail.vue'
                  ),
          meta: {
            requiresAuth: true,
            roles: ['*'],
            hideInMenu: true,
          },
        },
        {
          path: 'sale',
          name: 'AttrSale',
          component: () => import('@/views/product/attr/sale/index.vue'),
          meta: {
            locale: 'menu.product.property.sale',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'sale/create',
          name: 'AttrSaleCreate',
          component: () =>
              import(
                  '@/views/product/attr/sale/components/create.vue'
                  ),
          meta: {
            requiresAuth: true,
            roles: ['*'],
            hideInMenu: true,
          },
        },
        {
          path: 'sale/:attrId',
          name: 'AttrSaleDetail',
          component: () =>
              import(
                  '@/views/product/attr/sale/components/detail.vue'
                  ),
          meta: {
            requiresAuth: true,
            roles: ['*'],
            hideInMenu: true,
          },
        },
      ],
    },
  ],
};

export default LIST;
