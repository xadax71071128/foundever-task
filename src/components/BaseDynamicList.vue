<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import InfiniteScroll from "@/components/InfiniteScroll.vue"
import { Ref } from "vue/dist/vue"
import { BaseLineCrypto } from "@/app.organizer"

const { t: print } = useI18n()
const infiniteScrollRef = ref() as Ref<typeof InfiniteScroll>

const props = defineProps<{
  currentList: any[]
  loadNextPage: () => Promise<void>
  retry: () => Promise<void>
  hasError: boolean
  isLoadingInitialData: boolean
}>()

const retryLoad = async () => {
  await props.retry()
}

const resetList = () => {
  infiniteScrollRef.value?.resetList()
}

defineExpose({
  resetList
})

</script>

<template>
  <div class="db-list flex-1 flex flex-col pt-1">
    <InfiniteScroll
      ref="infiniteScrollRef"
      :is-loading-initial-data="isLoadingInitialData"
      :current-list="currentList"
      :load-next-page="loadNextPage"
      :has-error="hasError"
      :component="BaseLineCrypto"
      :item-height="64"
    />

    <div v-if="hasError" class="error-request flex flex-1 p-5 text-l font-bold justify-center items-center">
      <div>{{ print("fetch_data_error") }}</div>
      <button
        type="button"
        class="inline-flex items-center p-2 ml-1 text-sm text-black rounded-lg bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-black dark:hover:bg-gray-200 dark:focus:ring-gray-600"
        @click="retryLoad"
      >
        {{ print("retry") }}
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.db-list {
  position: relative;
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
</style>
