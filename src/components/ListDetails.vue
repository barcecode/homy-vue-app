<script setup>
import { ref, computed, watch } from 'vue';
import { collection, query, where, addDoc, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useDocument } from 'vuefire';

const db = useFirestore()
const props = defineProps({
  listId: {
    type: String
  },
  listName: {
    type: String
  },
  listColor: {
    type: String
  }
});

const listDoc = useDocument(computed(() =>
  props.listId ? doc(db, 'shopping_list', props.listId) : null
))


watch(listDoc, (newVal) => {
  if (newVal === null) {
    emit('close')
    alert('Esta lista ha sido eliminada por otro usuario.')
  }
})

const emit = defineEmits(['close']);
const newItem = ref('');

const itemsRef = collection(db, 'shopping_list_item');
const q = computed(() => {
  if (!props.listId) return null;

  return query(itemsRef, where('list_id', '==', props.listId), orderBy('purchased', 'asc'), orderBy('name', 'asc'));

})

const items = useCollection(computed(() => {
  if (!props.listId) {
    console.warn("ListDetails: Esperando listId válido...");
    return null;
  }

  return query(
    itemsRef,
    where('list_id', '==', props.listId),
    orderBy('purchased', 'asc'),
    orderBy('name', 'asc')
  );
}));

const addNewItem = async () => {
  await addDoc(itemsRef, {
    name: newItem.value,
    list_id: props.listId,
    purchased: false
  });
  newItem.value = '';
};

const toggleItem = async (item) => {
  const itemRef = doc(db, 'shopping_list_item', item.id);
  await updateDoc(itemRef, { purchased: item.purchased });
};

const deleteItem = async (id) => {
  if (confirm("¿Eliminar este elemento?")) {
    await deleteDoc(doc(db, 'shopping_list_item', id));
  }
  return
};
</script>

<template>
  <v-card :color="listColor" min-height="500">
    <v-toolbar :color="listColor" elevation="3" density="compact">
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title style="filter: brightness(80%);">{{ listName }}</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-form @submit.prevent="addNewItem" class="mb-4">
        <v-row density="compact">
          <v-col cols="8">
            <v-text-field v-model="newItem" label="Añadir producto" variant="underlined" density="compact" />
          </v-col>
          <v-col cols="4">
            <v-btn icon="mdi-plus" color="secondary" type="submit" :disabled="!newItem"></v-btn>
          </v-col>
        </v-row>
      </v-form>

      <v-list v-if="items.length > 0" bg-color="transparent">
        <v-list-item v-for="item in items" :key="item.id" class="rounded-lg mb-3 py-4 px-1"
          style="background-color: rgba(255, 255, 255, 0.45);">
          <template v-slot:prepend>
            <v-checkbox-btn :color="listColor" class="px-3" v-model="item.purchased" @change="toggleItem(item)"
              color="black" density="compact"></v-checkbox-btn>
          </template>

          <v-list-item-title :class="[
            'text-wrap px-2',
            item.purchased ? 'text-decoration-line-through text-grey' : 'text-black'
          ]" style="line-height: 1.4; word-break: break-word;">
            {{ item.name }}
          </v-list-item-title>

          <template v-slot:append>
            <v-btn icon="mdi-delete-outline" variant="text" size="small" color="red-darken-4"
              @click="deleteItem(item.id)"></v-btn>
          </template>
        </v-list-item>
      </v-list>

      <v-alert v-else type="info" variant="tonal" class="mt-4">No hay productos aún.</v-alert>
    </v-card-text>
  </v-card>
</template>
