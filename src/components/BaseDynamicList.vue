<script setup lang="ts">
  import { ref, onMounted, computed, watch, DefineComponent, defineExpose, VNodeRef } from "vue"
  import { useInfiniteScroll } from "@vueuse/core"
  import { Spinner } from "@/app.organizer"
  import { TDynamicSort } from "./BaseDynamicSorts.vue"
  import { useScroll } from "@vueuse/core"

  type TDynamicsFilters = {
    [ref: string]: {
      indexes: string[]
      values: string[]
    }
  }

  const props = defineProps<{
    items: Map<string, any>
    itemsByBloc: number
    component: DefineComponent<any, any, any>
    componentKey: string
    watcher: any
    noResultText: string
    loaderColor?: string
  }>()

  const emit = defineEmits<{(e: "onRequestNextBloc", {}): void}>()

  const items = computed(() => {
    const list = props.items
    const start = (blocCurrent.value - 1) * props.itemsByBloc
    const end = blocCurrent.value * props.itemsByBloc
    return Array.from(list.values()).slice(start, end)
  })

  const blocCurrent = ref(0)
  const scroller = ref<VNodeRef & HTMLElement>()
  const dynamicLoading = ref(false)
  const dynamicFilters = ref({} as TDynamicsFilters)
  const dynamicSorter = ref({} as TDynamicSort)

  const onReset = async () => {
    dynamicFilters.value = {} as TDynamicsFilters
    blocCurrent.value = 1
    if (scroller.value) scroller.value.scrollTo(0, 0)
  }

  useScroll(scroller, { behavior: "smooth" })

  useInfiniteScroll(
    scroller,
    () => {
      blocCurrent.value++
    },
    { distance: 200 },
  )

  onMounted(() => {
    blocCurrent.value += 1
  })

  defineExpose({
    onReset,
  })
</script>

<template>
  <div ref="scroller" class="scroller h-10 overflow-y-scroll flex-auto">
    <div
      v-if="!items.length"
      class="flex flex-1 h-full text-4xl font-bold justify-center items-center"
      :style="{ color: props.loaderColor }"
    >
      {{ props.noResultText }}
    </div>
    <div v-else-if="dynamicLoading" class="flex centered p-5">
      <Spinner />
    </div>
    <template v-else>
      <component
        :is="props.component"
        v-for="item in items"
        :key="`${item[props.componentKey]}`"
        :item-id="item.id"
      />
    </template>
  </div>
</template>

<style lang="scss">
.centered {
  justify-content: center;
  align-items: center;
}
.scroller {
  scrollbar-color: #687dfa rgba(0, 0, 0, 0.1);
  scrollbar-width: thin;
}
</style>
