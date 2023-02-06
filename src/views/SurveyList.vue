<script setup>
import Table from '@/components/Table.vue'
import store from '@/store'
import { onMounted, ref } from 'vue'
import api from '@/services'
import IndexDB from '@/IndexedDB'

const list = ref([])

onMounted (() => {
  getSurveyList()
})



const getSurveyList = () => {
  // IndexDB.getAllContacts('railway-survey', 1, function (items) {
  //   console.log(items);
  //   list.value = items
  // })
  Promise.resolve()
    .then(() => IndexDB.getAllContacts2('railway-survey', 1))
    .then((arr) => {
      list.value = arr;
    })
    .catch((err) => console.error(err))
}
  // console.log(IndexDB.getAllStudents('railway-survey', 1), cb);
  // list.value = (IndexDB.getAllStudents('railway-survey', 1))
  // console.log();
  // const asd = IndexDB.getAllContacts('railway-survey', 1)
  // IndexDB.getAllContacts('railway-survey', 1).forEach(element => {
  //   console.log(element);
  // });
  // api.get('/', null).then((resp) => {
  //   if (resp.status === 200) {
  //   }
  // }).catch((error) => {
  //   console.log('offline');
  // })

</script>
<template>
{{ list }}
  <!-- {{ store.state.isSuportIndexedDB }} -->
</template>