<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // console.log('fff')
})
const toDataURL = async (url) => {
  // console.log(url);
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        // console.log(reader.result);
        resolve(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  })
}
</script>
<template>
  <div id="testtest" class="border-b-4 border-blue-900">
    <div class="flex items-center gap-4">
      <img class="object-contain h-10" :src="(require('@/assets/rmt-logo.png'))" alt="rmt-logo">
      <img class="object-contain h-20" :src="(require('@/assets/srt-title.jpg'))" alt="srt-title">
    </div>
  </div>
  <div class="py-4 text-center text-lg font-semibold">
    บันทึกความเสียหายของ รางรถไฟ
  </div>
  <div class="border-[3px] border-blue-900">
    asdfasdf
  </div>
</template>
<!-- <style>
body {
  height: 842px;
  width: 595px;
  /* to centre page on screen*/
  margin-left: auto;
  margin-right: auto;
}
</style> -->