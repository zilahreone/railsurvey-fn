<script setup>
import validate from '@/validate'
import form from '@/template_form.json'
import { computed, onMounted, reactive, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import moment from 'moment'
import SurveyForm from '@/components/SurveyForm'
import Modal from '@/components/Modal.vue'
import Cookies from 'js-cookie'
import api from '@/services'
import { useRouter } from 'vue-router'

const router = useRouter()
const isFetch = ref(false)
const clone = JSON.parse(JSON.stringify(form))
const isConfirm = ref(false)
const modalActive = ref(false)
const railSurvey = reactive(clone)
const v$ = useVuelidate(validate(form, railSurvey), railSurvey, { $autoDirty: true })

onMounted(() => {
  // v$.value.$reset()
  // isFetch.value = true
  railSurvey.generalSurvey.date = moment(new Date()).format('YYYY-MM-DDTHH:mm')
  railSurvey.createdBy = Cookies.get('isAuthenticated')
  navigator.geolocation.getCurrentPosition((position) => {
    const p = position.coords;
    railSurvey.generalSurvey.coordinates.latitude = p.latitude
    railSurvey.generalSurvey.coordinates.longitude = p.longitude
  }, (err) => {
    console.error(err);
  }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 })
  // console.log(moment(new Date()).format('YYYY-MM-DDTHH:mm'));
  // console.log(new Date('2018-06-14T20:00'));
  // console.log(new Date('2018-06-14T20:00').toISOString());
})
const handleSubmit = async () => {
  const isValid = await v$.value.$validate()
  if (isValid) {
    railSurvey.generalSurvey.date = moment(new Date()).format('YYYY-MM-DDTHH:mm')
    modalActive.value = true
  }
}
const submitForm = () => {
  let formData = new FormData()
  const uploadImages = [...railSurvey.railDamageSurvey.uploadImages, ...railSurvey.trackDamageSurvey.uploadImages]
  uploadImages.forEach(images => {
    // console.log(images.file);
    // const file_ = new File([images.file], images.filename, { type: images.type })
    // list.items.add(file_)
    formData.append('file', images.file)
  })
  formData.append('form', JSON.stringify(compSubmitForm.value))
  // api.uploadFils('/api/uploads', formData, null).then((resp) => {
  api.uploadFiles('/api/rail-survey', formData, null).then((resp) => {
    // console.log('201');
    resp.json().then((json) => {
      console.log(json)
    })
  }).catch((err) => {
    // navigator.serviceWorker.ready.then(registration => {
    //   console.log('registration')
    //   registration.sync.register('some-unique-tag')
    // }).catch(console.log())
  })
  router.push('/survey-list')
}
const compSubmitForm = computed(() => {
  let rtnRail = JSON.parse(JSON.stringify(railSurvey))
  rtnRail.generalSurvey.date = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
  Object.keys(rtnRail.trackDamageSurvey).forEach(key => {
    if (['trackGeometryCondition', 'ballastCondition', 'sleeperCondition'].includes(key)) {
      if (key === 'sleeperCondition') {
        if (rtnRail.trackDamageSurvey[key].isPerfect === 'dilapidated') {
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
  rtnRail.createdBy = Cookies.get('isAuthenticated')
  return rtnRail
})
</script>
<template>
  <SurveyForm :is-preview="modalActive" :id="modalActive ? 'parent' : ''" ref="surveyForm" v-model="railSurvey"
    :validate="v$" @on-submit="handleSubmit()"></SurveyForm>
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