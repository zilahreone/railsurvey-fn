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
    <!-- <div class="flex flex-col min-h-screen">
      <div class="absolute inset-x-0 bottom-0">
      </div>
    </div> -->
    <div class="flex flex-col h-screen">
      <div class="">
        <Header></Header>
      </div>
      <div class="flex-grow">
        <router-view></router-view>
      </div>
      <div class="">
        <Footer></Footer>
      </div>
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