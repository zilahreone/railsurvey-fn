<script setup>
import { onMounted, computed, ref } from 'vue';

const props = defineProps({
  count: {
    type: Number,
    default: 0
  },
  perPage: {
    type: Number,
    default: 20
  },
  page: {
    type: Number,
    default: 1
  }
})
const emit = defineEmits(['page'])
const emitInput = (value) => {
  emit('page', parseInt(value))
  // if (value <= Math.ceil(props.count /  props.perPage)) {
  // }
}
const compDisableBtn = computed(() => {

})

onMounted (() => {
})
</script>
<template>
  <nav class="flex items-center justify-between pt-4" aria-label="Table navigation">
    <span class="text-sm font-normal text-gray-500 dark:text-gray-400">แสดง <span
        class="font-semibold text-gray-900 dark:text-white">{{ count < perPage ? `1-${count}` : `1-${perPage}` }}</span> จาก <span
        class="font-semibold text-gray-900 dark:text-white">{{ count }}</span></span>
        <!-- -space-x-px -->
    <ul class="inline-flex items-center">
      <li>
        <button @click="emit('page', page - 1)" :disabled="perPage === page * perPage"
          :class="`block px-3 py-2 ml-0 leading-tight text-gray-500 ${perPage === page * perPage ? 'bg-gray-100' : 'bg-white hover:bg-gray-100 hover:text-gray-700'} border-l border-y border-gray-300 rounded-l-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`">
          <span class="sr-only">Previous</span>
          <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"></path>
          </svg>
        </button>
      </li>
      <li>
        <input @blur="emitInput(parseInt($event.target.value))" :disabled="perPage === page * perPage" type="number" :value="page" :min="1" :max="Math.ceil(count / page)" class="pl-6 py-2 bg-white border text-center text-sm border-gray-300 w-20" placeholder="page" @keyup.enter="emit('page', parseInt($event.target.value))">
        <!-- <a href="#"
          class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a> -->
      </li>
      <!-- <li>
        <a href="#"
          class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
      </li>
      <li>
        <a href="#" aria-current="page"
          class="z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
      </li>
      <li>
        <a href="#"
          class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</a>
      </li>
      <li>
        <a href="#"
          class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">100</a>
      </li> -->
      <li>
        <button @click="emit('page', page + 1)" :disabled="page * perPage >= count"
          :class="`block px-3 py-2 leading-tight text-gray-500 ${page * perPage >= count ? 'bg-gray-100' : 'bg-white hover:bg-gray-100 hover:text-gray-700'} border-r border-y border-gray-300 rounded-r-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`">
          <span class="sr-only">Next</span>
          <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"></path>
          </svg>
        </button>
        <!-- <a href="#"
          class="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
          <span class="sr-only">Next</span>
          <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"></path>
          </svg>
        </a> -->
      </li>
    </ul>
  </nav>
</template>