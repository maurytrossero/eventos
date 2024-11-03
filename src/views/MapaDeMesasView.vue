// src/views/MapaDeMesasView.vue
<template>
  <div class="mapa-de-mesas-view">
    <MapaMesas />
  </div>
</template>

<script>
import MapaMesas from '@/components/MapaMesas.vue';

export default {
  components: {
    MapaMesas,
  },
};
</script>

<style scoped>
.mapa-de-mesas-view {
  padding: 20px;
}
</style>
