<script setup>
import { computed, ref, onMounted } from 'vue';

const props = defineProps({
  isPreview: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: 'default-radio'
  },
  items: {
    type: Array,
    default: []
  },
  imageKey: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: null
  },
  error: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'radio',
    validator (value) {
      // The value must match one of these strings
      return ['radio', 'checkbox'].includes(value)
    }
  },
  isSpecify: {
    type: Boolean,
    default: false
  },
  disables: {
    type: Array,
    default: []
  },
  modelValue: {
    type: [String, Boolean, Array],
    default: null
  }
})

// onMounted(() => {
//   if (props.isSpecify) specify.value = props.modelValue
// })

const specify = ref(null)

const emit = defineEmits(['update:modelValue', 'onEvent'])
const handleEmit = (val) => {
  let out = null
  // if (props.isSpecify) {
  //   out = !!val
  // }
  if (props.type === 'radio') {
    out = val
  } else if (props.type === 'checkbox') {
    if (Array.isArray(props.modelValue)) {
      out = [...props.modelValue]
      const index = out.indexOf(val)
      if (index < 0) {
        out.push(val)
      } else {
        out.splice(index, 1)
      }
      // out.filter(o => !props.disables.includes(o))
    }
  }
  emit('update:modelValue', out)
  emit('onEvent', out)
}
const isChecked = (val) => {
  if (props.type === 'checkbox') {
    return props.modelValue?.includes(val)
  }
  return props.modelValue === val
}
const isCheckedSpecify = (val) => {
  // return props.modelValue !== null && props.modelValue === val && props.items.filter(item => item.value === val).length === 0
  return props.modelValue !== null && props.modelValue === val && props.items.filter(item => item.value === val).length === 0
}
const compDisableBtn = computed(() => {
  if (props.isPreview) {
    return props.items.map(item => item.value)
  }
  return props.disables
  // if (props.type === 'radio') {
  //   return true
  // } else {
  // }
  // if (props.isPreview) {
  //   return props.items.map(item => item.value)
  // } else {
  //   return props.disables
  // }
})
</script>
<template>
  <div v-for="(item ,index) in items" :key="index" :class="[{'bg-gray-100': disables.includes(item.value)}, `flex items-center pl-2 border ${error ? 'border-red-600' : 'border-gray-200'} rounded dark:border-gray-700`]">
    <input :id="`${name}-${index}`" :value="item.value" :type="type" :disabled="disables.includes(item.value)" @input="handleEmit(item.value)" :checked="isChecked(item.value)" :name="`${name}${isPreview ? '-preview' : ''}`" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
    <label :for="`${name}-${index}`" :class="`flex flex-col gap-2 ${imageKey && item[imageKey] ? 'items-center' : ''}  w-full py-2 ml-2 text-sm font-medium ${error ? 'text-red-600' : 'text-gray-900'} dark:text-gray-300`">
      <img v-if="imageKey && item[imageKey]" class="" :src="require(`@/assets/${item[imageKey]}`)" alt="img">
      {{ item.key }}
    </label>
  </div>
  <div v-if="isSpecify" :class="`flex items-center pl-2 border ${isPreview ? 'bg-gray-100' : ''} ${error ? 'border-red-600' : 'border-gray-200'} rounded dark:border-gray-700`">
    <input :disabled="isPreview" :id="`${name}-${type}-input`" :type="type" :name="name" :checked="isCheckedSpecify(specify)" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
    <input :disabled="isPreview" v-model="specify" @input="handleEmit($event.target.value)" @focus="handleEmit($event.target.value)" type="text" placeholder="อื่นๆ โปรดระบุ" :class="`${isPreview ? '_input' : '_input-disable'} w-full my-2 mx-2`" required>
  </div>
</template>