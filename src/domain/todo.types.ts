export type TodoFilter = 'all' | 'active' | 'completed'

export interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export type TodoActionFailureKind = 'validation' | 'persistence' | 'unexpected'

export interface TodoActionResult {
  ok: boolean
  message?: string
  kind?: TodoActionFailureKind
}

export interface ValidationResult<T> {
  ok: boolean
  value?: T
  message?: string
}

export interface TodoStoragePayload {
  version: string | number
  todos: Todo[]
}
