import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { TODO_VALIDATION_MESSAGES } from '@/domain/todo.constants'
import { createTodo, toggleTodoCompletion, updateTodoTitle } from '@/domain/todo.mapper'
import { getActiveCount, getCompletedCount, getFilteredTodos, hasCompletedTodos } from '@/domain/todo.selectors'
import type { Todo, TodoActionResult, TodoFilter } from '@/domain/todo.types'
import { validateTodoTitle } from '@/domain/todo.validators'
import { todoTelemetry } from '@/services/telemetry'
import { todoStorage } from '@/services/todoStorage'

export type InlineMessageTone = 'error' | 'warning'

const findTodoIndex = (todos: readonly Todo[], todoId: string): number =>
  todos.findIndex((todo) => todo.id === todoId)

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const filter = ref<TodoFilter>('all')
  const errorMessage = ref<string | null>(null)
  const errorTone = ref<InlineMessageTone | null>(null)
  const isHydrated = ref(false)

  const filteredTodos = computed(() => getFilteredTodos(todos.value, filter.value))
  const activeCount = computed(() => getActiveCount(todos.value))
  const completedCount = computed(() => getCompletedCount(todos.value))
  const hasCompleted = computed(() => hasCompletedTodos(todos.value))
  const isEmpty = computed(() => todos.value.length === 0)

  const setStorageMessage = (message: string, tone: InlineMessageTone): void => {
    errorMessage.value = message
    errorTone.value = tone
  }

  const clearStorageMessage = (): void => {
    errorMessage.value = null
    errorTone.value = null
  }

  const persistTodos = (): { ok: boolean; message?: string } => {
    const result = todoStorage.write(todos.value)

    if (!result.ok) {
      setStorageMessage(result.message ?? TODO_VALIDATION_MESSAGES.writeFailed, 'warning')
      return {
        ok: false,
        message: result.message ?? TODO_VALIDATION_MESSAGES.writeFailed,
      }
    }

    clearStorageMessage()
    return { ok: true }
  }

  const hydrate = (): void => {
    const result = todoStorage.read()

    if (!result.ok) {
      todos.value = []
      setStorageMessage(result.message ?? TODO_VALIDATION_MESSAGES.invalidSnapshot, 'error')
      isHydrated.value = true
      return
    }

    todos.value = result.data ?? []
    clearStorageMessage()
    isHydrated.value = true
  }

  const addTodo = (title: string): TodoActionResult => {
    const normalizedTitleLength = title.trim().length

    todoTelemetry.trackCreateAttempt({ titleLength: normalizedTitleLength })

    const validationResult = validateTodoTitle(title)

    if (!validationResult.ok || !validationResult.value) {
      todoTelemetry.trackCreateFailure('validation', { titleLength: normalizedTitleLength })

      return {
        ok: false,
        message: validationResult.message,
        kind: 'validation',
      }
    }

    try {
      todos.value = [createTodo(validationResult.value), ...todos.value]
    } catch (error) {
      todoTelemetry.trackCreateUnexpectedFailure(error, {
        titleLength: validationResult.value.length,
        totalTodos: todos.value.length,
      })
      throw error
    }

    const persistenceResult = persistTodos()

    if (!persistenceResult.ok) {
      todoTelemetry.trackCreateFailure('persistence', {
        titleLength: validationResult.value.length,
        totalTodos: todos.value.length,
      })

      return {
        ok: true,
        message: persistenceResult.message,
        kind: 'persistence',
      }
    }

    todoTelemetry.trackCreateSuccess({
      titleLength: validationResult.value.length,
      totalTodos: todos.value.length,
    })

    return { ok: true }
  }

  const editTodo = (todoId: string, title: string): TodoActionResult => {
    const validationResult = validateTodoTitle(title)
    const normalizedTitle = validationResult.ok ? validationResult.value : undefined

    if (!normalizedTitle) {
      return {
        ok: false,
        message: validationResult.message,
      }
    }

    const todoIndex = findTodoIndex(todos.value, todoId)

    if (todoIndex === -1) {
      return {
        ok: false,
        message: TODO_VALIDATION_MESSAGES.missingTodo,
      }
    }

    todos.value = todos.value.map((todo, index) =>
      index === todoIndex ? updateTodoTitle(todo, normalizedTitle) : todo,
    )
    persistTodos()

    return { ok: true }
  }

  const toggleTodo = (todoId: string): void => {
    const todoIndex = findTodoIndex(todos.value, todoId)

    if (todoIndex === -1) {
      setStorageMessage(TODO_VALIDATION_MESSAGES.missingTodo, 'error')
      return
    }

    todos.value = todos.value.map((todo, index) =>
      index === todoIndex ? toggleTodoCompletion(todo) : todo,
    )
    persistTodos()
  }

  const removeTodo = (todoId: string): void => {
    todos.value = todos.value.filter((todo) => todo.id !== todoId)
    persistTodos()
  }

  const clearCompleted = (): void => {
    todos.value = todos.value.filter((todo) => !todo.completed)
    persistTodos()
  }

  const setFilter = (nextFilter: TodoFilter): void => {
    filter.value = nextFilter
    //@ts-expect-error Runtime-injected global is not declared in the Window type.
    const john = window!.family
    console.log(john)
  }

  return {
    todos,
    filter,
    errorMessage,
    errorTone,
    isHydrated,
    filteredTodos,
    activeCount,
    completedCount,
    hasCompleted,
    isEmpty,
    hydrate,
    addTodo,
    editTodo,
    toggleTodo,
    removeTodo,
    clearCompleted,
    setFilter,
  }
})
