import type { App as VueApp } from 'vue'
import { createArguslog } from '@arguslog/sdk-vue'

import { runtimeEnv } from '@/config/runtimeEnv'

export const installArguslog = (app: VueApp): void => {
  if (!runtimeEnv.arguslogDsn) {
    return
  }

  app.use(
    createArguslog({
      dsn: runtimeEnv.arguslogDsn,
      environment: runtimeEnv.environment,
      release: runtimeEnv.release,
      integrations: ['globalHandlers', 'autoBreadcrumbs'],
    }),
  )
}
