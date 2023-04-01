<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, requiredIf, minValue, maxValue, requiredUnless, minLength, decimal, maxLength, integer } from '@vuelidate/validators'
import { useRouter, useRoute } from 'vue-router'
import SurveyForm from '@/components/SurveyForm'
import PageNotFound from '@/views/PageNotFound'
import { useStore } from 'vuex'
import api from '@/services'
import moment from 'moment'
import Modal from '@/components/Modal.vue'
import Cookies from 'js-cookie';

const props = defineProps({
  isNew: {
    type: Boolean,
    default: false
  }
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
    telegram: {
      telegramBefore: null,
      telegramAfter: null
    },
    nearby: {
      stationBefore: null,
      stationAfter: null
    },
    railType: {
      type: null,
      weight: null
    },
    areaCondition: []
  },
  railDamageSurvey: {
    uploadImages: [],
    situation: [],
    location: [],
    defectPattern: []
  },
  trackDamageSurvey: {
    uploadImages: [],
    trackGeometryCondition: {
      isPerfect: null,
      condition: []
    },
    ballastCondition: {
      isPerfect: null,
      condition: []
    },
    sleeperCondition: {
      isPerfect: null,
      condition: []
    },
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
  signature: null,
  createdBy: Cookies.get('isAuthenticated')
}
const surveyForm = ref()
const modalActive = ref(false)
const isConfirm = ref(false)
let railSurvey = reactive(railForm)
const isFetch = ref(false)

// COMPUTED
const rules = computed(() => {
  const rule = {}
  const uploadImage = {
    originalname: { required },
    originalPath: { required },
    mimetype: { required },
    // destination: { required },
    // filename: { required },
    size: { maxValue: helpers.withMessage(`Maximum value allowed is 5MB`, maxValue(5 * 1024 * 1024)) }
  }
  Object.keys(railForm).forEach((key1) => {
    if (['generalSurvey', 'railDamageSurvey', 'trackDamageSurvey', 'maintenanceRate'].includes(key1)) {
      rule[key1] = {}
      if (key1 === 'generalSurvey') {
        Object.keys(railForm[key1]).forEach((key2) => {
          rule[key1][key2] = {}
          if (key2 !== 'kilometers') {
            if (['coordinates', 'nearby', 'railType', 'telegram'].includes(key2)) {
              if (key2 === 'coordinates') {
                Object.keys(railForm[key1][key2]).forEach((key3) => {
                  rule[key1][key2][key3] = { required, decimal, custom: helpers.withMessage('Value must be positive decimal', (value) => value && value > 0)  }
                })
              } else if (key2 === 'railType') {
                Object.keys(railForm[key1][key2]).forEach((key3) => {
                  if (key3 === 'weight') {
                    rule[key1][key2][key3] = { decimal, custom: helpers.withMessage('Value must be positive decimal', (value) => value && value > 0) }
                  } else {
                    rule[key1][key2][key3] = { required }
                  }
                })
              } else {
                Object.keys(railForm[key1][key2]).forEach((key3) => {
                  rule[key1][key2][key3] = { required }
                })
              }
            } else if (key2 === 'areaCondition') {
              rule[key1][key2] = { required, minLength: minLength(1) }
            } else {
              rule[key1][key2] = { required }
            }
          }
        })
      } else if (key1 === 'railDamageSurvey') {
        Object.keys(railForm[key1]).forEach((key2) => {
          // CHECK LENGTH OF UPLOADIMAGES
          if (key2 === 'uploadImages') {
            rule[key1][key2] = {
              // requiredif: requiredIf(() => {
              //   return railSurvey[key1][key2].filter(upload => upload.isUploaded).length > 0
              // })
              $each: helpers.forEach(uploadImage),
              maxLength: maxLength(3)
            }
            // railSurvey[key1][key2].forEach(element => {
            //   if (!element.isUploaded) {

            //   }
            // })
            // if (railSurvey[key1][key2].length > 0) {
            // }
          } else {
            rule[key1][key2] = { required, minLength: minLength(1) }
          }
        })
      } else if (key1 === 'trackDamageSurvey') {
        Object.keys(railForm[key1]).forEach((key2) => {
          if (['trackGeometryCondition', 'ballastCondition', 'sleeperCondition'].includes(key2)) {
            rule[key1][key2] = {}
            Object.keys(railForm[key1][key2]).forEach((key3) => {
              if (key3 === 'condition') {
                rule[key1][key2][key3] = { isPerfect: requiredIf(() => railSurvey[key1][key2]['isPerfect'] === 'imperfect'), minLength: minLength(1) }
              } else {
                rule[key1][key2][key3] = { required }
              }
            })
          } else if (key2 === 'uploadImages') {
            rule[key1][key2] = {
              $each: helpers.forEach(uploadImage),
              maxLength: maxLength(3)
            }
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
                rule[key1][key2][key3] = { hasMaintenanceRecord: requiredIf(() => railSurvey[key1][key2]['hasMaintenanceRecord']) }
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
const compSubmitForm = computed(() => {
  let rtnRail = JSON.parse(JSON.stringify(railSurvey))
  Object.keys(rtnRail.trackDamageSurvey).forEach(key => {
    if (['trackGeometryCondition', 'ballastCondition', 'sleeperCondition'].includes(key)) {
      if (rtnRail.trackDamageSurvey[key].isPerfect === 'perfect') {
        rtnRail.trackDamageSurvey[key] = ['perfect']
      } else {
        rtnRail.trackDamageSurvey[key] = rtnRail.trackDamageSurvey[key].condition
      }
    }
  })
  return rtnRail
})

const handleSubmit = async () => {
  const isValid = await v$.value.$validate()
  // console.log(isValid, props.isNew)
  if (isValid) {
    modalActive.value = true
  } else {
    // surveyForm.value.scrollToError()
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
const submitForm = () => {
  if (props.isNew) {
    console.log('is New');
    console.log(surveyForm.value.test());
    const railFiles = eval('railDamageSurvey').files
    const trackFiles = eval('trackDamageSurvey').files
    let formData = new FormData()
    Array.from(railFiles).forEach((file, index) => {
      formData.append('file', file)
    })
    Array.from(trackFiles).forEach((file, index) => {
      formData.append('file', file)
    })
    api.uploadFils('/api/uploads', formData, null).then((resp) => {
      console.log('201');
      if (resp.status === 201) {
        resp.json().then((json) => {
          console.log(json)
          json.forEach(image => {
            railSurvey.railDamageSurvey.uploadImages.forEach((upload, index) => {
              if (upload.originalname === image.originalname) {
                railSurvey.railDamageSurvey.uploadImages[index].filename = image.filename
                railSurvey.railDamageSurvey.uploadImages[index].destination = image.path
              }
            })
            railSurvey.trackDamageSurvey.uploadImages.forEach((upload, index) => {
              if (upload.originalname === image.originalname) {
                railSurvey.trackDamageSurvey.uploadImages[index].filename = image.filename
                railSurvey.trackDamageSurvey.uploadImages[index].destination = image.path
              }
            })
          })
          api.post(`/api/rail-survey`, compSubmitForm.value, null).then((resp) => {
            if (resp.status === 201) {
              console.log('create success ;)')
              router.push('/survey-list')
            } else {
            }
          }).catch(() => {
            // navigator.serviceWorker.ready.then(registration => {
            //   // console.log(registration)
            //   registration.sync.register('some-unique-tag')
            // }).catch(console.log())
          })
        })
      }
    }).catch((err) => {
      console.log(err);
      // if (navigator.onLine) {
      //   uploadStatus.value = 'error'
      // } else {
      //   uploadStatus.value = 'offline'
      // }
    })
    // console.log(railFiles)
    // console.log(trackFiles)
    // Promise.all()
    // api.uploadFils('/api/uploads', formData, null)
    // api.post(`/api/rail-survey`, Object.assign(railSurvey, {generalSurvey: Object.assign(railSurvey.generalSurvey, { date: new Date(railSurvey.generalSurvey.date).toISOString() } )}) , null).then((resp) => {
    // api.post(`/api/rail-survey`, compSubmitForm.value, null).then((resp) => {
    //   if (resp.status === 201) {
    //     console.log('create success ;)')
    //     // router.push('/survey-list')
    //   } else {
    //   }
    // }).catch(() => {
    //   // navigator.serviceWorker.ready.then(registration => {
    //   //   // console.log(registration)
    //   //   registration.sync.register('some-unique-tag')
    //   // }).catch(console.log())
    // })
  } else {
    api.put(`/api/rail-survey/${railSurvey.id}`, compSubmitForm.value, null).then((resp) => {
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

onMounted(() => {
  if (props.isNew) {
    isFetch.value = true
    railSurvey.generalSurvey.date = moment(new Date()).format('YYYY-MM-DDTHH:mm')
    navigator.geolocation.getCurrentPosition((position)=> {
      const p = position.coords;
      railSurvey.generalSurvey.coordinates.latitude = p.latitude
      railSurvey.generalSurvey.coordinates.longitude = p.longitude
    })
  } else {
    getSurveyID(route.params.id)
  }
  // console.log(moment(new Date()).format('YYYY-MM-DDTHH:mm'));
  // console.log(new Date('2018-06-14T20:00'));
  // console.log(new Date('2018-06-14T20:00').toISOString());
})

const getSurveyID = (id) => {
  api.get(`/api/rail-survey/${id}`, store.state.token).then((resp) => {
    if (resp.status === 200) {
      // isReady.value = true
      resp.json().then((json) => {
        let rs = JSON.parse(JSON.stringify(json))
        Object.keys(rs.trackDamageSurvey).forEach((td) => {
          if (['ballastCondition', 'sleeperCondition', 'trackGeometryCondition'].includes(td)) {
            if (rs.trackDamageSurvey[td].length > 0) {
              rs.trackDamageSurvey[td] = {
                isPerfect: 'imperfect',
                condition: rs.trackDamageSurvey[td]
              }
            } else {
              rs.trackDamageSurvey[td] = {
                isPerfect: 'perfect',
                condition: []
              }
            }
          } else if (td === 'uploadImages') {
            rs.trackDamageSurvey[td].forEach((image, index) => {
              // console.log(image.destination);
              rs.trackDamageSurvey[td][index].originalPath = `${process.env.VUE_APP_BACK_END_URL}/${image.destination}`
            })
            // rs.trackDamageSurvey[td].originalPath = `${process.env.VUE_APP_BACK_END_URL}${rs.trackDamageSurvey[td].destination}`
          }
          rs.railDamageSurvey.uploadImages.forEach((image, index) => {
            rs.railDamageSurvey.uploadImages[index].originalPath = `${process.env.VUE_APP_BACK_END_URL}/${image.destination}`
          })
        })
        rs.generalSurvey.date = moment(rs.generalSurvey.date).format('YYYY-MM-DDTHH:mm')
        // console.log(rs);
        Object.assign(railSurvey, rs)
        isFetch.value = true
        // Object.assign(railSurvey, {
        //   generalSurvey: json.generalSurvey,
        //   // railDamageSurvey: json.railDamageSurvey,
        //   // trackDamageSurvey: json.trackDamageSurvey,
        //   // maintenanceRate: json.maintenanceRate,
        //   signature: json.signature,
        // })
        // Object.keys().forEach((key) => {
        //   if () 
        // })
        // survey = json
        // Object.assign(railSurvey, json, { date: new Date(json.date).toISOString().substring(0, 10), lastMaintenanceDate: new Date(json.lastMaintenanceDate).toISOString().substring(0, 10) })
        // Object.assign(railSurvey, json)
      })
    } else if (resp.status === 404) {
      // router.replace('/page-not-found')
    }
  })
}

</script>
<template>
  <!-- {{ v$.railDamageSurvey.$errors }} -->
  <!-- <div v-if="isReady">
  </div>
  <div v-else>
    <PageNotFound></PageNotFound>
  </div> -->
  <SurveyForm v-if="isFetch" :created="!isNew" :id="modalActive ? 'parent' : ''" ref="surveyForm" v-model="railSurvey" :validate="v$" @onSubmit="handleSubmit()"></SurveyForm>
  <!-- <button @click="modalActive = true">modalActive</button>
  <button @click="submitForm()">Submit</button> -->
  <Modal content v-model="modalActive">
    <template #content>
      <SurveyForm is-preview v-model="railSurvey" ref="surveyForm" :validate="v$"></SurveyForm>
    </template>
    <template #footer>
      <button @click="modalActive = false" data-modal-hide="extralarge-modal" type="button" class="_button-error">แก้ไขแบบฟอร์ม</button>
      <button @click="isConfirm = true" data-modal-hide="extralarge-modal" type="button" class="_button">ส่งแบบฟอร์ม</button>
    </template>
  </Modal>
  <Modal create v-model="isConfirm" @confirm="submitForm()"></Modal>
  <!-- <div class="container flex justify-center mt-4">
    <button type="button" class="_button" @click="handleSubmit()">Submit</button>
  </div> -->
  <!-- {{ route.params.id }}
  detail -->
</template>
<style>
#parent {
  /* width: 100%;
  height: 100%; */
  /* position: fixed; */
  overflow:scroll;
}
</style>