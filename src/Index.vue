<template>
    <div class="absolute left-8 top-8">
        <router-link to="/"><img class="inline-block rounded-full" width="50" src="./assets/logo.jpeg" /></router-link>
    </div>
    <Suspense>
        <Provider />
    </Suspense>
    <div class="absolute bottom-8 text-slate-400">@ Natural Selection Labs</div>
</template>

<script setup lang="ts">
import Provider from './pages/Provider.vue';
</script>

<style>
html,
body,
#app {
    height: 100%;
}

#app {
    font-family: SFCompactRounded, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
