<script setup>
import { ref, computed } from 'vue'
import { collection, addDoc, updateDoc, doc, deleteDoc, query, where } from 'firebase/firestore'
import { useFirestore, useCollection, useCurrentUser } from 'vuefire'
import { useUserStore } from '@/stores/user'

const db = useFirestore()
const userStore = useUserStore()
const user = useCurrentUser()

const tasksRef = collection(db, 'tasks')
const qTasks = computed(() => {
  const hId = userStore.currentUserInfo?.house_id
  return hId ? query(tasksRef, where('house_id', '==', hId)) : null
})
const tasks = useCollection(qTasks)

const qUsers = computed(() => {
  const hId = userStore.currentUserInfo?.house_id
  return hId ? query(collection(db, 'user'), where('house_id', '==', hId)) : null
})
const usersInHouse = useCollection(qUsers)

const showDialog = ref(false)
const newTask = ref({
  title: '',
  icon: 'mdi-broom',
  assigned_to: ''
})

const availableIcons = [
  'mdi-broom', 'mdi-silverware-clean', 'mdi-water', 'mdi-trash-can',
  'mdi-dog', 'mdi-cart', 'mdi-shimmer', 'mdi-hammer', 'mdi-bed'
]

const createTask = async () => {
  const hId = userStore.currentUserInfo?.house_id
  if (!hId || !newTask.value.title || !newTask.value.assigned_to) {
    return
  }

  const selectedUser = usersInHouse.value.find(u => u.id === newTask.value.assigned_to)

  try {
    await addDoc(tasksRef, {
      title: newTask.value.title,
      icon: newTask.value.icon,
      assigned_to: newTask.value.assigned_to,
      assigned_name: selectedUser ? selectedUser.name : 'Alguien',
      status: 'pending',
      house_id: hId,
      created_at: new Date()
    })

    showDialog.value = false
    newTask.value = { title: '', icon: 'mdi-broom', assigned_to: '' }
  } catch (e) {
    console.error("Error al crear tarea:", e)
  }
}

const toggleStatus = async (task) => {
  const newStatus = task.status === 'pending' ? 'completed' : 'pending'
  await updateDoc(doc(db, 'tasks', task.id), { status: newStatus })
}

const deleteTask = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
    await deleteDoc(doc(db, 'tasks', id))
  }
}
</script>

<template>
  <v-container class="bg-white px-6 pt-10">
    <v-row align="center" class="mb-8">
      <v-col cols="12" sm="8">
        <h2 class="brand-small mb-n2">homy<span>.</span></h2>
        <h1 class="text-h4 font-weight-black letter-tight mt-4">Tareas del Hogar</h1>
        <p class="text-body-2 text-grey-darken-1">Organiza la limpieza y las labores diarias</p>
      </v-col>
      <v-col cols="12" sm="4" class="text-sm-right">
        <v-btn color="black" prepend-icon="mdi-plus" @click="showDialog = true" size="large" rounded="pill"
          elevation="0" class="text-none px-6">
          Nueva Tarea
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="tasks.length > 0">
      <v-col v-for="task in tasks" :key="task.id" cols="12" sm="6" md="4" lg="3">
        <v-card variant="outlined"
          :class="['rounded-xl h-100 transition-card', task.status === 'completed' ? 'border-success bg-grey-lighten-5' : 'border-muted']">
          <v-card-item class="pb-2">
            <template v-slot:prepend>
              <div :class="['icon-box', task.status === 'completed' ? 'bg-success-light' : 'bg-sage-light']">
                <v-icon :icon="task.icon" :color="task.status === 'completed' ? 'success' : 'muted-green'"></v-icon>
              </div>
            </template>
            <v-card-title
              :class="['text-subtitle-1 text-pre-wrap font-weight-bold', { 'text-decoration-line-through text-grey': task.status === 'completed' }]">
              {{ task.title }}
            </v-card-title>
            <v-card-subtitle class="text-caption">Para: {{ task.assigned_name }}</v-card-subtitle>
          </v-card-item>

          <v-divider class="mx-4 opacity-5"></v-divider>

          <v-card-actions class="px-4 py-3">
            <v-btn variant="text" size="small"
              :prepend-icon="task.status === 'completed' ? 'mdi-check-circle' : 'mdi-circle-outline'"
              @click="toggleStatus(task)" :color="task.status === 'completed' ? 'success' : 'grey-darken-1'"
              class="text-none font-weight-bold">
              {{ task.status === 'completed' ? 'Completada' : 'Pendiente' }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-delete-outline" color="grey-lighten-1" variant="text" size="small"
              @click="deleteTask(task.id)"></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else class="text-center py-16">
      <v-col cols="12">
        <v-icon size="80" color="grey-lighten-3" class="mb-4">mdi-sparkles-outline</v-icon>
        <p class="text-h6 text-grey-darken-1 font-weight-medium">Todo está reluciente por aquí</p>
        <v-btn variant="text" color="muted-green" class="mt-2 font-weight-bold" @click="showDialog = true">
          Añadir una tarea
        </v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="showDialog" max-width="450">
      <v-card class="rounded-xl pa-4">
        <v-card-title class="font-weight-black text-h5 px-4 pt-4">Nueva Tarea</v-card-title>

        <v-card-text class="px-4">
          <v-text-field v-model="newTask.title" label="¿Qué hay que hacer?" placeholder="Ej: Limpiar el salón"
            variant="outlined" rounded="lg" color="muted-green" class="mb-2"></v-text-field>

          <p class="text-caption font-weight-bold text-grey-darken-1 mb-3 text-uppercase ml-1">Icono de la tarea</p>
          <v-item-group v-model="newTask.icon" mandatory>
            <v-row class="ma-0 mb-6 bg-grey-lighten-5 rounded-lg pa-2 border-muted" justify="center">
              <v-col v-for="icon in availableIcons" :key="icon" cols="auto" class="pa-1">
                <v-item :value="icon" v-slot="{ isSelected, toggle }">
                  <v-btn :color="isSelected ? 'muted-green' : 'grey-darken-1'" :variant="isSelected ? 'flat' : 'text'"
                    icon size="small" class="rounded-lg" @click="toggle">
                    <v-icon :icon="icon" size="small"></v-icon>
                  </v-btn>
                </v-item>
              </v-col>
            </v-row>
          </v-item-group>

          <v-select v-model="newTask.assigned_to" :items="usersInHouse" item-title="name" item-value="id"
            label="Asignar a..." variant="outlined" rounded="lg" color="muted-green"
            prepend-inner-icon="mdi-account-outline"></v-select>
        </v-card-text>

        <v-card-actions class="px-4 pb-4">
          <v-btn variant="text" color="grey" class="text-none font-weight-bold"
            @click="showDialog = false">Cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="black" variant="flat" class="text-none px-8 rounded-pill" @click="createTask"
            :disabled="!newTask.title || !newTask.assigned_to">
            Crear tarea
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

.icon-box {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.bg-sage-light {
  background: #f0f4f0;
}

.bg-success-light {
  background: #e8f5e9;
}

.border-muted {
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}

.border-success {
  border: 1px solid #4CAF50 !important;
}

.transition-card {
  transition: all 0.2s ease-in-out;
}

.transition-card:hover {
  transform: translateY(-4px);
  border-color: rgba(0, 0, 0, 0.15) !important;
}

.text-muted-green {
  color: #557A55 !important;
}
</style>
