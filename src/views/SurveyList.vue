<script setup>
import Table from '@/components/Table.vue'
import variable from '@/assets/variable.json'
// import store from '@/store'
import { useStore } from 'vuex'
import { onMounted, ref, computed } from 'vue'
import api from '@/services'
import IndexDB from '@/IndexedDB'

const store = useStore()

const surveyList = ref([])

onMounted (() => {
  getSurveyList2()
})

const getSurveyList2 = () => {
  api.get('/api/rail-survey', store.state.token).then((resp) => {
    if (resp.status === 200) {
      resp.json().then((json) => {
        surveyList.value = json
      })
    }
  }).catch((err) => {
  })
}

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

const handleClickDelete = (index, id) => {
  hadleDelete(id)
}

const hadleDelete = (id) => {
  api.delete(`/api/rail-survey/${id}`, store.state.token).then((resp) => {
    if (resp.status === 200) {
      // resp.json().then((json) => {
      //   surveyList.value = json
      // })
    }
  }).catch((err) => {
  })
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

const compSurveyList = computed(() => {
  return surveyList.value.map(sl => {
    return {
      id: sl.id,
      date: sl.date.substring(0, 10),
      zone: variable.zone.filter((z) => z.value === sl.zone)[0].key,
      createdBy: sl.createdBy.username
    }
  })
})

</script>
<template>
  <div class="container h-full">
    <!-- <pre>{{ surveyList }}</pre> -->
    <Table :tbody="compSurveyList">
      <template #thead>
        <th class="py-3 px-6">รหัสฟอร์ม</th>
        <th class="py-3 px-6">วันที่สำรวจ</th>
        <th class="py-3 px-6">เขตการเดินรถ</th>
        <th class="py-3 px-6">สร้างโดย</th>
      </template>
      <template #tbody="{ item, index }">
        <td class="py-2 px-4">
          <router-link :to="{ path: `form/${item.id}`}" class="capitalize hover:text-blue-500">{{ item.id }}</router-link>
        </td>
        <td class="py-2 px-4">
          {{ item.date.substring(0, 10) }}
        </td>
        <td class="py-2 px-4">
          {{ item.zone }}
        </td>
        <td class="py-2 px-4">
          {{ item.createdBy }}
        </td>
        <td class="py-2 px-4">
          <button type="button" @click="handleClickDelete(index, item.id)">
            <svg class="w-6 h-6 text-red-500 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </td>
      </template>
    </Table>
  </div>
</template>