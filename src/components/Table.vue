<script setup>
import IndexedDB from '@/IndexedDB';
import { onMounted, ref } from 'vue';

const props = defineProps({
  tbody: {
    type: Array,
    default: []
  }
})

onMounted (() => {
})
</script>
<template>
  <div>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <slot name="thead"></slot>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tbody" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          <slot name="tbody" :item="item" :index="index"></slot>
        </tr>
      </tbody>
    </table>
  </div>
</template>