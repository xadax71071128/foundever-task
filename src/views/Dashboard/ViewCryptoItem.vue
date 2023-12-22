<script setup lang="ts">
import { watch, ref, onMounted, toRefs } from "vue"
import { BaseCardCrypto, BaseLoader } from "@/app.organizer"
import { useCryptoStore } from "@/stores/crypto"
import { useI18n } from "vue-i18n"
import { TCryptoData } from "@/stores/crypto.types"
import { useRouter } from "vue-router"
import { ROUTE_CRYPTO_OVERVIEW } from "@/app.routes"

const router = useRouter()

const id = router.currentRoute.value.params.id as string

const item = ref<TCryptoData>()

const cryptoStore = useCryptoStore()

const { fetchCryptosInfos } = cryptoStore

const { currencyActive, cryptoList, isReadyCryptoStore } = toRefs(cryptoStore.state)

const { t: print } = useI18n()

watch(isReadyCryptoStore, (newState) => {
  if (newState && id && registerItem()) fetchItemInfos()
})

watch(currencyActive, () => {
  fetchItemInfos()
})

const registerItem = () => {
  const storeItem = cryptoList.value.get(id as string)
  if (storeItem) {
    item.value = storeItem
    return true
  } else {
    router.push({ name: ROUTE_CRYPTO_OVERVIEW.name })
    return false
  }
}
const fetchItemInfos = () => {
  if (item.value) fetchCryptosInfos()
}

onMounted(() => {
  if (isReadyCryptoStore.value === 2) {
    registerItem()
    fetchItemInfos()
  }
})
</script>

<template>
  <div v-if="!isReadyCryptoStore || !item" class="flex flex-1 relative">
    <BaseLoader :text="print('loading_data')" />
  </div>
  <div v-else class="flex flex-1 relative">
    <BaseCardCrypto :data="item" :item-id="item.id" />
  </div>
</template>

<style lang="scss"></style>
