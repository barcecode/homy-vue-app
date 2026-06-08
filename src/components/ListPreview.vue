<script setup>
const props = defineProps({
  id: {
    type: String
  },
  color: {
    type: String
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  createdBy: {
    type: String
  },
})

const emit = defineEmits(['open-items-dialog', 'delete-list'])

</script>
<template>
  <v-card :color="color">

    <v-card-title class="text-pre-wrap mt-4 mb-2">{{ name }}</v-card-title>

    <v-card-text class="text-pre-wrap">
      <div>{{ description }}</div>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-subtitle class="mt-3">Creada por: {{ createdBy }}</v-card-subtitle>

    <v-card-actions>
      <v-btn @click="emit('delete-list')">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn @click="emit('open-items-dialog')">
        <v-icon>mdi-eye-outline</v-icon>
      </v-btn>
      <v-btn>Editar</v-btn>
    </v-card-actions>
  </v-card>
</template>



<style lang="scss" scoped></style>
