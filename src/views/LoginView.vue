<script setup>
import { ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import { loginSchema } from '@/validation/loginSchema';
import { useAuthStore } from '@/stores/auth';

const { handleSubmit } = useForm({ validationSchema: loginSchema })

const email = useField('email')
const password = useField('password')
const auth = useAuthStore()

const showPassword = ref(false)

const submit = handleSubmit((values) => {
  auth.loginUser(values)
})
</script>

<template>
  <v-container class="fill-height bg-white">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4" lg="3">

        <div class="text-center mb-8">
          <h2 class="brand-small mb-2">homy<span>.</span></h2>
          <h1 class="text-h5 font-weight-bold letter-tight">Inicia sesión</h1>
          <p class="text-body-2 text-grey-darken-1 mt-1">
            ¡Bienvenid@ de nuevo!
          </p>
        </div>

        <v-fade-transition>
          <v-alert v-if="auth.hasError" variant="tonal" color="error" class="mb-6 rounded-lg text-caption"
            border="start">
            Credenciales incorrectas, por favor revisa tus datos.
          </v-alert>
        </v-fade-transition>

        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
            label="Email"
            type="email"
            variant="outlined"
            prepend-inner-icon="mdi-email-outline"
            color="green-darken-2"
            class="mb-2 custom-field"
            rounded="lg"
          ></v-text-field>

          <v-text-field
            v-model="password.value.value"
            :error-messages="password.errorMessage.value"
            label="Contraseña"
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
            variant="outlined"
            prepend-inner-icon="mdi-lock-outline"
            color="green-darken-2"
            class="mb-4 custom-field"
            rounded="lg"
          ></v-text-field>

          <v-btn @click="submit" block size="x-large" color="black" elevation="0"
            class="rounded-pill py-7 mt-2 action-btn text-none">
            Entrar
          </v-btn>

          <v-btn variant="text" block class="mt-6 text-none text-grey-darken-2" :to="{ name: 'register' }">
            ¿Aún no tienes cuenta? <span class="font-weight-bold ml-1 text-green-darken-2">Regístrate</span>
          </v-btn>
        </v-form>

      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.brand-small {
  font-size: 2rem;
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

:deep(.custom-field .v-label) {
  font-size: 0.9rem;
  font-weight: 500;
}

.action-btn {
  transition: transform 0.2s ease, opacity 0.2s ease;
  font-size: 1rem !important;
  font-weight: 600;
}

.action-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}
</style>
