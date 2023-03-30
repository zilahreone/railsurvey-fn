import { createRouter, createWebHistory, isNavigationFailure, NavigationFailureType } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import SurveyForm from '../views/SurveyForm.vue'
import SurveyFormDetail from '../views/SurveyFormDetail.vue'
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
      component: SurveyFormDetail,
      props: { isNew: true }
    },
    {
      path: '/form/:id',
      name: 'formDetail',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ '../views/SurveyForm.vue')
      component: SurveyFormDetail,
      props: { isNew: false }
    },
    {
      path: '/survey-list',
      name: 'survey-list',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/SurveyList.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/PageNotFound.vue')
    },
    {
      path: '/page-not-found',
      name: 'pageOntFound',
      component: () => import('@/views/PageNotFound.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  // If the user is not logged in, redirect to /login
  const isLoggedIn = !!Cookies.get('isAuthenticated')
  if (!isLoggedIn && to.name !== 'login') {
    return next({ path: '/login' });
  } else {
    return next();
    // return next({ path: '/' })
  }
});


export default router
