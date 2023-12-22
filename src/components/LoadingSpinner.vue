<template>
  <div class="spinner">
    <svg class="spinner-circle" viewBox="0 0 50 50">
      <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
}

.spinner-circle {
  width: 100%;
  height: 100%;
  animation: spin 1s linear infinite;
}

.spinner .path {
  stroke: #000;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

#app.dark {
  .spinner .path {
    stroke: #ddd;
  }
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
