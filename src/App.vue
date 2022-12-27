<script setup>
import Header from '@/core/Header.vue'
import Footer from '@/core/Footer.vue'
</script>
<template>
  <div class="flex flex-col min-h-screen">
    <div class="grow-0">
      <Header></Header>
    </div>
    <router-view></router-view>
    <div class="grow-0">
      <Footer></Footer>
    </div>
  </div>
</template>