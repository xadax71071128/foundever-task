<template>
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
      <div :style="{ height: `${itemHeight * visibleItemIndexStart}px` }"></div>
      <template v-for="(item, index) in currentList">
        <component
          v-if="index >= visibleItemIndexStart && index <= visibleItemIndexEnd"
          :key="item.id"
          :item-id="item.id"
          :crypto="item"
        />
      </template>
      <div
        :style="{
            height: `${
              itemHeight * (currentList.length - visibleItemIndexEnd < 0 ? 0 : currentList.length - visibleItemIndexEnd)
            }px`,
          }"
      ></div>
      <div v-if="isLoadingNextPage" class="flex centered p-5">
        <Spinner />
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, toRefs, VNodeRef } from "vue"

const scroller = ref<VNodeRef & HTMLElement>()
const visibleItemIndexStart = ref(0)
const visibleItemIndexEnd = ref(50)
const isLoadingNextPage = ref(false)

const props = defineProps<{
  currentList: any[]
  isLoadingInitialData: boolean
  loadNextPage: () => Promise<void>
  hasError: boolean
  component: any
  itemHeight: number
}>()

const { currentList, hasError, itemHeight } = toRefs(props)

const resetList = () => {
  updateVisibleIndexes()
  if (scroller.value) scroller.value.scrollTo(0, 0)
}

defineExpose({
  resetList
})

const updateVisibleIndexes = () => {
  if (scroller.value) {
    const { scrollTop, clientHeight } = scroller.value
    const maxIndex = currentList.value.length - 1
    const visibleElements = Math.floor(clientHeight / itemHeight.value)
    const maxStart = maxIndex - visibleElements
    visibleItemIndexStart.value = Math.min(maxStart < 0 ? 0 : maxStart, Math.floor(scrollTop / itemHeight.value))
    visibleItemIndexEnd.value = visibleItemIndexStart.value + visibleElements
  }
}

const onScroll = async () => {
  if (scroller.value) {
    const { scrollTop, clientHeight } = scroller.value
    const maxIndex = currentList.value.length - 1
    if (
      scrollTop + clientHeight >= maxIndex * itemHeight.value - 100 &&
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
  visibleItemIndexEnd.value = scroller.value?.clientHeight ? scroller.value?.clientHeight / itemHeight.value : 50
})

onUnmounted(() => {
  scroller.value?.removeEventListener("scroll", onScroll)
})
</script>

<style lang="scss" scoped>
.scroller {
  scrollbar-color: #687dfa rgba(0, 0, 0, 0.1);
  scrollbar-width: thin;
}

.centered {
  justify-content: center;
  align-items: center;
}
</style>
