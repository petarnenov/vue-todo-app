import { createApp } from 'vue'
import { createArguslog } from '@arguslog/sdk-vue'

import App from './App.vue'
import { pinia } from './app/providers/pinia'
import './styles/tokens.css'
import './styles/base.css'

const app = createApp(App)

app.use(pinia)
app.use(
  createArguslog({
    dsn: 'arguslog://IF4TWQD35UU5TKLGCCIMBYAHSFIMSVYN@ingest.arguslog.org/api/29',
    environment: 'production',
    integrations: ['globalHandlers', 'autoBreadcrumbs'],
  }),
)
app.mount('#app')
