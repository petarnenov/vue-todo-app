<script setup lang="ts">
import TodoItem from './TodoItem.vue'

import type { Todo } from '@/domain/todo.types'

defineProps<{
  todos: readonly Todo[]
  maxLength: number
}>()

const emit = defineEmits<{
  toggle: [todoId: string]
  remove: [todoId: string]
  update: [todoId: string, title: string]
}>()
</script>

<template>
  <section class="todo-list" aria-label="Todo list">
    <ul>
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        :max-length="maxLength"
        @toggle="emit('toggle', $event)"
        @remove="emit('remove', $event)"
        @update="(todoId, title) => emit('update', todoId, title)"
      />
    </ul>
  </section>
</template>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
