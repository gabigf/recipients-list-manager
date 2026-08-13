import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.scss'
import { useRecipientsStore } from './stores/recipients.js'

const app = createApp(App)
app.use(createPinia())

const store = useRecipientsStore()
store.setupPersistence()

app.mount('#app')
