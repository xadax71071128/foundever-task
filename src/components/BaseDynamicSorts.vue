<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { useCryptoStore } from "@/stores/crypto"

export type TDynamicSort = {
  index: string
  order: "asc" | "desc"
}

const { t: print } = useI18n()
const { setSort, fetchCryptosInfos } = useCryptoStore()
const lastSorter = ref<TDynamicSort>({
  index: "id",
  order: "asc",
})

const updateSorter = (sortName: string) => {
  if (!["id", "market_cap", "volume"].includes(sortName)) return

  let alreadyActiveSorter: boolean = lastSorter.value.index === sortName
  let order: "asc" | "desc" = alreadyActiveSorter && lastSorter.value.order === "asc" ? "desc" : "asc"

  lastSorter.value = {
    index: sortName,
    order,
  }

  setSort(sortName, order)
  fetchCryptosInfos()
}
</script>

<template>
  <div class="dyn-order max-w-max flex flex-1" style="max-width: 100%">
    <div class="flex w-20 pl-2 pr-2 items-center" />
    <div
      class="flex w-48 pl-4 pr-4 items-center align-center text-gray-600 dark:text-white font-bold cursor-pointer"
      @click="() => updateSorter('id')"
    >
      {{ print("id") }}
      <span class="ml-1" v-if="lastSorter.index === 'id' && lastSorter.order === 'asc'">&darr;</span>
      <span class="ml-1" v-if="lastSorter.index === 'id' && lastSorter.order === 'desc'">&uarr;</span>
    </div>
    <div class="flex w-48 pl-4 pr-4 items-center align-center text-gray-600 dark:text-white font-bold cursor-pointer">
      {{ print("name") }}
    </div>
    <div class="flex pl-4 pr-4 w-36 items-center align-center text-gray-600 dark:text-white font-bold">
      {{ print("current_price") }}
    </div>
    <div
      class="flex pl-4 pr-4 w-36 items-center align-center text-gray-600 dark:text-white font-bold cursor-pointer"
      @click="() => updateSorter('market_cap')"
    >
      {{ print("market_cap") }}
      <span class="ml-1" v-if="lastSorter.index === 'market_cap' && lastSorter.order === 'asc'">&darr;</span>
      <span class="ml-1" v-if="lastSorter.index === 'market_cap' && lastSorter.order === 'desc'">&uarr;</span>
    </div>
    <div
      class="flex pl-4 pr-4 w-36 items-center align-center text-gray-600 dark:text-white font-bold cursor-pointer"
      @click="() => updateSorter('volume')"
    >
      {{ print("total_volume") }}
      <span class="ml-1" v-if="lastSorter.index === 'volume' && lastSorter.order === 'asc'">&darr;</span>
      <span class="ml-1" v-if="lastSorter.index === 'volume' && lastSorter.order === 'desc'">&uarr;</span>
    </div>
    <div class="flex flex-1 w-300 items-center align-center justify-center text-gray-600 dark:text-white font-bold">
      {{ print("last_7_day") }}
    </div>
  </div>
</template>

<style lang="scss">
#app.light {
  .dyn-order {
    background-color: rgba(1, 1, 1, 0.03);
    border-radius: 0;
  }
}

#app.dark {
  .dyn-order {
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 0;
  }
}
</style>
