<script setup>
import { ref, onMounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useStore } from 'vuex'
import Cookies from 'js-cookie';
// const myGlobalVariable = inject('myGlobalVariable')
// import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
onMounted(() => {
  // console.log(myGlobalVariable);
})

const navigation = [
  { name: 'หน้าหลัก', href: '/' },
  { name: 'หน้าสำรวจ', href: '/form' },
  { name: 'รายการสำรวจ', href: '/survey-list' },
  { name: 'เพิ่มเติม', href: '/other' },
]
const store = useStore()
const route = useRoute()
const router = useRouter()
const isActiveProfile = ref(false)
const handleLogout = () => {
  Cookies.remove('isAuthenticated')
  router.go(0)
}
const showHambergerMenu = ref(false)

</script>
<template>
  <nav class="relative bg-white px-2 py-2 dark:bg-gray-900">
    <div class="container flex flex-wrap items-center justify-between">
      <!-- <a href="https://flowbite.com/" class="flex items-center">
        <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
      </a> -->
      <router-link to="/" >
        <img src="@/assets/rmt-logo.png" class="h-6 mr-3 sm:h-9" alt="Railway Logo" />
      </router-link>
      <div v-if="Cookies.get('isAuthenticated')" class="static flex items-center md:order-2">
        <!-- Dropdown menu -->
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="mobile-menu-2">
          <ul
            class="flex flex-col p-4 mt-4 border border-gray-400 rounded-lg bg-gray-0 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li v-for="(nav, index) in navigation" :key="index">
              <router-link v-slot="{ href, route, navigate, isActive, isExactActive }" :to="{ path: nav.href }">
                <div :class="`${isActive ? 'text-blue-500 font-medium'  : 'text-gray-dark font-medium'} text-base hover:text-blue-500`">{{ nav.name }}</div>
              </router-link>
            </li>
            <!-- <li>
              <a href="#"
                class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
            </li> -->
          </ul>
        </div>
        <button @click="showHambergerMenu = true" data-collapse-toggle="mobile-menu-2" type="button"
          class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="mobile-menu-2" aria-expanded="false">
          <span class="sr-only">Open main menu</span>
          <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
    <div v-if="showHambergerMenu" class="navbar-menu relative z-50">
      <div class="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25" @click="showHambergerMenu = false"></div>
      <nav class="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm p-4 bg-white border-r overflow-y-auto">
        <div class="flex items-center justify-end mb-0">
          <button @click="showHambergerMenu = false" class="">
            <svg class="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div>
          <ul>
            <li v-for="(nav, index) in navigation" :key="index" class="mb-1" @click="showHambergerMenu = false">
              <router-link v-slot="{ href, route, navigate, isActive, isExactActive }" :to="{ path: nav.href }">
                <!-- <div :class="`${isActive ? 'text-blue-500 font-medium'  : 'text-gray-dark font-medium'} text-base hover:text-blue-500`">{{ nav.name }}</div> -->
                <a :class="`block p-4 text-sm font-semibold ${isActive ? 'text-blue-500 font-medium'  : 'text-gray-dark font-normal'} hover:bg-blue-50 hover:text-blue-600 rounded`" href="#">{{ nav.name }}</a>
              </router-link>
            </li>
          </ul>
        </div>
        <div class="mt-auto">
          <!-- <div class="pt-6">
            <a class="block px-4 py-3 mb-3 leading-loose text-xs text-center font-semibold leading-none bg-gray-50 hover:bg-gray-100 rounded-xl" href="#">Sign in</a>
            <a class="block px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-blue-600 hover:bg-blue-700  rounded-xl" href="#">Sign Up</a>
          </div> -->
          <p class="my-2 text-xs text-center text-gray-400">
            <span>Copyright © 2021</span>
          </p>
        </div>
      </nav>
    </div>
  </nav>
</template>