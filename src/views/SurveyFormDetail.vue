<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, requiredIf, minValue, maxValue, requiredUnless, minLength, decimal } from '@vuelidate/validators'
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
  generalSurvey: {
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
    areaCondition: []
  },
  railDamageSurvey: {
    uploadImages: {},
    situation: [],
    location: [],
    defectPattern: []
  },
  trackDamageSurvey: {
    uploadImages: {},
    trackGeometryCondition: [],
    ballastCondition: [],
    sleeperCondition: [],
    trackFoundationCondition: null,
  },
  maintenanceRate: {
    severity: null,
    isAnalyzeDamage: null,
    maintenanceRecord: {
      hasMaintenanceRecord: null,
      lastMaintenanceTimes: null,
      yearlyMaintenanceTimes: null,
    },
    maintenanceMethod: []
  },
  signature: null
}
const surveyForm = ref()
const railSurvey = reactive(railForm)
const rules = computed(() => {
  const rule = {}
  Object.keys(railForm).forEach((key1) => {
    if (['generalSurvey', 'railDamageSurvey', 'trackDamageSurvey', 'maintenanceRate'].includes(key1)) {
      rule[key1] = {}
      if (key1 === 'generalSurvey') {
        Object.keys(railForm[key1]).forEach((key2) => {
          if (['coordinates', 'nearby'].includes(key2)) {
            rule[key1][key2] = {}
            if (key2 === 'coordinates') {
              Object.keys(railForm[key1][key2]).forEach((key3) => {
                rule[key1][key2][key3] = { required, decimal, custom: helpers.withMessage('Value must be positive decimal', (value) => value && value > 0)  }
              })
            } else if (key2 === 'nearby') {
              Object.keys(railForm[key1][key2]).forEach((key3) => {
                rule[key1][key2][key3] = { required }
              })
            }
          } else if (key2 === 'areaCondition') {
            rule[key1][key2] = { required, minLength: minLength(1) }
          } else {
            rule[key1][key2] = { required }
          }
        })
      } else if (key1 === 'railDamageSurvey' || key1 === 'trackDamageSurvey') {
        Object.keys(railForm[key1]).forEach((key2) => {
          if (key2 !== 'uploadImages') {
            rule[key1][key2] = { required, minLength: minLength(1) }
          } else {
            rule[key1][key2] = { required }
          }
        })
      } else if (key1 === 'maintenanceRate') {
        Object.keys(railForm[key1]).forEach((key2) => {
          if (key2 === 'maintenanceRecord') {
            rule[key1][key2] = {}
            Object.keys(railForm[key1][key2]).forEach((key3) => {
              if (key3 === 'hasMaintenanceRecord') {
                rule[key1][key2][key3] = { required }
              } else {
                rule[key1][key2][key3] = { hasMaintenanceRecord: requiredIf(() => railForm[key1][key2][key3]) }
              }
            })
          } else if (key2 === 'maintenanceMethod') {
            rule[key1][key2] = { required, minLength: minLength(1) }
          } else {
            rule[key1][key2] = { required }
          }
        })
      }
    } else {
      rule[key1] = { required }
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
  } else {
    console.log(surveyForm.value.general)
    surveyForm.value.scrollToError()
    // console.log(surveyForm.value);
    // window.scrollTo(0, top)
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
    railSurvey.generalSurvey.coordinates.latitude = p.latitude
    railSurvey.generalSurvey.coordinates.longitude = p.longitude
    // console.log(p.latitude, p.longitude);
  })
  if (!props.isNew) {
    // getSurveyID(route.params.id)
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
const test = (val) => {
  console.log(val);
}

</script>
<template>
  <!-- {{ railSurvey }} -->
  <!-- <div v-if="isReady">
  </div>
  <div v-else>
    <PageNotFound></PageNotFound>
  </div> -->
  <SurveyForm ref="surveyForm" @input="test($event.target.value)" v-model="railSurvey" :validate="v$" @submit="handleSubmit()"></SurveyForm>
  <!-- <div class="container flex justify-end mt-8">
    <button type="button" class="_button" @click="handleSubmit()">Submit</button>
  </div> -->
  <!-- {{ route.params.id }}
  detail -->
</template>