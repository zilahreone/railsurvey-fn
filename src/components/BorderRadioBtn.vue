<script setup>
import Border from './Border.vue';

const props = defineProps({
  title: {
    type: String,
    default: null,
    required: true
  },
  items: {
    type: Array,
    default: []
  }
})
</script>
<template>
  <Border>
    <p class="text-lg font-semibold mb-4">{{ title }}</p>
    <div class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
      <div v-for="(item, index) in props.items">
        <input :id="`${item}-${index}`" type="radio" value="" :name="title" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
        <label :for="`${item}-${index}`" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{ item }}</label>
      </div>
    </div>
  </Border>
</template>