<script setup lang="ts">
import { computed, ref } from 'vue'

import type { Todo } from '@/domain/todo.types'

const props = defineProps<{
  todo: Todo
  maxLength: number
}>()

const emit = defineEmits<{
  toggle: [todoId: string]
  remove: [todoId: string]
  update: [todoId: string, title: string]
}>()

const isEditing = ref(false)
const draftTitle = ref(props.todo.title)
const editError = ref<string | null>(null)

const itemClasses = computed(() => ({
  'todo-item': true,
  'todo-item--completed': props.todo.completed,
}))

const startEditing = (): void => {
  draftTitle.value = props.todo.title
  editError.value = null
  isEditing.value = true
}

const cancelEditing = (): void => {
  draftTitle.value = props.todo.title
  editError.value = null
  isEditing.value = false
}

const saveEditing = (): void => {
  const normalizedTitle = draftTitle.value.trim()

  if (!normalizedTitle) {
    editError.value = 'Please enter a todo title.'
    return
  }

  if (normalizedTitle.length > props.maxLength) {
    editError.value = `Todo title must be ${props.maxLength} characters or fewer.`
    return
  }

  emit('update', props.todo.id, normalizedTitle)
  isEditing.value = false
  editError.value = null
}

const handleEditKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    event.preventDefault()
    saveEditing()
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    cancelEditing()
  }
}
</script>

<template>
  <li :class="itemClasses">
    <div class="item-main">
      <label class="checkbox-label">
        <input
          :checked="todo.completed"
          type="checkbox"
          :aria-label="`Mark ${todo.title} as ${todo.completed ? 'active' : 'completed'}`"
          @change="emit('toggle', todo.id)"
        />
        <span v-if="!isEditing" class="todo-title">{{ todo.title }}</span>
      </label>

      <div v-if="isEditing" class="edit-panel">
        <label class="sr-only" :for="`edit-${todo.id}`">Edit todo</label>
        <input
          :id="`edit-${todo.id}`"
          v-model="draftTitle"
          type="text"
          :maxlength="maxLength"
          @keydown="handleEditKeydown"
        />
        <div class="edit-actions">
          <button type="button" class="secondary-button" @click="saveEditing">Save</button>
          <button type="button" class="ghost-button" @click="cancelEditing">Cancel</button>
        </div>
        <p v-if="editError" class="edit-error" role="alert">{{ editError }}</p>
      </div>
    </div>

    <div v-if="!isEditing" class="item-actions">
      <button type="button" class="secondary-button" @click="startEditing">Edit</button>
      <button type="button" class="ghost-button" @click="emit('remove', todo.id)">Delete</button>
    </div>
  </li>
</template>

<style scoped>
.todo-item {
  align-items: flex-start;
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr) auto;
  padding: 1rem 0;
}

.todo-item + .todo-item {
  border-top: 1px solid var(--color-border);
}

.todo-item--completed .todo-title {
  color: var(--color-text-muted);
  text-decoration: line-through;
}

.item-main {
  display: grid;
  gap: 0.75rem;
}

.checkbox-label {
  align-items: center;
  display: flex;
  gap: 0.75rem;
  min-width: 0;
}

.todo-title {
  overflow-wrap: anywhere;
}

.item-actions,
.edit-actions {
  display: flex;
  gap: 0.75rem;
}

.edit-panel {
  display: grid;
  gap: 0.75rem;
}

.edit-error {
  color: var(--color-danger);
  margin: 0;
}

@media (max-width: 640px) {
  .todo-item {
    grid-template-columns: 1fr;
  }

  .item-actions,
  .edit-actions {
    flex-wrap: wrap;
  }
}
</style>
