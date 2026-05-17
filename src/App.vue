<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ArguslogErrorBoundary } from '@arguslog/sdk-vue'

import AppHeader from '@/components/AppHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import InlineMessage from '@/components/InlineMessage.vue'
import TodoFilters from '@/components/TodoFilters.vue'
import TodoFooter from '@/components/TodoFooter.vue'
import TodoInput from '@/components/TodoInput.vue'
import TodoList from '@/components/TodoList.vue'
import { TODO_TITLE_MAX_LENGTH } from '@/domain/todo.constants'
import { useTodoStore } from '@/stores/todoStore'

const todoStore = useTodoStore()
const { activeCount, completedCount, errorMessage, errorTone, filter, filteredTodos, hasCompleted, isEmpty, isHydrated } =
  storeToRefs(todoStore)

const createTodoError = ref<string | null>(null)

const showTodoContent = computed(() => isHydrated.value && !isEmpty.value)

const handleCreateTodo = (title: string): void => {
  const result = todoStore.addTodo(title)

  createTodoError.value = result.ok ? null : result.message ?? null
}

const handleUpdateTodo = (todoId: string, title: string): void => {
  todoStore.editTodo(todoId, title)
}

const clearCreateError = (): void => {
  createTodoError.value = null
}

onMounted(() => {
  todoStore.hydrate()
})
</script>

<template>
  <ArguslogErrorBoundary fallback="Something went wrong.">
    <main class="app-shell">
      <section class="app-card">
        <AppHeader />

        <TodoInput
          :error-message="createTodoError"
          :max-length="TODO_TITLE_MAX_LENGTH"
          @submit="handleCreateTodo"
          @input-change="clearCreateError"
        />

        <InlineMessage
          v-if="errorMessage && errorTone"
          :message="errorMessage"
          :tone="errorTone"
        />

        <p v-if="!isHydrated" class="loading-message">Loading todos...</p>

        <template v-else>
          <EmptyState v-if="isEmpty" />

          <section v-else class="todo-panel">
            <TodoFilters
              :current-filter="filter"
              @change="todoStore.setFilter"
            />
            <TodoList
              :todos="filteredTodos"
              :max-length="TODO_TITLE_MAX_LENGTH"
              @toggle="todoStore.toggleTodo"
              @remove="todoStore.removeTodo"
              @update="handleUpdateTodo"
            />
            <TodoFooter
              :active-count="activeCount"
              :completed-count="completedCount"
              :has-completed="hasCompleted"
              @clear-completed="todoStore.clearCompleted"
            />
          </section>
        </template>

        <p
          v-if="showTodoContent && filteredTodos.length === 0"
          class="filtered-empty-state"
        >
          No todos match the selected filter.
        </p>
      </section>
    </main>
  </ArguslogErrorBoundary>
</template>

<style scoped>
.app-shell {
  margin: 0 auto;
  max-width: 56rem;
  padding: 3rem 1rem;
}

.app-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1.5rem;
  box-shadow: var(--shadow-soft);
  display: grid;
  gap: 1.5rem;
  padding: clamp(1.25rem, 2vw, 2rem);
}

.todo-panel {
  display: grid;
  gap: 1.25rem;
}

.loading-message,
.filtered-empty-state {
  color: var(--color-text-muted);
  margin: 0;
}
</style>
