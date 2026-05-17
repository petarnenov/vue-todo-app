import { createApp } from 'vue'

import App from './App.vue'
import { installArguslog } from './arguslog'
import { pinia } from './app/providers/pinia'
import './styles/tokens.css'
import './styles/base.css'

const app = createApp(App)

app.use(pinia)
installArguslog(app)
app.mount('#app')
