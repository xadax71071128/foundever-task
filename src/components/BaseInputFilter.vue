<script setup lang="ts">
import { ref } from "vue"
import { useCryptoStore } from "@/stores/crypto"

const inputValue = ref("")
const cryptoStore = useCryptoStore()
const { filterByName, fetchCryptosInfos, setPage } = cryptoStore

let timeoutId: number | null = null

const updateFilter = (e: Event) => {
  const dom = e.target as HTMLTextAreaElement
  const value = dom.value

  if (timeoutId !== null) {
    clearTimeout(timeoutId)
  }

  timeoutId = window.setTimeout(() => {
    filterByName(value)
    setPage(1)
    fetchCryptosInfos()
  }, 1000)
}

const reset = () => (inputValue.value = "")

defineExpose({
  reset,
})
</script>

<template>
  <input v-model="inputValue" type="text" @input="updateFilter" />
</template>

<style lang="scss" scoped>
*:focus {
  outline: 0 none transparent;
}
</style>
