<script setup lang="ts">
import { TODO_FILTERS } from '@/domain/todo.constants'
import type { TodoFilter } from '@/domain/todo.types'

defineProps<{
  currentFilter: TodoFilter
}>()

const emit = defineEmits<{
  change: [filter: TodoFilter]
}>()
</script>

<template>
  <nav class="todo-filters" aria-label="Todo filters">
    <button
      v-for="filterOption in TODO_FILTERS"
      :key="filterOption.value"
      type="button"
      class="filter-button"
      :class="{ 'filter-button--active': currentFilter === filterOption.value }"
      :aria-pressed="currentFilter === filterOption.value"
      @click="emit('change', filterOption.value)"
    >
      {{ filterOption.label }}
    </button>
  </nav>
</template>

<style scoped>
.todo-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-button {
  background: transparent;
  color: var(--color-text-muted);
}

.filter-button--active {
  background: var(--color-accent-soft);
  color: var(--color-accent-strong);
}
</style>
