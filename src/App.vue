<script setup lang="ts">
import { Auth } from '@vk-ecosystem/sdk'
import { useAuth } from './utils/useAuth';
import { useMessenger } from './utils/useMessenger';

const { getAndSetSuperAppToken } = useAuth()
const { openMessenger, openMessengerWithPeerId} = useMessenger()

</script>

<template>
  <div>
    <button @click="Auth.login">Запустить авторизацию</button>

    <button @click="getAndSetSuperAppToken">Get & Set tokens</button>

    <button @click="openMessenger">Открыть виджет ВК мессенжера</button>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
