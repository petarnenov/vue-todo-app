/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ARGUSLOG_DSN?: string
  readonly VITE_APP_ENVIRONMENT?: string
  readonly VITE_APP_RELEASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
