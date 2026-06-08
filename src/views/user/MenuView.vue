<script setup>
import { ref, watch, computed } from 'vue'
import { doc, setDoc } from 'firebase/firestore'
import { useFirestore, useDocument } from 'vuefire'
import { useUserStore } from '@/stores/user'

const db = useFirestore()
const user = useUserStore()

const menuDocRef = computed(() => {
  const houseId = user.currentUserInfo?.house_id
  return houseId ? doc(db, 'menu', houseId) : null
})

const remoteMenu = useDocument(menuDocRef)

const days = [
  { index: 0, name: 'Lunes', key: 'monday', icon: 'mdi-calendar' },
  { index: 1, name: 'Martes', key: 'tuesday', icon: 'mdi-calendar' },
  { index: 2, name: 'Miércoles', key: 'wednesday', icon: 'mdi-calendar' },
  { index: 3, name: 'Jueves', key: 'thursday', icon: 'mdi-calendar' },
  { index: 4, name: 'Viernes', key: 'friday', icon: 'mdi-calendar' },
  { index: 5, name: 'Sábado', key: 'saturday', icon: 'mdi-calendar-star-outline' },
  { index: 6, name: 'Domingo', key: 'sunday', icon: 'mdi-calendar-star-outline' }
]

const tempMenu = ref({
  monday: { lunch: '', dinner: '' },
  tuesday: { lunch: '', dinner: '' },
  wednesday: { lunch: '', dinner: '' },
  thursday: { lunch: '', dinner: '' },
  friday: { lunch: '', dinner: '' },
  saturday: { lunch: '', dinner: '' },
  sunday: { lunch: '', dinner: '' }
})

watch(remoteMenu, (newVal) => {
  if (newVal && newVal.days) {
    tempMenu.value = JSON.parse(JSON.stringify(newVal.days))
  }
}, { immediate: true })

const autoSave = async () => {
  const houseId = user.currentUserInfo?.house_id
  if (!houseId || !menuDocRef.value) return

  try {
    await setDoc(menuDocRef.value, {
      house_id: houseId,
      updated_at: new Date(),
      days: tempMenu.value
    }, { merge: true })
  } catch (error) {
    console.error("Error en auto-guardado:", error)
  }
}

// Helper para saber si es hoy
const isToday = (dayKey) => {
  const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return daysMap[new Date().getDay()] === dayKey
}
</script>

<template>
  <v-container class="bg-white px-6 pt-10 pb-16">
    <v-overlay :model-value="!user.currentUserInfo" class="align-center justify-center" persistent>
      <v-progress-circular indeterminate color="muted-green" size="64"></v-progress-circular>
    </v-overlay>

    <v-row class="mb-8" v-if="user.currentUserInfo">
      <v-col cols="12">
        <h2 class="brand-small mb-n2">homy<span>.</span></h2>
        <h1 class="text-h4 font-weight-black letter-tight mt-4">Planificación Semanal</h1>
        <div class="d-flex align-center mt-2">
          <p class="text-body-2 text-grey-darken-1">Planifica tu menú semanal</p>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="user.currentUserInfo">
      <v-col v-for="day in days" :key="day.index" cols="12" sm="6" md="4" lg="3">
        <v-card variant="outlined"
          :class="['rounded-xl pa-2 h-100 transition-card', isToday(day.key) ? 'border-today shadow-today' : 'border-muted']">
          <v-card-item>
            <template v-slot:prepend>
              <div :class="['day-icon-box', isToday(day.key) ? 'bg-today' : 'bg-light']">
                <v-icon :icon="day.icon" size="small" :color="isToday(day.key) ? 'white' : 'muted-green'"></v-icon>
              </div>
            </template>
            <v-card-title class="text-pre-wrap text-subtitle-1 font-weight-bold">
              {{ day.name }}
              <v-chip v-if="isToday(day.key)" size="x-small" color="muted-green"
                class="ml-2 text-uppercase font-weight-black">Hoy</v-chip>
            </v-card-title>
          </v-card-item>

          <v-card-text class="pt-2">
            <div class="meal-input-group mb-4">
              <span class="text-overline font-weight-black text-grey-darken-1">Almuerzo</span>
              <v-text-field v-model="tempMenu[day.key].lunch" placeholder="¿Qué comeremos?" variant="flat"
                density="compact" bg-color="grey-lighten-5" rounded="lg" hide-details class="mt-1 custom-input"
                @blur="autoSave">
                <template v-slot:prepend-inner>
                  <v-icon icon="mdi-food-apple-outline" size="small" color="grey-lighten-1"></v-icon>
                </template>
              </v-text-field>
            </div>

            <div class="meal-input-group">
              <span class="text-overline font-weight-black text-grey-darken-1">Cena</span>
              <v-text-field v-model="tempMenu[day.key].dinner" placeholder="¿Qué cenaremos?" variant="flat"
                density="compact" bg-color="grey-lighten-5" rounded="lg" hide-details class="mt-1 custom-input"
                @blur="autoSave">
                <template v-slot:prepend-inner>
                  <v-icon icon="mdi-weather-night" size="small" color="grey-lighten-1"></v-icon>
                </template>
              </v-text-field>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.brand-small {
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -1.5px;
  color: #1a1a1a;
}

.brand-small span {
  color: #557A55;
}

.letter-tight {
  letter-spacing: -1px !important;
}

/* Iconos de cabecera de tarjeta */
.day-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.bg-light {
  background-color: #f5f5f5;
}

.bg-today {
  background-color: #557A55;
}

.border-muted {
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}

.border-today {
  border: 2px solid #557A55 !important;
}

.shadow-today {
  box-shadow: 0 10px 20px -10px rgba(85, 122, 85, 0.3) !important;
}

.custom-input :deep(.v-field__input) {
  font-size: 0.9rem;
  font-weight: 500;
  padding-top: 8px;
  padding-bottom: 8px;
}

.custom-input :deep(.v-field) {
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.custom-input :deep(.v-field--focused) {
  background-color: white !important;
  border-color: #557A55 !important;
}

.text-muted-green {
  color: #557A55 !important;
}

.transition-card {
  transition: all 0.3s ease;
}

.transition-card:hover {
  transform: translateY(-4px);
}
</style>
