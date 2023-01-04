<script setup>
const props = defineProps({
  error: {
    type: Boolean,
    default: false
  }
})
</script>
<template>
  <div class="border border-solid border-gray-200 p-4" :class="{ 'border-red-600': error }">
    <slot></slot>
  </div>
</template>