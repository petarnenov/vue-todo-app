const normalizeRuntimeValue = (value: string | undefined): string | undefined => {
  const normalizedValue = value?.trim()

  return normalizedValue ? normalizedValue : undefined
}

export interface RuntimeEnv {
  arguslogDsn?: string
  environment: string
  release?: string
}

export const runtimeEnv: RuntimeEnv = {
  arguslogDsn: normalizeRuntimeValue(import.meta.env.VITE_ARGUSLOG_DSN),
  environment: normalizeRuntimeValue(import.meta.env.VITE_APP_ENVIRONMENT) ?? import.meta.env.MODE,
  release: normalizeRuntimeValue(import.meta.env.VITE_APP_RELEASE),
}
