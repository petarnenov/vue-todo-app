export type TodoFilter = 'all' | 'active' | 'completed'

export interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface TodoActionResult {
  ok: boolean
  message?: string
}

export interface ValidationResult<T> {
  ok: boolean
  value?: T
  message?: string
}
