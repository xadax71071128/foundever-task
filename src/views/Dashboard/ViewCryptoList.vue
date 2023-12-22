<script setup lang="ts">
import { ref, computed, onMounted, watch, Ref, VNodeRef, onUnmounted, toRefs } from "vue"
import {
  BaseTitle,
  BaseInputFilter,
  BaseSelectFilter,
  BaseDynamicSorts,
  BaseLineCrypto,
  BaseLoader,
  Spinner,
} from "@/app.organizer"
import { useCryptoStore } from "@/stores/crypto"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"

defineProps({
  title: String,
})

const { t: print } = useI18n()
const cryptoStore = useCryptoStore()
const { currencyActive, currenciesList, isReadyCryptoStore, currentList, cryptoFavorites } = toRefs(cryptoStore.state)
const { fetchCryptosInfos, setCurrencyActive, setPage, setSort, nextPage, filterByIds, filterByName } = cryptoStore
const refInputFilter = ref() as Ref<typeof BaseInputFilter>

const currenciesListOptions = computed(() => {
  return currenciesList.value.map((c) => {
    return {
      value: c,
      label: c,
    }
  })
})

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
  updateVisibleIndexes()
  if (scroller.value) scroller.value.scrollTo(0, 0)
}

watch(
  () => route.name,
  () => {
    if (refInputFilter) refInputFilter.value.reset()
    handleRouteLoad()
  },
)

const hasError = ref(false)
const isLoadingInitialData = ref(true)
const isLoadingNextPage = ref(false)
const scroller = ref<VNodeRef & HTMLElement>()
const visibleItemIndexStart = ref(0)
const visibleItemIndexEnd = ref(50)

const retry = async () => {
  isLoadingNextPage.value = true
  hasError.value = !(await fetchCryptosInfos())
  isLoadingNextPage.value = false
  updateVisibleIndexes()
}

const setCurrency = async (currency: string) => {
  setCurrencyActive(currency)
  setPage(1)
  setSort("id", "asc")
  hasError.value = !(await fetchCryptosInfos())
}

const updateVisibleIndexes = () => {
  if (scroller.value) {
    const { scrollTop, clientHeight } = scroller.value
    const maxIndex = currentList.value.length - 1
    const visibleElements = Math.floor(clientHeight / 64)
    const maxStart = maxIndex - visibleElements
    visibleItemIndexStart.value = Math.min(maxStart < 0 ? 0 : maxStart, Math.floor(scrollTop / 64))
    visibleItemIndexEnd.value = visibleItemIndexStart.value + visibleElements
  }
}

const onScroll = async () => {
  if (scroller.value) {
    const { scrollTop, clientHeight } = scroller.value
    const maxIndex = currentList.value.length - 1
    if (
      scrollTop + clientHeight >= maxIndex * 64 - 100 &&
      !isLoadingNextPage.value &&
      !hasError.value &&
      maxIndex >= 249
    ) {
      isLoadingNextPage.value = true
      nextPage()
      hasError.value = !(await fetchCryptosInfos())
      isLoadingNextPage.value = false
      setTimeout(() => {
        updateVisibleIndexes()
      }, 100)
    }
    updateVisibleIndexes()
  }
}

const setFilter = async (value: string) => {
  filterByName(value)
  setPage(1)
  hasError.value = !(await fetchCryptosInfos())
}

const initializeData = async () => {
  if (isReadyCryptoStore.value == 2) {
    handleRouteLoad()
    setSort("id", "asc")
    hasError.value = !(await fetchCryptosInfos())
    isLoadingInitialData.value = false
  }
}
initializeData()

watch(isReadyCryptoStore, () => {
  if (isReadyCryptoStore.value == 2 && isLoadingInitialData.value) {
    initializeData()
  }
})

onMounted(async () => {
  scroller.value?.addEventListener("scroll", onScroll)
  visibleItemIndexEnd.value = scroller.value?.clientHeight ? scroller.value?.clientHeight / 64 : 50
})

onUnmounted(() => {
  scroller.value?.removeEventListener("scroll", onScroll)
})
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

    <div class="db-list flex-1 flex flex-col pt-1">
      <div ref="scroller" class="scroller h-10 overflow-y-scroll flex-auto">
        <div v-if="isLoadingInitialData" class="flex centered p-5">
          <Spinner />
        </div>
        <div
          v-else-if="!currentList.length"
          class="flex flex-1 h-full text-4xl font-bold justify-center items-center"
          :style="{ color: '#ddd' }"
        >
          no result
        </div>
        <template v-else>
          <div :style="{ height: `${64 * visibleItemIndexStart}px` }"></div>
          <template v-for="(item, index) in currentList">
            <BaseLineCrypto
              v-if="index >= visibleItemIndexStart && index <= visibleItemIndexEnd"
              :key="item.id"
              :item-id="item.id"
              :crypto="item"
            />
          </template>
          <div
            :style="{
              height: `${
                64 * (currentList.length - visibleItemIndexEnd < 0 ? 0 : currentList.length - visibleItemIndexEnd)
              }px`,
            }"
          ></div>
          <div v-if="isLoadingNextPage" class="flex centered p-5">
            <Spinner />
          </div>
        </template>
      </div>
      <div v-if="hasError" class="error-request flex flex-1 p-5 text-l font-bold justify-center items-center">
        <div>{{ print("fetch_data_error") }}</div>
        <button
          type="button"
          class="inline-flex items-center p-2 ml-1 text-sm text-black rounded-lg bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-black dark:hover:bg-gray-200 dark:focus:ring-gray-600"
          @click="retry"
        >
          Retry
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.db-list {
  position: relative;
}

.centered {
  justify-content: center;
  align-items: center;
}

.error-request {
  position: absolute;
  display: flex;
  justify-content: space-between;
  bottom: 30px;
  left: 20%;
  width: 60%;
  box-sizing: border-box;
  background: red;
  color: #fff;
  border-radius: 10px;
}
</style>
