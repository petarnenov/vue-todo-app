import type { App as VueApp } from 'vue'
import { createArguslog } from '@arguslog/sdk-vue'

/**
 * Install Arguslog into the Vue app. Reads the DSN from VITE_ARGUSLOG_DSN at build
 * time. If the variable is missing (local dev without keys), the installer is a
 * deliberate no-op so the app boots cleanly without Arguslog mounted.
 */
export function installArguslog(app: VueApp): void {
  const dsn = import.meta.env.VITE_ARGUSLOG_DSN
  if (!dsn) return

  app.use(
    createArguslog({
      dsn,
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_RELEASE,
      integrations: ['globalHandlers', 'autoBreadcrumbs'],
    }),
  )
}
