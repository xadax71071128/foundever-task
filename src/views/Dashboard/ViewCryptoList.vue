<script setup lang="ts">
import { ref, computed, watch, Ref, toRefs } from "vue"
import {
  BaseTitle,
  BaseInputFilter,
  BaseSelectFilter,
  BaseDynamicSorts,
  BaseLoader,
} from "@/app.organizer"
import { useCryptoStore } from "@/stores/crypto"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import BaseDynamicList from "@/components/BaseDynamicList.vue"

defineProps({
  title: String,
})

const { t: print } = useI18n()
const cryptoStore = useCryptoStore()
const { currencyActive, currenciesList, isReadyCryptoStore, currentList, cryptoFavorites } = toRefs(cryptoStore.state)
const { fetchCryptosInfos, setCurrencyActive, setPage, setSort, nextPage, filterByIds, filterByName } = cryptoStore
const refInputFilter = ref() as Ref<typeof BaseInputFilter>
const listRef = ref() as Ref<typeof BaseDynamicList>
const hasError = ref(false)
const isLoadingInitialData = ref(true)
const currenciesListOptions = computed(() => currenciesList.value.map((c) => ({ value: c, label: c })))

const route = useRoute()

const handleRouteLoad = async () => {
  if (route.name === "CryptoFavorites") {
    filterByIds(Array.from(cryptoFavorites.value.keys()))
    setPage(1)
    hasError.value = !(await fetchCryptosInfos())
  } else {
    filterByIds([])
    setPage(1)
    hasError.value = !(await fetchCryptosInfos())
  }
  listRef.value?.resetList()
}

watch(() => route.name, () => {
  if (refInputFilter) refInputFilter.value.reset()
  handleRouteLoad()
})

const retry = async () => {
  hasError.value = !(await fetchCryptosInfos())
}

const setCurrency = async (currency: string) => {
  setCurrencyActive(currency)
  setPage(1)
  setSort("id", "asc")
  hasError.value = !(await fetchCryptosInfos())
}

const loadNextPage = async () => {
  nextPage()
  hasError.value = !(await fetchCryptosInfos())
}

const setFilter = async (value: string) => {
  filterByName(value)
  setPage(1)
  hasError.value = !(await fetchCryptosInfos())
}

const initializeData = async () => {
  if (isReadyCryptoStore.value == 2 && isLoadingInitialData.value) {
    handleRouteLoad()
    setSort("id", "asc")
    hasError.value = !(await fetchCryptosInfos())
    isLoadingInitialData.value = false
  }
}
initializeData()
watch(isReadyCryptoStore, initializeData)

</script>

<template>
  <div v-if="!isReadyCryptoStore" class="flex flex-1 relative">
    <BaseLoader :text="print('loading_data')" />
  </div>
  <div v-else class="flex flex-1 flex-col pt-16 w-full lg:w-5/6 max-w-screen-xl self-center">
    <div class="flex flex-col max-w-screen w-full bg-blue mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-5">
        <div class="flex col-span-2 justify-center md:justify-start">
          <BaseTitle :text="title" class="-mt-3 mr-4 a-05 fadeInLeft" />
        </div>
        <div class="flex col-span-3 items-center justify-center md:justify-start mb-2 md:mb-0 a-05 d-500 fadeInDown">
          <BaseInputFilter
            ref="refInputFilter"
            index="name"
            :search-indexes="['name', 'symbol']"
            class="rounded-l-full h-10 shadow p-2 outline-0"
            :placeholder="print('search_a_name')"
            @onChange="setFilter"
          />
          <BaseSelectFilter
            index="currency"
            :default="currencyActive"
            :options="currenciesListOptions"
            @onChange="setCurrency"
            class="rounded-r-full h-10 shadow uppercase font-bold pl-3"
          />
        </div>
      </div>
      <div class="flex flex-1 mt-1">
        <BaseDynamicSorts class="h-10 pb-1 rounded-r-full shadowshadow a-05 d-200 fadeInDown" />
      </div>
    </div>

    <BaseDynamicList
      ref="listRef"
      :load-next-page="loadNextPage"
      :is-loading-initial-data="isLoadingInitialData"
      :current-list="currentList"
      :has-error="hasError"
      :retry="retry"
    />
  </div>
</template>
