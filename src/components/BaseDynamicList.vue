<script setup lang="ts">
import { BaseLineCrypto, Spinner } from "@/app.organizer"
import { onMounted, onUnmounted, ref, toRefs, VNodeRef, watch } from "vue"
import { useI18n } from "vue-i18n"

const { t: print } = useI18n()
const scroller = ref<VNodeRef & HTMLElement>()
const visibleItemIndexStart = ref(0)
const visibleItemIndexEnd = ref(50)
const isLoadingNextPage = ref(false)

const props = defineProps<{
  currentList: any[]
  loadNextPage: () => Promise<void>
  retry: () => Promise<void>
  hasError: boolean
  isLoadingInitialData: boolean
}>()

const { currentList, hasError, isLoadingInitialData } = toRefs(props)

const retryLoad = async () => {
  await props.retry()
  updateVisibleIndexes()
}

const resetList = () => {
  updateVisibleIndexes()
  if (scroller.value) scroller.value.scrollTo(0, 0)
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

defineExpose({
  resetList,
})

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
      await props.loadNextPage()
      isLoadingNextPage.value = false
      setTimeout(() => {
        updateVisibleIndexes()
      }, 100)
    }
    updateVisibleIndexes()
  }
}

onMounted(async () => {
  scroller.value?.addEventListener("scroll", onScroll)
  visibleItemIndexEnd.value = scroller.value?.clientHeight ? scroller.value?.clientHeight / 64 : 50
})

onUnmounted(() => {
  scroller.value?.removeEventListener("scroll", onScroll)
})
</script>

<template>
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
        @click="retryLoad"
      >
        Retry
      </button>
    </div>
  </div>
</template>

<style lang="scss">
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

.centered {
  justify-content: center;
  align-items: center;
}

.scroller {
  scrollbar-color: #687dfa rgba(0, 0, 0, 0.1);
  scrollbar-width: thin;
}
</style>
