<script setup lang="ts">
defineProps<{
  activeCount: number
  completedCount: number
  hasCompleted: boolean
}>()

const emit = defineEmits<{
  clearCompleted: []
}>()
</script>

<template>
  <footer class="todo-footer">
    <p class="todo-count">
      <strong>{{ activeCount }}</strong>
      {{ activeCount === 1 ? 'item left' : 'items left' }}
    </p>
    <p class="completed-count">{{ completedCount }} completed</p>
    <button
      v-if="hasCompleted"
      type="button"
      class="ghost-button"
      @click="emit('clearCompleted')"
    >
      Clear completed
    </button>
  </footer>
</template>

<style scoped>
.todo-footer {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  justify-content: space-between;
}

.todo-count,
.completed-count {
  color: var(--color-text-muted);
  margin: 0;
}
</style>
