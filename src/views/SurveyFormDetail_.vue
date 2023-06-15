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
import form from '@/template_form.json'
// import variable from '@/variable.json'
import { useToast } from 'vue-toastification'

const toast = useToast()
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
  api.get(`/api/rail-survey/${id}`, store.state.token).then((resp) => {
    if (resp.status === 200) {
      resp.json().then((json) => {
        Object.assign(railSurvey, json)
        railSurvey.generalSurvey.date = moment(json.generalSurvey.date).format('YYYY-MM-DDTHH:mm')
        Object.keys(railSurvey.trackDamageSurvey).forEach(key => {
          if (['ballastCondition', 'sleeperCondition', 'trackGeometryCondition'].includes(key)) {
            if (key === 'sleeperCondition') {
              if (railSurvey.trackDamageSurvey[key].length === 1 && ['good', 'moderately'].includes(railSurvey.trackDamageSurvey[key][0])) {
                railSurvey.trackDamageSurvey[key] = {
                  isPerfect: railSurvey.trackDamageSurvey[key][0],
                  condition: []
                }
              } else {
                railSurvey.trackDamageSurvey[key] = {
                  isPerfect: 'defective',
                  condition: railSurvey.trackDamageSurvey[key]
                }
              }
            } else {
              if (railSurvey.trackDamageSurvey[key].length === 1 && railSurvey.trackDamageSurvey[key][0] === 'perfect') {
                railSurvey.trackDamageSurvey[key] = {
                  isPerfect: 'perfect',
                  condition: []
                }
              } else {
                railSurvey.trackDamageSurvey[key] = {
                  isPerfect: 'imperfect',
                  condition: railSurvey.trackDamageSurvey[key]
                }
              }
            }
          } else if (key === 'uploadImages') {
            let images = []
            railSurvey.trackDamageSurvey[key].forEach((image, index) => {
              images.push({
                originalname: image,
                originalPath: `${process.env.VUE_APP_BACK_END_URL}/${process.env.VUE_APP_IMAGE_DIR}/${image}`
              })
            })
            railSurvey.trackDamageSurvey[key] = images
          }
        })
        Object.keys(railSurvey.railDamageSurvey).forEach(key => {
          if (key === 'uploadImages') {
            let images = []
            railSurvey.railDamageSurvey[key].forEach((image, index) => {
              images.push({
                originalname: image,
                originalPath: `${process.env.VUE_APP_BACK_END_URL}/${process.env.VUE_APP_IMAGE_DIR}/${image}`
              })
            })
            railSurvey.railDamageSurvey[key] = images
          }
        })
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
    console.log(resp.status);
    if (resp.status === 200) {
      console.log('update success ;)')
      toast.success('ส่งแบบฟอร์มสำเร็จ')
      router.push('/survey-list')
    }
  }).catch(() => {
    if(navigator.onLine){
      toast.error('เกิดความผิดพลาดในการส่งแบบฟอร์ม')
    } else {
      toast('ส่งแบบฟอร์มออฟไลน์สำเร็จ')
    }
    router.push('/survey-list')
    // navigator.serviceWorker.ready.then(registration => {
    //   console.log('registration')
    //   registration.sync.register('some-unique-tag')
    // }).catch(console.log())
  })
}
const compSubmitForm = computed(() => {
  let rtnRail = JSON.parse(JSON.stringify(railSurvey))
  const date = moment(rtnRail.generalSurvey.date).utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z'
  rtnRail.generalSurvey.date = date
  Object.keys(rtnRail.trackDamageSurvey).forEach(key => {
    if (['trackGeometryCondition', 'ballastCondition', 'sleeperCondition'].includes(key)) {
      if (key === 'sleeperCondition') {
        if (rtnRail.trackDamageSurvey[key].isPerfect === 'defective') {
          rtnRail.trackDamageSurvey[key] = rtnRail.trackDamageSurvey[key].condition
        } else {
          rtnRail.trackDamageSurvey[key] = [rtnRail.trackDamageSurvey[key].isPerfect]
        }
      } else {
        if (rtnRail.trackDamageSurvey[key].isPerfect === 'perfect') {
          rtnRail.trackDamageSurvey[key] = ['perfect']
        } else {
          rtnRail.trackDamageSurvey[key] = rtnRail.trackDamageSurvey[key].condition
        }
      }
    } else if (['uploadImages'].includes(key)) {
      rtnRail.trackDamageSurvey[key] = rtnRail.trackDamageSurvey[key].map(image => image.filename)
    }
  })
  rtnRail.railDamageSurvey.uploadImages = rtnRail.railDamageSurvey.uploadImages.map(image => image.filename)
  rtnRail.createdBy = rtnRail.createdBy.id
  rtnRail.modifiedBy = '64eea302-a74b-498a-8bd6-5e040e90166b'
  delete rtnRail.modifiedAt
  // rtnRail.createdAt = moment().utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z'
  return rtnRail
})

</script>
<template>
  <SurveyForm v-if="!modalActive && isFetch" :is-preview="modalActive" :id="modalActive ? 'parent' : ''" ref="surveyForm"
    v-model="railSurvey" :validate="v$" @on-submit="handleSubmit()"></SurveyForm>
  <Modal content v-model="modalActive">
    <template #content>
      <SurveyForm is-preview v-model="railSurvey" ref="surveyForm" :validate="v$"></SurveyForm>
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