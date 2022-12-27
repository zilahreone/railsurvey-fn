<script setup>
import { computed } from 'vue';

const props = defineProps({
  labelTitle: {
    type: String,
    default: null,
    required: true
  },
  labelImage: {
    type: String,
    default: null,
    required: true
  },
  items: {
    type: Array,
    default: [],
    required: true
  }
})
</script>
<template>
  <div v-for="(item, index) in items" :key="index" class="grid grid-rows gap-2 place-items-center">
    <input id="rail" type="radio" value="" name="rail" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
    <label for="rail" class="text-sm font-medium text-gray-900 dark:text-gray-300">{{ item[labelTitle] }}</label>
    <img v-if="labelImage" :src="require(`@/assets/${item[labelImage]}`)" alt="positionDamage" class="h-32">
  </div>
</template>