import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const Layout = () => import('@/views/Layout/index.vue')

export const routes: Array<RouteRecordRaw> = [
  // { 
  //   path: "/", 
  //   component: Layout,
  //   redirect: '/index',
  //   meta: { hidden: true },
  //   children: [
  //     {
  //       path: '/index',
  //       component: () => import('@/views/Home/index.vue'),
  //       meta: { title: '首页', icon: 'house' }
  //     },
  //   ]
  // },
  { 
    path: "/", 
    component: Layout,
    redirect: '/index',
    name: 'UserManagement',
    meta: { hidden: true },
    children: [
      {
        path: '/index',
        name: 'UserManagementIndex',
        component: () => import('@/views/user-management/index.vue'),
        meta: { title: '用户管理', icon: 'user' },
      }
    ]
  },
  { 
    path: "/order-management", 
    component: Layout,
    name: 'OrderManagement',
    meta: { hidden: true },
    children: [
      {
        path: '/order-management/index',
        name: 'OrderManagementIndex',
        component: () => import('@/views/order-management/index.vue'),
        meta: { title: '订单管理', icon: 'ShoppingBag' },
      },
    ]
  },
  { 
    path: "/configuration-management", 
    component: Layout,
    name: 'ConfigurationManagement',
    meta: { hidden: true },
    children: [
      {
        path: '/configuration-management/index',
        name: 'ConfigurationManagementIndex',
        component: () => import('@/views/configuration-management/index.vue'),
        meta: { title: '配置管理', icon: 'Setting' },
      },
    ]
  },
  { 
    path: "/personal-center", 
    component: Layout,
    name: 'PersonalCenter',
    meta: { hidden: true },
    children: [
      {
        path: '/personal-center/index',
        name: 'PersonalCenterIndex',
        component: () => import('@/views/personal-center/index.vue'),
        meta: { title: '个人中心', icon: 'User' },
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    meta: { title: '登录页', hidden: true }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFound',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/:path(.*)*',
    component: () => import('@/views/Error/404.vue'),
    name: '404Page',
    meta: {
      hidden: true,
      breadcrumb: false
    }
  }
  // { 
  //   path: "/about", 
  //   component: () => import("@/views/about.vue") 
  // },
  // { 
  //   path: "/testIndex", 
  //   component: () => import("@/views/index.vue") 
  // },
];


export const router = createRouter({
  history: createWebHistory(),
  routes,
});


