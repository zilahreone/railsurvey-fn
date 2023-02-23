<script setup>
import Header from '@/core/Header.vue'
import Footer from '@/core/Footer.vue'
</script>
<template>
  <div class="flex flex-col h-screen justify-between">
    <Header></Header>
    <router-view></router-view>
    <!-- <div class="h-full">
    </div> -->
    <Footer></Footer>
  </div>
  <!-- <div class="flex flex-col min-h-screen">
    <div class="grow-0">
    </div>
    sdfsf
    <div class="grow-0">
    </div>
  </div> -->
</template>