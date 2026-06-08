<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useForm, useField } from 'vee-validate';
import { registerSchema } from '@/validation/registerSchema';

const { handleSubmit } = useForm({ validationSchema: registerSchema })

const email = useField('email')
const rEmail = useField('rEmail')
const password = useField('password')
const rPassword = useField('rPassword')

const auth = useAuthStore()

const showPassword = ref(false)
const showRPassword = ref(false)

const submit = handleSubmit((values) => {
  auth.registerAuthUser(values)
})
</script>

<template>
  <v-container class="fill-height bg-white px-6">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="5" lg="4">

        <div class="text-center mb-6">
          <h2 class="brand-small mb-1">homy<span>.</span></h2>
          <h1 class="text-h5 font-weight-bold letter-tight">Crea tu cuenta</h1>
          <p class="text-body-2 text-grey-darken-1 mt-1">
            Estás a un paso de simplificar tu hogar.
          </p>
        </div>

        <v-fade-transition>
          <v-alert v-if="auth.hasError" @click="auth.toggleError()" variant="tonal" color="error"
            class="mb-6 rounded-lg text-caption" style="cursor: pointer">
            Este email ya está registrado. Intenta con otro.
          </v-alert>
        </v-fade-transition>

        <v-form @submit.prevent="submit">
          <v-row dense>
            <v-col cols="12">
              <v-text-field v-model="email.value.value" :error-messages="email.errorMessage.value" label="Email"
                type="email" variant="outlined" color="green-darken-2" density="comfortable" rounded="lg"
                class="custom-field" prepend-inner-icon="mdi-email-outline" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="rEmail.value.value" :error-messages="rEmail.errorMessage.value"
                label="Confirmar Email" type="email" variant="outlined" color="green-darken-2" density="comfortable"
                rounded="lg" class="custom-field" prepend-inner-icon="mdi-email-check-outline" />
            </v-col>
          </v-row>

          <v-row dense class="mt-2">
            <v-col cols="12">
              <v-text-field v-model="password.value.value" :error-messages="password.errorMessage.value"
                label="Contraseña" :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword" variant="outlined" color="green-darken-2"
                density="comfortable" rounded="lg" class="custom-field" prepend-inner-icon="mdi-lock-outline" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="rPassword.value.value" :error-messages="rPassword.errorMessage.value"
                label="Confirmar Contraseña" :type="showRPassword ? 'text' : 'password'"
                :append-inner-icon="showRPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showRPassword = !showRPassword" variant="outlined" color="green-darken-2"
                density="comfortable" rounded="lg" class="custom-field" prepend-inner-icon="mdi-lock-check-outline" />
            </v-col>
          </v-row>

          <v-btn @click="submit" block size="x-large" color="black" elevation="0"
            class="rounded-pill py-7 mt-6 action-btn text-none">
            Unirse a Homy
          </v-btn>

          <v-btn variant="text" block class="mt-4 text-none text-grey-darken-2" :to="{ name: 'login' }">
            ¿Ya tienes cuenta? <span class="font-weight-bold ml-1 text-green-darken-2">Inicia sesión</span>
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
  color: #388E3C;
}

.letter-tight {
  letter-spacing: -0.5px !important;
}

:deep(.custom-field .v-field__outline) {
  --v-field-border-opacity: 0.15;
}

:deep(.v-text-field .v-input__details) {
  padding-inline-start: 12px;
  min-height: 22px;
}

.action-btn {
  transition: all 0.2s ease;
  font-size: 1rem !important;
  font-weight: 600;
}

.action-btn:hover {
  background-color: #333 !important;
}

.action-btn:active {
  transform: scale(0.98);
}
</style>
