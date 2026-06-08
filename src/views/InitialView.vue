<script setup>
</script>

<template>
  <v-container fluid class="fill-height bg-white px-6">
    <v-row justify="center" align="center">
      <v-col cols="12" class="text-center">

        <div class="logo-container mb-12">
          <v-icon icon="mdi-home-floor-g" size="100" color="green-darken-2" class="logo-icon mb-n4"></v-icon>
          <h1 class="brand-title">homy<span>.</span></h1>
          <div class="brand-underline mx-auto"></div>
        </div>

        <p class="text-h6 font-weight-light text-grey-darken-1 mb-12 subtitle">
          Tu hogar, simplificado.
        </p>

        <div class="actions-wrapper">
          <v-btn :to="{ name: 'login' }" color="black" size="x-large" variant="flat" block
            class="mb-4 py-7 rounded-pill action-btn">
            Empezar ahora
          </v-btn>

          <v-btn :to="{ name: 'register' }" color="grey-darken-3" variant="text" size="large" block
            class="text-none rounded-pill">
            ¿No tienes cuenta? <span class="font-weight-bold ml-1">Regístrate</span>
          </v-btn>
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

.brand-title {
  font-size: 5rem;
  font-weight: 900;
  letter-spacing: -3px;
  color: #1a1a1a;
  line-height: 1;
  margin-bottom: 0;
}

.brand-title span {
  color: #388E3C;
}


.brand-underline {
  width: 40px;
  height: 6px;
  background-color: #388E3C;
  border-radius: 10px;
  margin-top: 10px;
}

.subtitle {
  letter-spacing: 2px !important;
  text-transform: uppercase;
  font-size: 0.85rem !important;
}

.action-btn {
  transition: transform 0.3s ease;
  font-size: 1.1rem !important;
  letter-spacing: 0.5px;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.actions-wrapper {
  max-width: 320px;
  margin: 0 auto;
}


.logo-container {
  animation: fadeInDown 0.8s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
