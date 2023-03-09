<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, requiredIf, minValue, maxValue, requiredUnless } from '@vuelidate/validators'
import { useRouter, useRoute } from 'vue-router'
import SurveyForm from '@/components/SurveyForm'
import PageNotFound from '@/views/PageNotFound'
import { useStore } from 'vuex'
import api from '@/services'
import moment from 'moment'

const props = defineProps({
  isNew: {
    type: Boolean,
    default: false
  }
})

onMounted(() => {
  console.log(moment(new Date()).format('YYYY-MM-DDTHH:mm'));
  console.log(new Date('2018-06-14T20:00'));
  console.log(new Date('2018-06-14T20:00').toISOString());
})

const store = useStore()
const router = useRouter()
const route = useRoute()
const railForm = {
  date: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
  zone: null,
  coordinates: {
    latitude: null,
    longitude: null
  },
  kilometers: null,
  nearby: {
    stationBefore: null,
    stationAfter: null
  },
  railType: null,
  areaCondition: null,
  defectSituation: {
    railPositionDefect: null,
    railAreaDefect: null,
  },
  defectPattern: null,
  surfaceDefect: null,
  railCondition: null,
  trackGeometryCondition: null,
  // defectTrackGeometry: null,
  ballastCondition: null,
  sleeperCondition: null,
  trackFoundationCondition: null,
  uploadImage: null,
  severity: null,
  isAnalyzeDamage: null,
  hasMaintenanceRecord: null,
  lastMaintenanceDate: null,
  yearlyMaintenanceTimes: null,
  maintenanceMethod: null,
  note: null,
  signature: null
  // createdAt: null,
  // createdBy: null
}
const isReady = ref(false)
const railSurvey = reactive(railForm)
const rules = computed(() => {
  const rule = {}
  Object.keys(railForm).forEach((key) => {
    if (!['uploadImage', 'note'].includes(key)) {
      switch (key) {
        case 'coordinates':
          rule[key] = {
            lattitude: { required },
            longitude: { required }
          }
          break
        case 'defectSituation':
          rule[key] = {
            railPositionDefect: { required },
            railAreaDefect: { required }
          }
          break
        case 'surfaceDefect':
          rule[key] = {
            defectPattern: requiredIf(() => railSurvey.defectPattern === 'surfaceDefect')
          }
          break
        case 'trackGeometryCondition':
          rule[key] = {
            track: (value) => value && value !== 'imperfect'
          }
          break
        case 'lastMaintenanceDate':
          rule[key] = {
            hasMaintenanceRecord: requiredIf(() => railSurvey.hasMaintenanceRecord)
          }
          break
        case 'yearlyMaintenanceTimes':
          rule[key] = {
            hasMaintenanceRecord: requiredIf(() => railSurvey.hasMaintenanceRecord)
          }
          break
        case 'maintenanceMethod':
          rule[key] = {
            hasMaintenanceRecord: requiredIf(() => railSurvey.hasMaintenanceRecord)
          }
          break
        default:
          rule[key] = { required }
          break
      }
    }
  })
  return rule
})
const v$ = useVuelidate(rules, railSurvey, { $autoDirty: true })

const handleSubmit = async () => {
  const isValid = await v$.value.$validate()
  console.log(isValid)
  if (isValid) {
    if (props.isNew) {
      api.post(`/api/rail-survey`, Object.assign(railSurvey, { lastMaintenanceDate: new Date(railSurvey.lastMaintenanceDate).toISOString() }), store.state.token).then((resp) => {
        if (resp.status === 201) {
          console.log('create success ;)')
          router.push('/survey-list')
        } else {
        }
      }).catch(() => {
        navigator.serviceWorker.ready.then(registration => {
          // console.log(registration)
          registration.sync.register('some-unique-tag')
        }).catch(console.log())
      })
    } else {
      api.put(`/api/rail-survey/${railSurvey.id}`, railSurvey, store.state.token).then((resp) => {
        if (resp.status === 200) {
          console.log('update success ;)')
          router.push('/survey-list')
        } else {
        }
      }).catch(() => {
        navigator.serviceWorker.ready.then(registration => {
          // console.log(registration)
          registration.sync.register('some-unique-tag')
        }).catch(console.log())
      })
    }
  }
  // const { isEmpty, data } = signaturePad.value.saveSignature()
  // railSurvey.signature = data
  // IndexDB.insertData('railway-survey', 1, { fname: 'wissarut', lname: 'sangjong' })
  // router.push('/survey-list')
  // console.log(isValid);
  // api.post(`/`, railSurvey, store.state.token).then((resp) => {
  //   if (resp.status === 201) {
  //     console.log('create success ;)')
  //   } else {
  //   }
  // }).catch(() => {
  //   navigator.serviceWorker.ready.then(registration => {
  //     // console.log(registration)
  //     registration.sync.register('some-unique-tag')
  //   }).catch(console.log())
  // })
  // // IndexDB.createDB('test-db', 1, 'book', { id: 'js', name: 'Harry Porter' })
  // router.push('/survey-list')
}

onMounted(() => {
  navigator.geolocation.getCurrentPosition((position)=> {
    const p = position.coords;
    railSurvey.coordinates.lattitude = p.latitude
    railSurvey.coordinates.longitude = p.longitude
    // console.log(p.latitude, p.longitude);
  })
  if (!props.isNew) {
    getSurveyID(route.params.id)
  }
})

const getSurveyID = (id) => {
  api.get(`/api/rail-survey/${id}`, store.state.token).then((resp) => {
    console.log(resp.status);
    if (resp.status === 200) {
      // isReady.value = true
      resp.json().then((json) => {
        // survey = json
        Object.assign(railSurvey, json, { date: new Date(json.date).toISOString().substring(0, 10), lastMaintenanceDate: new Date(json.lastMaintenanceDate).toISOString().substring(0, 10) })
      })
    } else if (resp.status === 404) {
      // router.replace('/page-not-found')
    }
  })
}

</script>
<template>
  <!-- {{ railSurvey }} -->
  <!-- <div v-if="isReady">
  </div>
  <div v-else>
    <PageNotFound></PageNotFound>
  </div> -->
  <SurveyForm v-model="railSurvey" :validate="v$"></SurveyForm>
  <div class="container flex justify-end mt-8">
    <button type="button" class="_button" @click="handleSubmit()">Submit</button>
  </div>
  <!-- {{ route.params.id }}
  detail -->
</template>