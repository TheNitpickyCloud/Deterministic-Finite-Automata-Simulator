import { createApp } from 'vue'
import App from './App.vue'     
import VueGtag from "vue-gtag"

createApp(App).use(VueGtag, {
  config: { 
    id: "G-02NFFWP6SP",
    params: {
      anonymize_ip: true
    }
  }
}).mount('#app')