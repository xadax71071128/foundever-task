import { createApp } from "vue"
import App from "./App.vue"
import router from "./app.router"
import { createPinia } from "pinia"
import { createMetaManager } from "vue-meta"
import { createI18n } from "vue-i18n"
import VueLazyLoad from "vue3-lazyload"
import fr from "@/langs/fr.js"
import en from "@/langs/en.js"

const i18n = createI18n({
  legacy: false,
  messages: {
    en: en,
    fr: fr,
  },
})

const app = createApp(App)
app.use(router)
app.use(i18n)
app.use(VueLazyLoad, {})
app.use(createPinia())
app.use(createMetaManager())
app.mount("#root")
