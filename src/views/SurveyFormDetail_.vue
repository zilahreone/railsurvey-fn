<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, requiredIf, minValue, maxValue, requiredUnless, minLength, decimal, maxLength, integer } from '@vuelidate/validators'
import { useRouter, useRoute } from 'vue-router'
import SurveyForm from '@/components/SurveyForm'
import PageNotFound from '@/views/PageNotFound'
import { useStore } from 'vuex'
import api from '@/services'
import moment from 'moment-timezone'
import Modal from '@/components/Modal.vue'
import Cookies from 'js-cookie';
import validate from '@/validate'
import form from '@/template_form_.json'
// import variable from '@/variable.json'

const store = useStore()
const router = useRouter()
const route = useRoute()

const isFetch = ref(false)
const clone = JSON.parse(JSON.stringify(form))
const isConfirm = ref(false)
const modalActive = ref(false)
let railSurvey = reactive(clone)
const v$ = useVuelidate(validate(form, railSurvey), railSurvey, { $autoDirty: true })

onMounted(() => {
  getSurveyID(route.params.id)
  // console.log('start');
})
const getSurveyID = (id) => {
  let rs = {}
  let railUploadImages = []
  let trackUploadImages = []
  // console.log('a');
  api.get(`/api/rail-survey/${id}`, store.state.token).then((resp) => {
    if (resp.status === 200) {
      resp.json()
      .then((json) => {
        // console.log(json);
        // console.log(new Date(json.generalSurvey.date));
        // console.log(moment(json.generalSurvey.date).format('YYYY-MM-DDTHH:mm'));
        // console.log(moment.tz(json.generalSurvey.date, 'Asia/Bangkok').utc().format('YYYY-MM-DDTHH:mm'));
        rs = JSON.parse(JSON.stringify(json))
        // resolve(json)
        Object.keys(json.trackDamageSurvey).forEach((td) => {
          if (['ballastCondition', 'sleeperCondition', 'trackGeometryCondition'].includes(td)) {
            json.trackDamageSurvey[td].forEach(element => {
              if (element === 'perfect') {
                rs.trackDamageSurvey[td] = {
                  isPerfect: element,
                  condition: []
                }
              } else {
                rs.trackDamageSurvey[td] = {
                  isPerfect: 'imperfect',
                  condition: json.trackDamageSurvey[td]
                }
              }
            })
          } else if (td === 'uploadImages') {
            // console.log('b');
            json.trackDamageSurvey[td].forEach((image, index) => {
              // const image = JSON.parse(image.replace(/\|/g, ', '))
              // console.log(image);
              // console.log(image.replace(/\|/g, ', '))
              // console.log('b', image.filename);
              // if (typeof image === 'object' ) {
              // }
              // let blob = await fetch(`${process.env.VUE_APP_BACK_END_URL}/${process.env.VUE_APP_IMAGE_DIR}/${image.filename}`).then(r => r.blob())
              trackUploadImages.push({
                originalname: typeof image === 'object' ? image.filename : image,
                originalPath: `${process.env.VUE_APP_BACK_END_URL}/${process.env.VUE_APP_IMAGE_DIR}/${typeof image === 'object' ? image.filename : image}`,
                size: null
              })
            })
            // console.log('b end');
            rs.trackDamageSurvey.uploadImages = trackUploadImages
          }
        })
        json.railDamageSurvey.uploadImages.forEach((image, index) => {
          // const image = JSON.parse(image.replace(/\|/g, ', '))
          // console.log('c', image.filename);
          // if (image.filename) {
          // }
          // let blob = await fetch(`${process.env.VUE_APP_BACK_END_URL}/${process.env.VUE_APP_IMAGE_DIR}/${image.filename}`).then(r => r.blob())
          railUploadImages.push({
            originalname: typeof image === 'object' ? image.filename : image,
            originalPath: `${process.env.VUE_APP_BACK_END_URL}/${process.env.VUE_APP_IMAGE_DIR}/${typeof image === 'object' ? image.filename : image}`,
            size: null
          })
        })
        rs.railDamageSurvey.uploadImages = railUploadImages
        // console.log(railUploadImages);
        rs.generalSurvey.date = moment(json.generalSurvey.date).format('YYYY-MM-DDTHH:mm')
        // rs.createdAt
        Object.assign(railSurvey, rs)
        isFetch.value = true
      })
    }
  })
}
const handleSubmit = async () => {
  const isValid = await v$.value.$validate()
  console.log(isValid ? 'VALID ;)' : 'INVALID :(', v$.value.$errors);
  if (isValid) {
    modalActive.value = true
  }
}
const submitForm = () => {
  let formData = new FormData()
  const uploadImages = [...railSurvey.railDamageSurvey.uploadImages, ...railSurvey.trackDamageSurvey.uploadImages]
  uploadImages.forEach(images => {
    if (images.file) {
      formData.append('file', images.file)
    }
    // console.log(images.file);
    // const file_ = new File([images.file], images.filename, { type: images.type })
    // list.items.add(file_)
  })
  formData.append('form', JSON.stringify(compSubmitForm.value))
  // console.log(compSubmitForm.value);
  api.putUploadFiles(`/api/rail-survey/${railSurvey.id}`, formData, null).then((resp) => {
    if (resp.status === 201) {
      console.log('update success ;)')
      router.push('/survey-list')
    }
  }).catch(() => {
    // navigator.serviceWorker.ready.then(registration => {
    //   console.log('registration')
    //   registration.sync.register('some-unique-tag')
    // }).catch(console.log())
  })
}
const compSubmitForm = computed(() => {
  let rtnRail = JSON.parse(JSON.stringify(railSurvey))
  const time = moment(rtnRail.generalSurvey.date).utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z'
  Object.keys(rtnRail.trackDamageSurvey).forEach(key => {
    if (['trackGeometryCondition', 'ballastCondition', 'sleeperCondition'].includes(key)) {
      if (rtnRail.trackDamageSurvey[key].isPerfect === 'perfect') {
        rtnRail.trackDamageSurvey[key] = ['perfect']
      } else {
        rtnRail.trackDamageSurvey[key] = rtnRail.trackDamageSurvey[key].condition
      }
    } else if (key === 'uploadImages') {
      rtnRail.trackDamageSurvey[key] = rtnRail.trackDamageSurvey[key].map(image => image.filename || image.originalname)
    }
  })

  // Object.keys(rtnRail.trackDamageSurvey).forEach(key => {
  //   if (['trackGeometryCondition', 'ballastCondition', 'sleeperCondition'].includes(key)) {
  //     if (key === 'sleeperCondition') {
  //       if (rtnRail.trackDamageSurvey[key].isPerfect === 'dilapidated') {
  //         rtnRail.trackDamageSurvey[key] = rtnRail.trackDamageSurvey[key].condition
  //       } else {
  //         rtnRail.trackDamageSurvey[key] = [rtnRail.trackDamageSurvey[key].isPerfect]
  //       }
  //     } else {
  //       if (rtnRail.trackDamageSurvey[key].isPerfect === 'perfect') {
  //         rtnRail.trackDamageSurvey[key] = ['perfect']
  //       } else {
  //         rtnRail.trackDamageSurvey[key] = rtnRail.trackDamageSurvey[key].condition
  //       }
  //     }
  //   } else if (['uploadImages'].includes(key)) {
  //     rtnRail.trackDamageSurvey[key] = rtnRail.trackDamageSurvey[key].map(image => image.originalname)
  //   }
  // })
  rtnRail.generalSurvey.date = time
  rtnRail.railDamageSurvey.uploadImages = rtnRail.railDamageSurvey.uploadImages.map(image => image.filename || image.originalname)
  rtnRail.createdAt = moment().utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z'
  // rtnRail.createdBy = Cookies.get('isAuthenticated')
  return rtnRail
})

</script>
<template>
  <SurveyForm v-if="isFetch" :is-preview="modalActive" :id="modalActive ? 'parent' : ''" ref="surveyForm"
    v-model="railSurvey" :validate="v$" @on-submit="handleSubmit()"></SurveyForm>
  <Modal content v-model="modalActive">
    <template #content>
      <SurveyForm v-if="isFetch" is-preview v-model="railSurvey" ref="surveyForm" :validate="v$"></SurveyForm>
    </template>
    <template #footer>
      <button @click="modalActive = false" data-modal-hide="extralarge-modal" type="button"
        class="_button-error">แก้ไขแบบฟอร์ม</button>
      <button @click="isConfirm = true" data-modal-hide="extralarge-modal" type="button"
        class="_button">ส่งแบบฟอร์ม</button>
    </template>
  </Modal>
  <Modal create v-model="isConfirm" @confirm="submitForm()"></Modal>
</template>
<style>
#parent {
  /* width: 100%;
  height: 100%; */
  /* position: fixed; */
  overflow:hidden;
}
</style>