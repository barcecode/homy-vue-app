<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <v-main class="bg-white">
      <RouterView />
    </v-main>

    <v-bottom-navigation grow elevation="0" class="custom-nav border-t" color="muted-green">
      <v-btn :to="{ name: 'home' }" class="nav-btn">
        <v-icon size="24">mdi-home-variant-outline</v-icon>
        <span class="nav-label">Inicio</span>
      </v-btn>

      <v-btn :to="{ name: 'shopping' }" class="nav-btn">
        <v-icon size="24">mdi-cart-outline</v-icon>
        <span class="nav-label">Compra</span>
      </v-btn>

      <v-btn :to="{ name: 'menu' }" class="nav-btn">
        <v-icon size="24">mdi-silverware-variant</v-icon>
        <span class="nav-label">Menú</span>
      </v-btn>

      <v-btn :to="{ name: 'tasks' }" class="nav-btn">
        <v-icon size="24">mdi-clipboard-check-outline</v-icon>
        <span class="nav-label">Tareas</span>
      </v-btn>

      <v-btn :to="{ name: 'announce' }" class="nav-btn">
        <v-icon size="24">mdi-pin-outline</v-icon>
        <span class="nav-label">Notas</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<style scoped>

.custom-nav {
  height: 70px !important;
  padding-bottom: env(safe-area-inset-bottom);
  background-color: white !important;
}

.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.nav-btn {
  background-color: transparent !important;
  transition: all 0.3s ease;
  min-width: 60px !important;
}

.nav-label {
  font-size: 0.7rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px;
  text-transform: none !important;
  margin-top: 4px;
}

:deep(.v-btn--active) {
  color: #557A55 !important;
}

:deep(.v-btn--active .v-icon) {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

.v-btn:not(.v-btn--active) {
  color: #9E9E9E !important;
}

:deep(.v-btn__overlay) {
  display: none;
}
</style>
