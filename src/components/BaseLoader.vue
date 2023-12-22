<script setup lang="ts">
  import { Spinner } from "@/app.organizer"
  type Props = {
    text?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    text: "Loading",
  })
</script>

<template>
  <div class="index-loading z-20 pt-20 mx-auto w-5/6 max-w-screen-xl flex-1 flex justify-center items-center">
    <div class="text-3xl flex font-extrabold text-black dark:text-white">
      <div>{{ text }}</div>
      <Spinner />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flex {
  flex-direction: column;
  gap: 50px;
  justify-content: center;
  align-items: center;
}
</style>