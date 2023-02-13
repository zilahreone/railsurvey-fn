<script setup>
const d = new Date().getFullYear()
const title =  process.env.VUE_APP_FOOTER_TITLE
</script>
<template>
  <!-- <div class="flex justify-center">
    <hr class="my-4 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-6" />
    <span class="mb-8 block text-sm text-gray-500 sm:text-center dark:text-gray-400">© {{ d }} <a href="https://flowbite.com/" class="hover:underline">
      Flowbite™</a>. All Rights Reserved.
    </span>
  </div> -->
  <footer>
    <div class="flex justify-center border-t mt-4">
      <span class="mt-4 mb-8 block text-sm text-gray-500 sm:text-center dark:text-gray-400">© {{ d }} {{ title }}. All Rights Reserved.
      </span>
    </div>
  </footer>
</template>