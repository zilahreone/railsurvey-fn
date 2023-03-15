<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const isLoad = ref(false)
const deferredPrompt = ref(null)
onMounted(() => {
  isLoad.value = true
  window.addEventListener('beforeinstallprompt', e => {
    console.log(e.prompt())
    e.preventDefault()
    // Stash the event so it can be triggered later.
    deferredPrompt.value = e
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt.value = null
  });
})
const dismiss = async () => {
  deferredPrompt.value = null
}
const install = async () => {
  deferredPrompt.value.prompt()
}
</script>
<template>
  <Transition>
    <div v-if="isLoad" class="flex flex-grow">
      <button @click="install">install</button>
      <div class="flex items-center text-center lg:text-left px-8 md:px-12 lg:w-1/2">
        <div>
          <h2 class="text-3xl font-semibold text-gray-800 md:text-4xl">บันทึกความเสียหายของ <span
              class="text-indigo-600">รางรถไฟ</span></h2>
          <p class="mt-2 text-sm text-gray-500 md:text-base">
            เว็บไซต์นี้จัดทำขึ้นเพื่อ ใช้ในการตรวจสอบความสมบูรณ์ หรือความผิดปกติของรางรถไฟ
            เพื่อวิเคราห์ความรุนแรงของความเสียหาย และพิจารณาในการซ่อมแซมต่อไป
          </p>
          <div class="flex justify-center lg:justify-start mt-6">
            <router-link to="/form"
              class="px-4 py-3 bg-gray-900 text-gray-200 text-xs font-semibold rounded hover:bg-gray-800">เริ่ม
              สำรวจความเสียหาย</router-link>
            <router-link to="/survey-list"
              class="ml-4 px-4 py-3 bg-gray-500 text-gray-200 text-xs font-semibold rounded hover:bg-gray-800">Survey
              List</router-link>
            <a class="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400"
              href="#">Learn More</a>
          </div>
        </div>
      </div>
      <div class="hidden lg:block lg:w-1/2" style="clip-path:polygon(15% 0, 100% 0%, 100% 100%, 0 100%)">
        <img class="h-full object-cover" src="@/assets/photo-1580940583249-77175ce5f75a.webp">
      </div>
    </div>
  </Transition>
</template>
<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}</style>