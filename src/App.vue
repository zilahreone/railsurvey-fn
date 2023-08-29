<script setup>
import Header from '@/core/Header.vue'
import Footer from '@/core/Footer.vue'
import { useRoute, useRouter } from 'vue-router';
import Login from './views/Login.vue';
// const localStg = loc
// localStorage.
// console.log(localStorage.getItem('tasd'))
const router = useRouter()
const route = useRoute()
</script>
<template>
  <!-- <router-view></router-view> -->
  <div v-if="route.name === 'login'">
    <Login></Login>
  </div>
  <div v-else class="">
    <div class="flex flex-col justify-between min-h-screen">
      <Header></Header>
      <router-view></router-view>
      <Footer></Footer>
    </div>
  </div>
  <!-- <div class="flex flex-col min-h-screen">
    <div class="grow-0">
    </div>
    sdfsf
    <div class="grow-0">
    </div>
  </div> -->
</template>