import { DEFAULT_LAYOUT } from '../base';
const PROFILE = {
    path: '/profile',
    name: 'profile',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.profile',
        requiresAuth: true,
        icon: 'icon-file',
        order: 4,
    },
    children: [
        {
            path: 'basic',
            name: 'Basic',
            component: () => import('@/views/profile/basic/index.vue'),
            meta: {
                locale: 'menu.profile.basic',
                requiresAuth: true,
                roles: ['admin'],
            },
        },
    ],
};
export default PROFILE;
//# sourceMappingURL=profile.js.map