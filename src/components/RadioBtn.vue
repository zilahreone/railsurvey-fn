<script setup>
const props = defineProps({
  name: {
    type: String,
    default: 'default-radio'
  },
  items: {
    type: Array,
    default: []
  },
  class: {
    type: String,
    default: null
  }
})
</script>
<template>
  <div v-for="(item ,index) in items" :key="index" :class="class">
    <div class="flex items-center max-w-fit">
      <input :id="`${item}-${index}`" type="radio" value="" :name="name" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
      <label :for="`${item}-${index}`" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{ item }}</label>
    </div>
  </div>
</template>