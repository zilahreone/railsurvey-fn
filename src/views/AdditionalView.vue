<script setup>
const documents = [
  {
    title: 'Work_instruction_FA_rail',
    url: '/doc/Work_instruction_FA_rail.pdf'
  },
  {
    title: 'กรณีศึกษาความเสียหายของรางรถไฟในต่างประเทศ',
    url: '/doc/กรณีศึกษาความเสียหายของรางรถไฟในต่างประเทศ.pdf'
  },
  {
    title: 'ตัวอย่างกรณีศึกษาความเสียหายของรางรถไฟในประเทศไทย',
    url: '/doc/ตัวอย่างกรณีศึกษาความเสียหายของรางรถไฟในประเทศไทย.pdf'
  },
  {
    title: 'อภิธานศัพท์ความเสียหายของราง',
    url: '/doc/อภิธานศัพท์ความเสียหายของราง.pdf'
  },
]
const handleOpenPDF = () => {
  window.open('/doc/Work_instruction_FA_rail.pdf', target="_blank")
}
</script>
<template>
  <div class="mx-5 md:ml-10 flex flex-col">
    <div>
      <p class="text-xl md:text-2xl font-semibold pb-6">เอกสารเพิ่มเติม</p>
    </div>
    <div>
      <ul class="space-y-4 text-left text-gray-500 dark:text-gray-400">
        <li v-for="(doc, index) in documents" :key="index" class="flex items-center space-x-3 hover:text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <a :href="doc.url">{{ doc.title }}</a>
        </li>
      </ul>
    </div>
    <!-- <div class="flex flex-col">
      <a v-for="(doc, index) in documents" :key="index" :href="doc.url">{{ doc.title }}</a>
    </div> -->
  </div>
</template>