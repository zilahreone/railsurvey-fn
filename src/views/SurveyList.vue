<script setup>
import Table from '@/components/Table.vue'
import store from '@/store'
import { onMounted } from 'vue'
import api from '@/services'

onMounted (() => {
  getSurveyList()
})

const getSurveyList = () => {
  api.get('/', null).then((resp) => {
    if (resp.status === 200) {
    }
  }).catch((error) => {
    console.log('offline');
  })
}

</script>
<template>
  {{ store.state.isSuportIndexedDB }}
  <div class="container">
    <Table></Table>

    <!-- <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      sdf
    </div> -->

  </div>
</template>