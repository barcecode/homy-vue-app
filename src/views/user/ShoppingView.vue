<script setup>
import ListDetails from '@/components/ListDetails.vue';
import ListPreview from '@/components/ListPreview.vue';
import { useShoppingStore } from '@/stores/shopping';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const shopping = useShoppingStore()

const isActive = ref(false)
const changeColor = ref(false)
const listColor = ref('#557A55')
const listName = ref('')
const listDescription = ref('')
const router = useRouter()

const detailsDialog = ref(false);
const selectedList = ref(null);

const openListItems = (list) => {
  selectedList.value = list;
  detailsDialog.value = true;
};

const handleCreateClick = () => {
  shopping.createList(listName.value, listDescription.value, listColor.value)
  toggleDialog()
  listColor.value = "#557A55"
  listName.value = ""
  listDescription.value = ""
}

function toggleDialog() {
  isActive.value = !isActive.value
}

function toggleChangeColor() {
  changeColor.value = !changeColor.value
}

function deleteList(listId) {
  if (confirm('¿Quieres eliminar permanentamente esta lista?')) {
    shopping.deleteList(listId)
  }
}
</script>

<template>
  <v-container class="bg-white px-6 pt-10">
    <v-row class="mb-8 align-center">
      <v-col cols="12" sm="8">
        <h2 class="brand-small mb-n2">homy<span>.</span></h2>
        <h1 class="text-h4 font-weight-black letter-tight mt-4">Listas de Compra</h1>
        <p class="text-body-2 text-grey-darken-1">Organiza los suministros de tu hogar</p>
      </v-col>
      <v-col cols="12" sm="4" class="text-sm-right">
        <v-btn @click="toggleDialog" color="black" size="large" rounded="pill" elevation="0" class="text-none px-6"
          prepend-icon="mdi-plus">
          Nueva lista
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="shopping.shoppingLists.length > 0">
      <v-col v-for="list in shopping.shoppingLists" :key="list.id" cols="12" md="6" lg="4">
        <list-preview @delete-list="deleteList(list.id)" @open-items-dialog="openListItems(list)" :name="list.name"
          :description="list.description" :id="list.id" :color="list.color" :created-by="list.created_by" />
      </v-col>
    </v-row>

    <v-row v-else justify="center" class="mt-12 text-center">
      <v-col cols="12" md="6">
        <v-icon icon="mdi-cart-off" size="80" color="grey-lighten-3" class="mb-4"></v-icon>
        <p class="text-h6 text-grey-darken-1">Aún no tienes listas de compra</p>
        <v-btn variant="text" color="muted-green" @click="toggleDialog">Crea la primera ahora</v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="detailsDialog" fullscreen transition="dialog-bottom-transition">
      <list-details v-if="detailsDialog && selectedList?.id" :listColor="selectedList.color" :listId="selectedList.id"
        :listName="selectedList.name" @close="detailsDialog = false" />
    </v-dialog>

    <v-dialog v-model="isActive" max-width="450">
      <v-card class="rounded-xl overflow-hidden shadow-card">
        <div :style="{ backgroundColor: listColor, height: '12px' }"></div>

        <v-card-title class="pt-6 px-6 font-weight-black text-h5">
          Crear nueva lista
        </v-card-title>

        <v-card-text class="px-6 pb-2">
          <v-text-field v-model="listName" label="Nombre" placeholder="Ej: Compra mensual" variant="outlined"
            rounded="lg" color="muted-green" class="mb-2" />
          <v-textarea v-model="listDescription" label="Descripción (opcional)" placeholder="¿Para qué es esta lista?"
            variant="outlined" rounded="lg" color="muted-green" rows="3" />

          <div class="d-flex align-center mt-2 pa-2 bg-grey-lighten-4 rounded-lg">
            <span class="text-caption font-weight-bold ml-2">Personalizar color:</span>
            <v-spacer></v-spacer>
            <v-avatar :color="listColor" size="32" class="cursor-pointer elevation-2 border-white"
              @click="toggleChangeColor">
              <v-icon icon="mdi-palette" size="small" color="white"></v-icon>
            </v-avatar>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 pt-2">
          <v-btn variant="text" color="grey-darken-1" class="text-none font-weight-bold" @click="toggleDialog">
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="handleCreateClick" :disabled="!listName" color="black" variant="flat"
            class="text-none px-6 rounded-pill">
            Guardar lista
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="changeColor" max-width="300">
      <v-card class="rounded-xl p-4">
        <v-color-picker v-model="listColor" mode="hex" :modes="['hex']" hide-inputs class="mx-auto"></v-color-picker>
        <v-btn block class="m-4 " color="black" @click="toggleChangeColor">Listo</v-btn>
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

:deep(.text-muted-green) {
  color: #557A55 !important;
}

.shadow-card {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
}

.border-white {
  border: 2px solid white !important;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
