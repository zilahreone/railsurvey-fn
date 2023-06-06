<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
const props = defineProps({
  ref: {
    type: String,
    default: 'signaturePad',
    required: true
  },
  backgroundImage: {
    type: String,
    default: '',
    required: false
  },
  style: {
    type: Object,
    default: {},
    required: false
  },
  penColor: {
    type: String,
    default: 'black',
    required: false
  },
  width: {
    type: String,
    default: null,
    required: false
  },
  height: {
    type: String,
    default: null,
    required: false
  }
})
const emit = defineEmits(['update:modelValue'])
const signaturePad = ref(props.ref)
onMounted(() => {
})
const undo = () => {
  signaturePad.value.undoSignature()
  const { isEmpty, data } = signaturePad.value.saveSignature()
  if (!isEmpty) emit('update:modelValue', data)
}
const clear = () => {
  signaturePad.value.clearSignature()
  emit('update:modelValue', null)
}
const onBegin = () => {}
const onEnd = () => {
  const { isEmpty, data } = signaturePad.value.saveSignature()
  if (!isEmpty) emit('update:modelValue', data)
}
const compCustomStyle = computed(() => {
  return {
    backgroundImage: `url(${require('@/assets/rail/rail_1.jpg')})`,
    backgroundRepeat: 'no-repeat'
  }
})

</script>
<template>
  <div class="flex flex-col items-center border p-0 border-gray-200 gap-2">
    <div class="flex">
      <button @click="undo" type="button" class="text-gray-900 hover:bg-gray-100 font-medium border-b border-x rounded-bl-md text-sm px-5 py-1">ย้อนกลับ</button>
      <button @click="clear" type="button" class="text-gray-900 hover:bg-gray-100 font-medium border-b border-r text-sm px-5 py-1">เคลียร์</button>
      <!-- <button @click="emit('onSubmit')" type="button" class="text-gray-900 hover:bg-gray-100 font-medium border-b border-r rounded-br-md text-sm px-5 py-1">Submit</button> -->
    </div>
    <div class="p-2">
      <VueSignaturePad :width="width" :height="height" :customStyle="style" :options="{ onBegin, onEnd, penColor: penColor, maxWidth: 1.5 }" ref="signaturePad" />
    </div>
    <slot></slot>
    <!-- <label class="pb-1 flex flex-col items-center text-sm font-medium text-gray-900 dark:text-white">ผู้สำรวจและบันทึกความเสียหาย</label> -->
  </div>
</template>