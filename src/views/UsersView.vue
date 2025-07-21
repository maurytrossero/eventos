<!-- src/views/UsersView.vue -->
<template>
  <div class="users-view">
    <UsersList />
  </div>
</template>

<script setup lang="ts">
import UsersList from '@/components/UsersList.vue'
</script>

<style scoped>
.users-view {
  padding: 2rem;
}
</style>
