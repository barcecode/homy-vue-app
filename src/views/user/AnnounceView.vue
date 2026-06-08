<script setup>
import { ref, computed } from 'vue'
import { collection, addDoc, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore'
import { useFirestore, useCollection } from 'vuefire'
import { useUserStore } from '@/stores/user'

const db = useFirestore()
const userStore = useUserStore()

const announcementsRef = collection(db, 'announcement')
const q = computed(() => {
  const hId = userStore.currentUserInfo?.house_id
  return hId ? query(announcementsRef, where('house_id', '==', hId), orderBy('created_at', 'desc')) : null
})
const announcements = useCollection(q)

const showDialog = ref(false)
const newMessage = ref({
  text: '',
  type: 'mensaje'
})


const getNoteStyles = (type) => {
  switch (type) {
    case 'aviso': return { bg: '#FFF5F5', border: '#FF8A8A', icon: 'mdi-alert-circle-outline' }
    case 'recordatorio': return { bg: '#FFFBEB', border: '#FCD34D', icon: 'mdi-lightbulb-on-outline' }
    case 'mensaje': return { bg: '#F0F9FF', border: '#7DD3FC', icon: 'mdi-comment-text-outline' }
    default: return { bg: '#F9FAFB', border: '#E5E7EB', icon: 'mdi-pin-outline' }
  }
}

const postAnnouncement = async () => {
  if (!newMessage.value.text) return
  try {
    await addDoc(announcementsRef, {
      ...newMessage.value,
      user_name: userStore.currentUserInfo.name,
      user_id: userStore.currentUserInfo.id,
      house_id: userStore.currentUserInfo.house_id,
      created_at: new Date()
    })
    showDialog.value = false
    newMessage.value = { text: '', type: 'mensaje' }
  } catch (e) {
    console.error("Error al publicar:", e)
  }
}

const removeAnnouncement = async (id) => {
  if (confirm('¿Eliminar este mensaje?')) {
    await deleteDoc(doc(db, 'announcement', id))
  }
}
</script>

<template>
  <v-container class="bg-white px-6 pt-10">
    <v-row align="center" class="mb-8">
      <v-col cols="12" sm="8">
        <h2 class="brand-small mb-n2">homy<span>.</span></h2>
        <h1 class="text-h4 font-weight-black letter-tight mt-4">Tablón de Anuncios</h1>
        <p class="text-body-2 text-grey-darken-1">Notas rápidas para todos en casa</p>
      </v-col>
      <v-col cols="12" sm="4" class="text-sm-right">
        <v-btn color="black" prepend-icon="mdi-pin" @click="showDialog = true" size="large" rounded="pill" elevation="0"
          class="text-none px-6">
          Dejar nota
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="note in announcements" :key="note.id" cols="12" sm="6" md="4">
        <v-card class="note-card rounded-xl pa-5" variant="flat" :style="{
          backgroundColor: getNoteStyles(note.type).bg,
          border: `1px solid ${getNoteStyles(note.type).border}33`,
          borderTop: `6px solid ${getNoteStyles(note.type).border}`
        }">
          <div class="d-flex justify-space-between align-start mb-4">
            <v-icon :icon="getNoteStyles(note.type).icon" size="small" color="grey-darken-1"></v-icon>
            <v-btn v-if="note.user_id === userStore.currentUserInfo?.id" icon="mdi-close" variant="text" size="x-small"
              color="grey-darken-1" @click="removeAnnouncement(note.id)"></v-btn>
          </div>

          <p class="text-body-1 font-weight-medium mb-6 note-text">
            {{ note.text }}
          </p>

          <div class="d-flex align-center mt-auto">
            <v-avatar size="24" color="white" class="mr-2 border-muted">
              <span class="text-caption font-weight-bold text-muted-green">{{ note.user_name?.charAt(0) }}</span>
            </v-avatar>
            <span class="text-caption font-weight-black text-grey-darken-2">{{ note.user_name }}</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="announcements.length === 0" class="text-center py-16">
      <v-col cols="12">
        <v-icon size="80" color="grey-lighten-4">mdi-pin-off-outline</v-icon>
        <p class="text-h6 text-grey-lighten-1 font-weight-medium">No hay avisos por ahora</p>
      </v-col>
    </v-row>

    <v-dialog v-model="showDialog" max-width="450">
      <v-card class="rounded-xl pa-4">
        <v-card-title class="font-weight-black text-h5 px-4 pt-4">¿Qué quieres anunciar?</v-card-title>

        <v-card-text class="px-4 pt-2">
          <v-textarea v-model="newMessage.text" placeholder="Escribe algo importante..." variant="outlined" rounded="lg"
            color="muted-green" counter="150" maxlength="150" rows="4" class="mb-4 custom-textarea"></v-textarea>

          <p class="text-caption font-weight-bold text-grey-darken-1 mb-3 text-uppercase">Prioridad de la nota</p>
          <v-chip-group v-model="newMessage.type" mandatory selected-class="active-chip">
            <v-chip value="mensaje" variant="tonal" class="rounded-lg">Mensaje</v-chip>
            <v-chip value="recordatorio" color="orange" variant="tonal" class="rounded-lg">Recordatorio</v-chip>
            <v-chip value="aviso" color="red" variant="tonal" class="rounded-lg">Urgente</v-chip>
          </v-chip-group>
        </v-card-text>

        <v-card-actions class="px-4 pb-4">
          <v-btn variant="text" color="grey" class="text-none font-weight-bold"
            @click="showDialog = false">Cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="black" variant="flat" class="text-none px-8 rounded-pill" @click="postAnnouncement"
            :disabled="!newMessage.text">
            Publicar nota
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

.note-card {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.note-card:hover {
  transform: translateY(-5px) rotate(0.5deg);
}

.note-text {
  line-height: 1.4;
  color: #2D3748;
}

.border-muted {
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.active-chip {
  font-weight: bold;
}

:deep(.custom-textarea .v-field__outline) {
  --v-field-border-opacity: 0.1;
}

.text-muted-green {
  color: #557A55 !important;
}
</style>
