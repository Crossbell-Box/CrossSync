<template>
    <Suspense>
        <Provider />
    </Suspense>
</template>

<script setup lang="ts">
import Provider from './pages/Provider.vue';
</script>

<style>
body {
    font-size: 100%;
}

html,
body {
    height: 100%;
}

#app {
    min-height: 100%;
}

#app {
    font-family: SFCompactRounded, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
