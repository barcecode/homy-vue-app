<script setup>
import { useUserStore } from '@/stores/user';
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue'

const user = useUserStore()
const { handleSubmit, setFieldValue } = useForm()

const isSubmitDisabled = ref(true)
const inviteCodeValue = ref('')

const userName = useField('userName')
const houseName = useField('houseName')

const submit = () => {
  setFieldValue('inviteCode', inviteCodeValue.value)
  handleSubmit((values) => {
    if (user.isNewHouse) {
      user.createUserNewHouse(values)
    }
    else {
      user.createUserExistingHouse(values)
    }
  })()
}
</script>

<template>
  <v-container class="fill-height bg-white px-6">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="5" lg="4">

        <div class="text-center mb-10">
          <h2 class="brand-small mb-1">homy<span>.</span></h2>
          <h1 class="text-h5 font-weight-bold letter-tight">Configura tu perfil</h1>
        </div>

        <v-form @submit.prevent="submit">

          <div class="step-wrapper mb-8">
            <div class="step-header mb-4">
              <span class="step-badge">1</span>
              <span class="step-title">¿Cómo te llamas?</span>
            </div>
            <div class="step-content">
              <v-text-field v-model="userName.value.value" placeholder="Tu nombre" variant="outlined"
                color="muted-green" rounded="lg" class="custom-field" hide-details />
            </div>
          </div>

          <div class="step-wrapper">
            <div class="step-header mb-4">
              <span class="step-badge">2</span>
              <span class="step-title">Tu hogar</span>
            </div>

            <div class="step-content">
              <v-card variant="flat" class="rounded-xl pa-5 bg-grey-lighten-5 border-muted">

                <div v-if="!user.isNewHouse">
                  <p class="text-caption text-grey-darken-1 mb-3 font-weight-bold text-uppercase">Código de invitación
                  </p>
                  <v-otp-input v-model="inviteCodeValue" :length="6" type="text" class="custom-otp"
                    variant="solo-filled" @click="user.errorMsg = ''"
                    @update:model-value="inviteCodeValue = inviteCodeValue.toUpperCase(); inviteCodeValue.length === 6 ? isSubmitDisabled = false : isSubmitDisabled = true" />

                  <v-btn variant="text" color="muted-green" class="text-none mt-4 px-0 font-weight-bold" size="small"
                    @click="user.toggleMode(true); inviteCodeValue = ''; isSubmitDisabled = true; user.errorMsg = ''">
                    ¿Prefieres crear una nueva casa?
                  </v-btn>
                </div>

                <div v-if="user.isNewHouse">
                  <p class="text-caption text-grey-darken-1 mb-3 font-weight-bold text-uppercase">Nombre de tu casa</p>
                  <v-text-field v-model="houseName.value.value" placeholder="Ej: Nuestra Casita" variant="underlined"
                    color="muted-green" hide-details
                    @update:model-value="houseName.value.value.trim() === '' ? isSubmitDisabled = true : isSubmitDisabled = false" />

                  <v-btn variant="text" color="muted-green" class="text-none mt-4 px-0 font-weight-bold" size="small"
                    @click="user.toggleMode(false); houseName.value.value = ''; isSubmitDisabled = true">
                    ¿Tienes un código de invitación?
                  </v-btn>
                </div>
              </v-card>
            </div>
          </div>

          <v-expand-transition>
            <v-alert v-if="user.errorMsg" color="error" variant="tonal" class="mt-4 rounded-lg text-caption"
              border="start">
              {{ user.errorMsg }}
            </v-alert>
          </v-expand-transition>

          <v-btn @click="submit" :disabled="isSubmitDisabled || !userName.value.value" block size="x-large"
            color="black" class="rounded-pill py-7 mt-8 action-btn text-none">
            Finalizar registro
          </v-btn>
        </v-form>

      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

.brand-small {
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: -1.5px;
  color: #1a1a1a;
}

.brand-small span {
  color: #557A55;
}

:deep(.text-muted-green),
:deep(.v-field--focused.text-muted-green) {
  color: #557A55 !important;
}

.step-wrapper {
  display: flex;
  flex-direction: column;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.step-badge {
  width: 28px;
  height: 28px;
  background: #1a1a1a;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.75rem;
}

.step-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
}

.step-content {
  padding-left: 0;
}


:deep(.custom-otp .v-otp-input__content) {
  gap: 10px;
  padding: 0;
}

:deep(.custom-otp .v-field) {
  border-radius: 12px !important;
  background-color: rgb(201, 240, 209);
}

:deep(.custom-otp .v-field__outline) {
  --v-field-border-opacity: 0.15;
}

:deep(.v-field--focused .v-field__outline) {
  color: #557A55 !important;
}

.border-muted {
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.custom-field :deep(.v-field__outline) {
  --v-field-border-opacity: 0.1;
}

.action-btn {
  font-size: 1rem !important;
  font-weight: 600;
}

.letter-tight {
  letter-spacing: -0.5px !important;
}
</style>
