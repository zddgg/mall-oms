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
          path: 'spu',
          name: 'Spu',
          component: () => import('@/views/product/goods/spu/index.vue'),
          meta: {
            locale: 'menu.product.goods.spu',
            requiresAuth: true,
            roles: ['*'],
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
      path: 'brand/detail/:brandId',
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
          component: () => import('@/views/product/category/backend/components/backendCategoryDetail.vue'),
          meta: {
            requiresAuth: true,
            roles: ['*'],
            hideInMenu: true,
          },
        },
        {
          path: 'backend/:categoryId',
          name: 'BackendCategoryDetail',
          component: () => import('@/views/product/category/backend/components/backendCategoryDetail.vue'),
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
      path: 'property',
      name: 'Property',
      component: PAGE_LAYOUT,
      meta: {
        locale: 'menu.product.property',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: 'unit',
          name: 'PropertyUnit',
          component: () => import('@/views/product/property/unit/index.vue'),
          meta: {
            locale: 'menu.product.property.unit',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'unit/create',
          name: 'PropertyUnitCreate',
          component: () =>
            import(
              '@/views/product/property/unit/components/propertyUnitDetail.vue'
            ),
          meta: {
            requiresAuth: true,
            roles: ['*'],
            hideInMenu: true,
          },
        },
        {
          path: 'unit/:unitKeyId',
          name: 'PropertyUnitDetail',
          component: () =>
            import(
              '@/views/product/property/unit/components/propertyUnitDetail.vue'
            ),
          meta: {
            requiresAuth: true,
            roles: ['*'],
            hideInMenu: true,
          },
        },
        {
          path: 'group',
          name: 'PropertyGroup',
          component: () => import('@/views/product/property/group/index.vue'),
          meta: {
            locale: 'menu.product.property.group',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'group/create',
          name: 'PropertyGroupCreate',
          component: () =>
              import(
                  '@/views/product/property/group/components/propertyGroupDetail.vue'
                  ),
          meta: {
            requiresAuth: true,
            roles: ['*'],
            hideInMenu: true,
          },
        },
        {
          path: 'group/:propertyGroupId',
          name: 'PropertyGroupDetail',
          component: () =>
              import(
                  '@/views/product/property/group/components/propertyGroupDetail.vue'
                  ),
          meta: {
            requiresAuth: true,
            roles: ['*'],
            hideInMenu: true,
          },
        },
        {
          path: 'sale',
          name: 'PropertySale',
          component: () => import('@/views/product/property/sale/index.vue'),
          meta: {
            locale: 'menu.product.property.sale',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'sale/create',
          name: 'PropertySaleCreate',
          component: () =>
              import(
                  '@/views/product/property/sale/components/propertySaleDetail.vue'
                  ),
          meta: {
            requiresAuth: true,
            roles: ['*'],
            hideInMenu: true,
          },
        },
        {
          path: 'sale/:keyId',
          name: 'PropertySaleDetail',
          component: () =>
              import(
                  '@/views/product/property/sale/components/propertySaleDetail.vue'
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
