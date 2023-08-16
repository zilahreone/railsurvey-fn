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
  { name: 'เพิ่มเติม', href: '/other' }
]
const store = useStore()
const route = useRoute()
const router = useRouter()
const isActiveProfile = ref(false)
const handleLogout = () => {
  caches.keys().then((keyList) => {
    keyList.map((key) => {
      return caches.delete(key)
    })
  })
  Cookies.remove('isAuthenticated')
  location.reload(true)
  // router.go(0)
}
const showHambergerMenu = ref(false)

</script>
<template>
  <nav class="relative bg-white mb-4">
    <div class="flex justify-between px-10">
      <div class="py-2">
        <router-link to="/" >
          <img src="@/assets/rmt-logo.png" class="h-6 sm:h-9" alt="Railway Logo" />
        </router-link>
      </div>
      <div class="hidden w-full md:flex md:w-auto justify-end -mr-10 bg-gradient-to-l from-gray-200">
        <router-link v-for="(nav, index) in navigation" :key="index" v-slot="{ href, route, navigate, isActive, isExactActive }" :to="{ path: nav.href }">
          <div :class="['h-full flex items-center justify-center hover:bg-[#952124] hover:text-white font-semibold w-36 -mb-0.5 -ml-5', isActive ? 'text-white bg-[#952124]' : 'text-gray-800']"
            :style="{'clip-path': `polygon(${index === 0 ? '15%' : '15%'} 0, 100% 0%, ${navigation.length === index + 1 ? '85%' : '85%'} 100%, 0% 100%)`}">
            {{ nav.name }}
          </div>
        </router-link>
        <div @click="handleLogout()" class="h-full flex items-center justify-center hover:bg-[#952124] hover:text-white font-semibold w-36 -mb-0.5 -ml-5 text-gray-800 cursor-pointer"
          style="clip-path: polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%);">
          ออกจากระบบ
        </div>
        <!-- <div
          class="['h-full flex items-center justify-center hover:bg-[#952124] hover:text-white font-semibold w-36 -mb-0.5 -ml-5']"
          style="{'clip-path': `polygon(15% 0, 100% 0%, 85% 100%, 0% 100%)`}"
        >sdfsdff</div> -->
      </div>
      <div class="inline-flex items-center md:hidden">
        <button @click="showHambergerMenu = true" type="button"
          class="p-2 ml-1 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
            <div @click="handleLogout()" :class="`block p-4 text-sm text-gray-dark hover:bg-blue-50 hover:text-blue-600 rounded cursor-pointer`">ออกจากระบบ</div>
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