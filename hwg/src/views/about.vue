<template>
  <div>
    <h1>这是关于页！</h1>
    <button @click="to">前往</button>
  </div>
</template>
<script setup lang="ts">
import { router } from '@/router';

function to() {
  router.push('/')
}
</script>
