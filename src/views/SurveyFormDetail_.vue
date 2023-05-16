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
import validate from '@/validate'
import form from '@/template_form.json'
import variable from '@/variable.json'

const store = useStore()
const router = useRouter()
const route = useRoute()

const isFetch = ref(false)
const clone = JSON.parse(JSON.stringify(form))
const isConfirm = ref(false)
const modalActive = ref(false)
const railSurvey = reactive(clone)
const v$ = useVuelidate(validate(form, railSurvey), railSurvey, { $autoDirty: true })

onMounted(() => {
  getSurveyID(route.params.id)
})
const getSurveyID = (id) => {
  api.get(`/api/rail-survey/${id}`, store.state.token).then((resp) => {
    if (resp.status === 200) {
      resp.json().then((json) => {
        // console.log(json);
        let rs = JSON.parse(JSON.stringify(json))
        let railUploadImages = []
        let trackUploadImages = []
        Object.keys(rs.trackDamageSurvey).forEach((td) => {
          if (['ballastCondition', 'sleeperCondition', 'trackGeometryCondition'].includes(td)) {
            if (rs.trackDamageSurvey[td].length > 0) {
              if (td === 'sleeperCondition') {
                const sleeperCondition = variable.sleeperCondition.map(sc => sc.value)
                if (rs.trackDamageSurvey[td].filter(sc => sleeperCondition.includes(sc)).length > 0) {
                  rs.trackDamageSurvey[td] = { isPerfect: 'dilapidated', condition: rs.trackDamageSurvey[td] }
                } else {
                  const sleeper = variable.sleeper.map(sc => sc.value)
                  if (sleeper.includes(rs.trackDamageSurvey[td][0])) {
                    rs.trackDamageSurvey[td] = { isPerfect: rs.trackDamageSurvey[td][0] , condition: []  }
                  } else {
                    rs.trackDamageSurvey[td] = { isPerfect: null, condition: [] }
                  }
                }
              } else {
                rs.trackDamageSurvey[td] = {
                  isPerfect: 'imperfect',
                  condition: rs.trackDamageSurvey[td]
                }
              }
            } else {
              rs.trackDamageSurvey[td] = {
                isPerfect: null,
                condition: []
              }
            }
          } else if (td === 'uploadImages') {
            rs.trackDamageSurvey[td].forEach((image, index) => {
              trackUploadImages.push({
                originalname: image,
                originalPath: `${process.env.VUE_APP_BACK_END_URL}/${process.env.VUE_APP_IMAGE_DIR}/${image}`
              })
            })
          }
        })
        rs.trackDamageSurvey.uploadImages = trackUploadImages
        rs.railDamageSurvey.uploadImages.forEach((image, index) => {
          railUploadImages.push({
            originalname: image,
            originalPath: `${process.env.VUE_APP_BACK_END_URL}/${process.env.VUE_APP_IMAGE_DIR}/${image}`
          })
        })
        rs.railDamageSurvey.uploadImages = railUploadImages
        rs.generalSurvey.date = moment(rs.generalSurvey.date).format('YYYY-MM-DDTHH:mm')
        Object.assign(railSurvey, rs)
        isFetch.value = true
      })
    }
  })
}
const handleSubmit = async () => {
  const isValid = await v$.value.$validate()
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
      rtnRail.trackDamageSurvey[key] = rtnRail.trackDamageSurvey[key].map(image => image.originalname)
    }
  })
  rtnRail.railDamageSurvey.uploadImages = rtnRail.railDamageSurvey.uploadImages.map(image => image.originalname)
  rtnRail.createdBy = Cookies.get('isAuthenticated')
  delete rtnRail.createdAt
  return rtnRail
})

</script>
<template>
  <SurveyForm v-if="isFetch" :is-preview="modalActive" :id="modalActive ? 'parent' : ''" ref="surveyForm" v-model="railSurvey"
    :validate="v$" @on-submit="handleSubmit()"></SurveyForm>
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