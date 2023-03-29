<script setup>
import { computed } from 'vue';


const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  remove: {
    type: Boolean,
    default: false
  },
  create: {
    type: Boolean,
    default: false
  },
  content: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'confirm'])
const handleButtonClick = () => {
  emit('update:modelValue', false)
}
const handleButtonClickConfirm = () => {
  emit('update:modelValue', false)
  emit('confirm')
}
const modal = computed(() => {
  if (props.remove) {
    return {
      css: 'bg-red-600 hover:bg-red-800 focus:ring-red-300',
      text: 'Are you sure you want to delete '
    }
  }
  if (props.create) {
    return {
      css: 'bg-green-400 hover:bg-green-500 focus:ring-green-300',
      text: 'Are you sure you want to create '
    }
  }
  return {
    css: 'bg-blue-600 hover:bg-blue-800 focus:ring-blue-300',
    text: ''
  }
})
</script>
<template>
  <Transition>
    <div v-if="modelValue" class="relative z-10">
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"></div>
      <div v-if="create || remove" class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-lg">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <button @click="handleButtonClick()" type="button"
                  class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                  <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"></path>
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
                <div class="p-6 text-center">
                  <svg aria-hidden="true" class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h3 v-if="remove || create" class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{{
                    modal.text }}<strong>
                      <slot></slot>
                    </strong> ?</h3>
                  <h3 v-else class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{{ modal.text }}</h3>
                  <button @click="handleButtonClick(), handleButtonClickConfirm()" type="button"
                    :class="['text-white font-medium focus:ring-4 focus:outline-none rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2', modal.css]">
                    Yes, I'm sure
                  </button>
                  <button @click="handleButtonClick()" type="button"
                    class="bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">No,
                    cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="content" id="extralarge-modal" tabindex="-1" class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex justify-center min-h-full sm:p-8">
          <div class="relative w-full h-full max-w-7xl">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <!-- Modal header -->
              <div class="flex items-center justify-between p-2 border-b rounded-t dark:border-gray-600">
                <!-- <h3 class="text-xl font-medium text-gray-900 dark:text-white">
                  Extra Large modal
                </h3> -->
                <button type="button" @click="handleButtonClick()"
                  class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="extralarge-modal">
                  <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"></path>
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              <!-- Modal body -->
              <div class="p-2">
                <slot name="content"></slot>
              </div>
            <!-- Modal footer -->
            <div class="flex justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <slot name="footer"></slot>
              <!-- <button @click="handleButtonClickConfirm()" data-modal-hide="extralarge-modal" type="button" class="_button">ส่งแบบฟอร์ม</button>
              <button @click="handleButtonClick()" data-modal-hide="extralarge-modal" type="button" class="_button-error">แก้ไขแบบฟอร์ม</button> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</Transition></template>
<style>.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

/* ::-webkit-scrollbar {
   display: none;
} */</style>