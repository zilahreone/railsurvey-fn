<script setup>
const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <Transition>
    <div v-if="modelValue"
      class="fixed top-0 left-0 z-50 flex flex-col justify-between w-full p-4 border-b border-gray-200 md:flex-row bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
      <div class="mb-4 md:mb-0 md:mr-4">
        <slot name="header">
          <h2 class="mb-1 text-base font-semibold text-gray-900 dark:text-white">Install Rail-Survey App</h2>
        </slot>
        <slot name="content">
          <p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
            Get our free app. It won't take up space on your phone and also works offline
          </p>
          </slot>
      </div>
      <div class="flex items-center flex-shrink-0">
        <slot name="button"></slot>
        <button type="button" @click="emit('update:modelValue', false)"
          class="absolute top-2.5 right-2.5 md:relative md:top-auto md:right-auto flex-shrink-0 inline-flex justify-center items-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white">
          <svg aria-hidden="true" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"></path>
          </svg>
          <span class="sr-only">Close banner</span>
        </button>
    </div>
  </div>
  </Transition>
</template>