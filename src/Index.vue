<template>
    <div class="absolute left-8 top-8">
        <router-link to="/"><img class="inline-block rounded-full" width="50" src="./assets/logo.jpeg" /></router-link>
    </div>
    <router-view></router-view>
    <div class="absolute bottom-8 text-slate-400">@ Natural Selection Labs</div>
</template>

<script setup lang="ts"></script>

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
