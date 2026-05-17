<script setup lang="ts">
import { computed, ref } from 'vue'

import { TODO_VALIDATION_MESSAGES } from '@/domain/todo.constants'
import { normalizeTodoTitle } from '@/domain/todo.validators'

const props = defineProps<{
  errorMessage?: string | null
  maxLength: number
}>()

const emit = defineEmits<{
  submit: [title: string]
  inputChange: []
}>()

const title = ref('')
const localError = ref<string | null>(null)

const resolvedErrorMessage = computed(() => localError.value ?? props.errorMessage ?? null)

const handleSubmit = (): void => {
  const normalizedTitle = normalizeTodoTitle(title.value)

  if (!normalizedTitle) {
    localError.value = TODO_VALIDATION_MESSAGES.emptyTitle
    return
  }

  if (normalizedTitle.length > props.maxLength) {
    localError.value = `Todo title must be ${props.maxLength} characters or fewer.`
    return
  }

  emit('submit', normalizedTitle)
  title.value = ''
  localError.value = null
}

const handleInput = (): void => {
  localError.value = null
  emit('inputChange')
}
</script>

<template>
  <form class="todo-input" @submit.prevent="handleSubmit">
    <label class="sr-only" for="todo-title">New todo</label>
    <div class="input-row">
      <input
        id="todo-title"
        v-model="title"
        class="title-input"
        type="text"
        name="todo-title"
        placeholder="What needs to be done?"
        :maxlength="maxLength"
        autocomplete="off"
        @input="handleInput"
      />
      <button type="submit">Add todo</button>
    </div>
    <p
      v-if="resolvedErrorMessage"
      class="input-error"
      role="alert"
    >
      {{ resolvedErrorMessage }}
    </p>
  </form>
</template>

<style scoped>
.todo-input {
  display: grid;
  gap: 0.625rem;
}

.input-row {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: minmax(0, 1fr) auto;
}

.title-input {
  min-width: 0;
}

.input-error {
  color: var(--color-danger);
  margin: 0;
}

@media (max-width: 640px) {
  .input-row {
    grid-template-columns: 1fr;
  }
}
</style>
