<script setup>
import Table from '@/components/Table.vue'
import variable from '@/variable.json'
// import store from '@/store'
import { useStore } from 'vuex'
import { onMounted, ref, computed } from 'vue'
import api from '@/services'
import moment from 'moment'
import tz from 'moment-timezone'
import TailTable from '@/components/TailTable.vue'
import { useToast } from 'vue-toastification'
import pdfMake from 'pdfmake'

const toast = useToast()
const store = useStore()

const surveyList = ref([])
// const indexedDBList = ref([])
const count = ref(0)
const perPage = ref(20)
const page = ref(1)

onMounted (() => {
  getCount()
  getOfflineForm()
  getSurveyList2()
  if (navigator.onLine) {
    // handleDeleteOldCache()
  } else {
    // console.log('offline');
  }
})
const getSurveyList2 = (p) => {
  if (p) page.value = p
  api.get(`/api/rail-survey/?offset=${(perPage.value * page.value) - perPage.value}`, null).then((resp) => {
    if (resp.status === 200) {
      resp.json().then((json) => {
        surveyList.value = json
      })
    }
  }).catch((err) => {
    if(navigator.onLine){
      toast.error('เกิดความผิดพลาดกับระบบ')
    } else {
      toast.warning('ระบบอยู่ในสถานะออฟไลน์')
    }
  })
  // store.state.token
}
// const generateId = (length = 8) => {
//   let result = ''
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
//   const charactersLength = characters.length
//   let counter = 0
//   while (counter < length) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength))
//     counter += 1
//   }
//   return result
// }
// const handleDeleteOldCache = () => {
//   caches.keys().then((cacheNames) => {
//     cacheNames.forEach(cacheName => {
//       // console.log(`cache name: ${cacheName}`);
//       if (cacheName === 'rail-cache') {
//         caches.open(cacheName).then((cache) => {
//           // cache.delete(`${process.env.VUE_APP_BACK_END_URL}/api/rail-survey/${id}`).then((response) => {
//           // })
//         })
//       }
//     })
//   })
// }
const getOfflineForm = () => {
  const dbName = 'workbox-background-sync'
  const dbVersion = 3
  const storeName = 'requests'
  let items = []
  const responseOptions = { status: 200, statusText: 'OK', headers: { 'content-type': 'application/json' } }
  if (!window.indexedDB) {
    console.warn(`Your browser doesn't support IndexedDB`)
  } else {
    indexedDB.databases().then(dbs => {
      dbs.forEach(db => {
        if (db.name === dbName) {
          const dbOpen = indexedDB.open(dbName, dbVersion)
          dbOpen.onsuccess = (event) => {
            const db = event.target.result
            const getAll = db.transaction(storeName).objectStore(storeName).getAll();
            getAll.onsuccess = () => {
              const result = getAll.result;
              result?.forEach((request, index) => {
                // let fomdata = new FormData(request.requestData?.body)
                // console.log(fomdata);
                const regex = /^\{.*\}$/gm
                const body = request.requestData?.body
                if (body) {
                  if (('TextDecoder' in window)) {
                    const enc = new TextDecoder('utf-8')
                    // console.log(enc.decode(body));
                    let parse = JSON.parse(enc.decode(body).match(regex)[0])
                    let clone = JSON.parse(JSON.stringify(parse))
                    // console.log(parse);
                    Object.keys(parse).forEach(key => {
                      if (key === 'createdBy') {
                        clone[key] = { id: parse.createdBy, username: `offline-cache` }
                      }
                    })
                    items.push(clone)
                  }
                }
              })
              caches.keys().then((cacheNames) => {
                cacheNames.forEach(cacheName => {
                  // console.log(`cache name: ${cacheName}`);
                  if (cacheName === 'rail-cache') {
                    caches.open(cacheName).then((cache) => {
                      // console.log(`items: ${items}`);
                      items.forEach((item, index) => {
                        if (item.id) {
                          cache.put(`${process.env.VUE_APP_BACK_END_URL}/api/rail-survey/${item.id}`, new Response(JSON.stringify(item), responseOptions))
                        } else {
                          const genId = `offline-${index + 1}`
                          fetch(`${process.env.VUE_APP_BACK_END_URL}/api/rail-survey/?offset=0`).then(response => {
                            response.json().then(json => {
                              const form = {id: genId, ...item}
                              let fetchCache = json.filter(item => !item.id.includes('offline'))
                              // console.log(json)
                              cache.put(`${process.env.VUE_APP_BACK_END_URL}/api/rail-survey/${genId}`, new Response(JSON.stringify(form), responseOptions))
                              cache.put(`${process.env.VUE_APP_BACK_END_URL}/api/rail-survey/?offset=0`, new Response(JSON.stringify([form, ...fetchCache]), responseOptions))
                              cache.put(`${process.env.VUE_APP_BACK_END_URL}/api/rail-survey/count`, new Response(fetchCache.length + 1, responseOptions))
                              getSurveyList2()
                            })
                          })
                        }
                      })
                    })
                  }
                })
              })
            }
            getAll.onerror = (err) => {
              console.error(`Error to get all ${err}`)
            }
          }
        }
      })
    })
  }
}
const getCount = () => {
  api.get('/api/rail-survey/count', null).then((resp) => {
    if (resp.status === 200) {
      resp.json().then((json) => {
        count.value = json
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
      getCount()
      getSurveyList2()
    }
  }).catch((err) => {
  })
}
const handleDownloadPDF = () => {
  pdfMake.fonts = {
    // download default Roboto font from cdnjs.com
    Roboto: {
      normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
      bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
      italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
      bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
    },
    Kanit: {
      normal: 'https://fonts.cdnfonts.com/s/15799/Kanit-Regular.woff',
      bold: 'https://fonts.cdnfonts.com/s/15799/Kanit-Medium.woff',
      italics: 'https://fonts.cdnfonts.com/s/15799/Kanit-ThinItalic.woff',
      bolditalics: 'https://fonts.cdnfonts.com/s/15799/Kanit-LightItalic.woff'
    }
  }
  const docDefinition = {
    watermark: { text: 'test watermark', color: 'blue', opacity: 0.3, bold: false, italics: false, fontSize: 10, angle: 70 },
    info: {
      title: 'awesome Document',
      author: 'john doe',
      subject: 'subject of document',
      keywords: 'keywords for document',
    },
    content: [
    { text: 'This is a header', style: 'header' },
    'No styling here, this is a standard paragraph',
    { text: 'Another text', style: 'anotherStyle' },
    { text: 'Multiple styles applied', style: [ 'header', 'anotherStyle' ] }
  ],

  styles: {
    header: {
      fontSize: 22,
      bold: true
    },
    anotherStyle: {
      italics: true,
      alignment: 'right'
    }
  },
    defaultStyle: {
      font: 'Kanit'
    }
  }
  pdfMake.createPdf(docDefinition).open();
}
const compSurveyList = computed(() => {
  // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
  return surveyList.value.map(sl => {
    return {
      id: sl.id,
      // date: sl.generalSurvey.date,
      area: variable.areas.filter(area => area.value === sl.generalSurvey.area)[0]?.key,
      zone: variable.areas.filter(area => area.value === sl.generalSurvey.area)[0]?.zones.filter(zone => zone.value === sl.generalSurvey.zone)[0]?.key,
      station: variable.areas.filter(area => area.value === sl.generalSurvey.area)[0]?.zones.filter(zone => zone.value === sl.generalSurvey.zone)[0]?.stations.filter(station => station.value === sl.generalSurvey.station)[0]?.key,
      date: moment.utc(sl.generalSurvey.date).local().format('DD-MM-YYYY HH:mm:ss'),
      zoneBe: variable.zone.filter((z) => z.value === sl.generalSurvey.nearby.stationBefore)[0]?.key,
      zoneAf: variable.zone.filter((z) => z.value === sl.generalSurvey.nearby.stationAfter)[0]?.key,
      kilometers: sl.generalSurvey.kilometers ? sl.generalSurvey.kilometers : '-',
      createAt: moment.utc(sl.createdAt).local().format('DD-MM-YYYY HH:mm:ss'),
      createdBy: sl.createdBy || { username: '-' },
      modifiedBy: sl.modifiedBy || { username: '-' },
      modifiedAt: sl.modifiedAt ? moment.utc(sl.modifiedAt).local().format('DD-MM-YYYY HH:mm:ss') : '-'
      // createdAt: sl.createdAt
    }
  })
})

</script>
<template>
  <!-- {{ indexedDBList }} -->
  <!-- {{ surveyList.map(l => l.createdAt) }} -->
  <div class="container">
    <!-- <pre>{{ surveyList }}</pre> -->
    <Table :tbody="compSurveyList">
      <template #thead>
        <th class="py-3 px-6">วันที่สำรวจ</th>
        <!-- <th class="py-3 px-6">วันที่สร้างฟอร์ม</th> -->
        <!-- <th class="py-3 px-6">รหัสฟอร์ม</th> -->
        <th class="py-3 px-6">เขตการเดินรถ</th>
        <th class="py-3 px-6">แขวง</th>
        <th class="py-3 px-6">สถานี</th>
        <!-- <th class="py-3 px-6">สถานีก่อนหน้า</th>
        <th class="py-3 px-6">สถานีถัดไป</th> -->
        <!-- <th class="py-3 px-6">หลักกิโลเมตร</th> -->
        <th class="py-3 px-6">สร้างโดย</th>
        <th class="py-3 px-6">แก้ไขโดย</th>
        <th class="py-3 px-6">แก้ไขเมื่อ</th>
        <!-- <th class="py-3 px-6">ดาวน์โหลด</th> -->
      </template>
      <template #tbody="{ item, index }">
        <td class="py-2 px-4">
          <router-link :to="{ path: `form/${item.id}`}" class="capitalize hover:text-blue-500">{{ item.date }}</router-link>
        </td>
        <!-- <td class="py-2 px-4">
        </td> -->
        <td class="py-2 px-4">
          <router-link :to="{ path: `form/${item.id}`}" class="capitalize hover:text-blue-500">{{ item.area }}</router-link>
        </td>
        <td class="py-2 px-4">
          <router-link :to="{ path: `form/${item.id}`}" class="capitalize hover:text-blue-500">{{ item.zone }}</router-link>
        </td>
        <td class="py-2 px-4">
          <router-link :to="{ path: `form/${item.id}`}" class="capitalize hover:text-blue-500">{{ item.station }}</router-link>
        </td>
        <!-- <td class="py-2 px-4">
          {{ item.zoneBe }}
        </td>
        <td class="py-2 px-4">
          {{ item.zoneAf }}
        </td> -->
        <!-- <td class="py-2 px-4">
          <router-link :to="{ path: `form/${item.id}`}" class="capitalize hover:text-blue-500">{{ item.kilometers }}</router-link>
        </td> -->
        <td class="py-2 px-4">
          <router-link :to="{ path: `form/${item.id}`}" class="capitalize hover:text-blue-500">{{ item.createdBy.username }}</router-link>
        </td>
        <td class="py-2 px-4">
          <router-link :to="{ path: `form/${item.id}`}" class="capitalize hover:text-blue-500">{{ item.modifiedBy.username }}</router-link>
        </td>
        <!-- <td class="py-2 px-4">
          <router-link :to="{ path: `form/${item.id}`}" class="capitalize hover:text-blue-500">{{ item.createAt }}</router-link>
        </td> -->
        <td class="py-2 px-4">
          <router-link :to="{ path: `form/${item.id}`}" class="capitalize hover:text-blue-500">{{ item.modifiedAt }}</router-link>
        </td>
        <!-- <td class="py-2 px-4">
          <button type="button" @click="handleClickDelete(index, item.id)">
            <svg class="w-6 h-6 text-red-500 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </td> -->
        <!-- <td class="py-2 px-4">
          <button @click="handleDownloadPDF()" type="button" class="text-blue-500 hover:text-blue-800 font-medium text-sm p-2.5 text-center inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
            </svg>
            <span class="sr-only">Download</span>
          </button>
        </td> -->
      </template>
    </Table>
    <TailTable :count="count" :page="page" :per-page="perPage" @page="getSurveyList2($event)"></TailTable>
    <!-- <button @click="formData()">FORMDATA</button> -->
  </div>
</template>