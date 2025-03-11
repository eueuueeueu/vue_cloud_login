import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { Login } from './views'

const app = createApp(App)
app.use(Login)
app.mount('#app')
