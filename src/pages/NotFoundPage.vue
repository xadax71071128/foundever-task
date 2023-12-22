<script setup lang="ts">
import { useRouter } from "vue-router"
import { ROUTE_CRYPTO_OVERVIEW } from "@/app.routes"
import { computed } from "vue"
import { LayoutDashboard } from "@/app.organizer"
import { useI18n } from "vue-i18n"

const router = useRouter()
const { t: print } = useI18n()

const haveHistoryNavigation = computed(() => {
  return window.history.state !== null
})

const goBackHistory = () => {
  router.options.history.go(-1)
}
</script>

<template>
  <LayoutDashboard>
    <div class="flex flex-1 justify-center items-center flex-col">
      <div class="font-bold text-dark dark:text-white text-8xl">404</div>
      <div class="mt-2 text-dark dark:text-white text-xl">{{ print("page_not_found") }}</div>
      <router-link :to="{ name: ROUTE_CRYPTO_OVERVIEW.name }" class="mt-2 text-dark dark:text-white text-sm underline">
        {{ print("click_to_go_back") }}
      </router-link>
      <template v-if="haveHistoryNavigation">
        <div
          class="mt-5 text-gray-400 dark:text-gray-600 text-xs underline cursor-pointer"
          @click="() => goBackHistory()"
        >
          {{ print("click_to_router_history") }}
        </div>
      </template>
      <div class="mt-2 text-dark text-gray-300 dark:text-gray-600 text-xs">
        (It's better in production to adapt meta head for SEO, and auto-redirect.)
      </div>
    </div>
  </LayoutDashboard>
</template>

<style lang="scss"></style>
