<script setup>
import { ref, computed } from 'vue'
import { collection, query, where, orderBy } from 'firebase/firestore'
import { useFirestore, useCollection } from 'vuefire'
import { useUserStore } from '@/stores/user'
import { useShoppingStore } from '@/stores/shopping'
import { useAuthStore } from '@/stores/auth'
import { useHouseStore } from '@/stores/house'

const db = useFirestore()
const userStore = useUserStore()
const shoppingStore = useShoppingStore()
const auth = useAuthStore()
const house = useHouseStore()

const houseInfoDialog = ref(false)

const houseId = computed(() => userStore.currentUserInfo?.house_id)

const tasksRef = collection(db, 'tasks')
const qTasks = computed(() => {
  return houseId.value ? query(tasksRef, where('house_id', '==', houseId.value), where('status', '==', 'pending')) : null
})
const pendingTasks = useCollection(qTasks)

const announcementsRef = collection(db, 'announcement')
const qAnnouncements = computed(() => {
  return houseId.value ? query(announcementsRef, where('house_id', '==', houseId.value), orderBy('created_at', 'desc')) : null
})
const latestAnnouncement = useCollection(qAnnouncements)

const menuRef = collection(db, 'menu')
const qMenu = computed(() => {
  return houseId.value ? query(menuRef, where('house_id', '==', houseId.value)) : null
})
const fullMenu = useCollection(qMenu)

const todayMenu = computed(() => {
  if (!fullMenu.value.length) return null
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const todayKey = days[new Date().getDay()]
  return fullMenu.value[0]?.days?.[todayKey] || null
})

const recentLists = computed(() => {
  return shoppingStore.shoppingLists
})

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 14) return 'Buenos días'
  if (hour < 21) return 'Buenas tardes'
  return 'Buenas noches'
}
</script>

<template>
  <v-container class="bg-white px-6 pt-5">
    <v-row class="mb-8">
      <v-col>
        <h2 class="brand-small mb-n2">homy<span>.</span></h2>
        <h1 class="text-h4 font-weight-black letter-tight mt-4">
          {{ getGreeting() }}, {{ userStore.currentUserInfo?.name }}
        </h1>
        <v-btn prepend-icon="mdi-home-heart" variant="tonal" color="muted-green"
          class="rounded-lg text-none font-weight-bold" @click="houseInfoDialog = true">
          Info casa
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card variant="outlined" class="rounded-xl pa-5 border-muted h-100 flex-column d-flex">
          <div class="d-flex align-center mb-6">
            <div class="icon-box mr-3">
              <v-icon icon="mdi-silverware-variant" color="muted-green"></v-icon>
            </div>
            <h3 class="text-h6 font-weight-bold">Menú de Hoy</h3>
          </div>

          <div v-if="todayMenu" class="flex-grow-1">
            <v-row dense>
              <v-col cols="6">
                <span class="text-overline text-grey font-weight-bold">Almuerzo</span>
                <p class="text-body-1 font-weight-medium">{{ todayMenu.lunch || '—' }}</p>
              </v-col>
              <v-col cols="6">
                <span class="text-overline text-grey font-weight-bold">Cena</span>
                <p class="text-body-1 font-weight-medium">{{ todayMenu.dinner || '—' }}</p>
              </v-col>
            </v-row>
          </div>
          <p v-else class="text-body-2 text-grey-lighten-1 mb-4 italic">No hay menú planificado</p>

          <v-btn :to="{ name: 'menu' }" variant="tonal" color="muted-green" class="mt-auto rounded-lg text-none" block
            elevation="0">
            Ver calendario
          </v-btn>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="flat" class="rounded-xl pa-5 bg-grey-lighten-5 h-100 d-flex flex-column">
          <div class="d-flex justify-space-between align-center mb-6">
            <h3 class="text-h6 font-weight-bold">Listas de Compra</h3>
            <v-chip size="small" color="black" class="font-weight-bold">{{ shoppingStore.shoppingLists.length
            }}</v-chip>
          </div>

          <div class="scroll-area">
            <v-list v-if="recentLists.length > 0" class="bg-transparent pa-0">
              <v-list-item v-for="list in recentLists" :key="list.id"
                class="bg-white rounded-xl mb-3 border-muted pa-3">
                <template v-slot:prepend>
                  <v-avatar :color="list.color" size="12" class="mr-3"></v-avatar>
                </template>
                <v-list-item-title class="font-weight-bold">{{ list.name }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ list.description }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <p v-else class="text-center text-grey-lighten-1 py-4 text-body-2">Listas vacías</p>
          </div>

          <v-btn to="/shopping" variant="text" color="black" class="text-none font-weight-bold px-0 mt-auto"
            size="small">
            Gestionar todas las listas →
          </v-btn>
        </v-card>
      </v-col>

      <v-col cols="12" md="7">
        <v-card variant="outlined" class="rounded-xl pa-5 border-muted d-flex flex-column h-100">
          <div class="d-flex align-center mb-6">
            <h3 class="text-h6 font-weight-bold">Tareas pendientes</h3>
          </div>

          <div class="scroll-area">
            <v-list v-if="pendingTasks.length > 0" class="pa-0">
              <v-list-item v-for="task in pendingTasks" :key="task.id" class="px-0 mb-2">
                <template v-slot:prepend>
                  <div class="task-dot mr-4"></div>
                </template>
                <v-list-item-title class="font-weight-medium">{{ task.title }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">Para: {{ task.assigned_name }}</v-list-item-subtitle>
                <template v-slot:append>
                  <v-icon icon="mdi-chevron-right" size="small" color="grey-lighten-1"></v-icon>
                </template>
              </v-list-item>
            </v-list>
            <p v-else class="text-center text-grey-lighten-1 py-4 text-body-2">No hay tareas pendientes</p>
          </div>

          <v-btn :to="{ name: 'tasks' }" variant="text" block
            class="mt-auto text-none text-muted-green font-weight-bold">
            Ver todas las tareas
          </v-btn>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card v-if="latestAnnouncement.length > 0" variant="flat"
          class="rounded-xl h-100 pa-6 bg-sage-light d-flex flex-column">
          <div class="d-flex align-center mb-4">
            <v-icon icon="mdi-pin-outline" color="muted-green" size="small" class="mr-2"></v-icon>
            <span class="text-caption font-weight-black letter-tight text-muted-green">ÚLTIMO AVISO</span>
          </div>
          <p class="text-h6 font-weight-medium mb-6 line-height-sm text-grey-darken-3">
            "{{ latestAnnouncement[0].text }}"
          </p>
          <div class="mt-auto d-flex align-center justify-space-between">
            <span class="text-caption font-weight-bold">— {{ latestAnnouncement[0].user_name }}</span>
            <v-btn icon="mdi-arrow-right" size="x-small" variant="tonal" color="muted-green"
              :to="{ name: 'announce' }"></v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-btn @click="auth.logOut" class="logout-button my-5" block icon="mdi-logout"></v-btn>

    <v-dialog v-model="houseInfoDialog" max-width="400">
      <v-card class="rounded-xl pa-4">
        <v-card-title class="text-h5 font-weight-black d-flex align-center">
          <v-icon icon="mdi-home-variant" class="mr-2" color="muted-green"></v-icon>
          Tu Hogar
        </v-card-title>

        <v-card-text class="pt-4">
          <div class="mb-6">
            <span class="text-overline text-grey font-weight-bold">Nombre de la casa</span>
            <p class="text-headline-medium text-grey-darken-3">{{ house.currentHouseInfo.name ||
              'Cargando...' }}
            </p>
          </div>

          <div class="mb-2">
            <span class="text-overline text-grey font-weight-bold">Código de invitación</span>
            <div class="d-flex align-center bg-grey-lighten-4 pa-4 rounded-xl mt-1 border-dashed">
              <span class="text-headline-large flex-grow-1 text-center">
                {{ house.currentHouseInfo.invite_code || '------' }}
              </span>
            </div>
            <p class="text-caption text-grey mt-2 text-center">
              Comparte este código para que otros se unan a tu casa.
            </p>
          </div>
        </v-card-text>

        <v-card-actions class="pt-0">
          <v-btn block color="black" variant="flat" class="rounded-lg text-none" @click="houseInfoDialog = false">
            Entendido
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <p style="color: #757575" class="text-center text-gray">Creada por Jorge Bárcena Ferruz</p>
  </v-container>

</template>

<style scoped>
.scroll-area {
  height: 250px;
  overflow-y: auto;
  padding-right: 4px;
}

.scroll-area::-webkit-scrollbar {
  width: 4px;
}

.scroll-area::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.brand-small {
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -1.5px;
  color: #1a1a1a;
}

.logout-button {
  border-radius: 10px;
  background-color: rgb(161, 0, 0);
  color: white;
  text-transform: uppercase;
}

.brand-small span {
  color: #557A55;
}

.letter-tight {
  letter-spacing: -1px !important;
}


.icon-box {
  background: #f0f4f0;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}


.text-muted-green {
  color: #557A55 !important;
}

.bg-sage-light {
  background-color: #f1f5f1 !important;
}

.border-muted {
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}

.border-dashed {
  border: 1px dashed rgba(0, 0, 0, 0.15) !important;
}

.task-dot {
  width: 8px;
  height: 8px;
  background-color: #557A55;
  border-radius: 50%;
}

.line-height-sm {
  line-height: 1.3 !important;
}

.v-card {
  transition: transform 0.2s ease;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style>
