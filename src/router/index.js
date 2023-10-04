import { createRouter, createWebHistory, isNavigationFailure, NavigationFailureType } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import SurveyFormView from '../views/SurveyFormView.vue'
import SurveyFormDetail from '../views/SurveyFormDetail.vue'
import AdditionalView from '../views/AdditionalView.vue'
import Cookies from 'js-cookie';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/form',
      name: 'form',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ '../views/SurveyForm.vue')
      component: SurveyFormView,
      // component: SurveyFormDetail,
      // props: { isNew: true }
    },
    {
      path: '/form/:id',
      name: 'formDetail',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ '../views/SurveyForm.vue')
      component: SurveyFormDetail,
      // props: { isNew: false }
    },
    {
      path: '/survey-list',
      name: 'survey-list',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/_SurveyList.vue')
    },
    {
      path: '/additional',
      name: 'additional',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ '../views/SurveyForm.vue')
      component: AdditionalView,
      // component: SurveyFormDetail,
      // props: { isNew: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/PageNotFound.vue')
    },
    // {
    //   path: '/page-not-found',
    //   name: 'pageNotFound',
    //   component: () => import('@/views/PageNotFound.vue')
    // }
  ]
})

router.beforeEach((to, from, next) => {
  // If the user is not logged in, redirect to /login
  const isLoggedIn = !!Cookies.get('isAuthenticated')
  if (!isLoggedIn && to.name !== 'login') {
    return next({ path: '/login' });
  } else {
    Cookies.set('isAuthenticated', Cookies.get('isAuthenticated'), { expires: 1 })
    return next();
    // return next({ path: '/' })
  }
});


export default router
