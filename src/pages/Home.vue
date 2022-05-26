<template>
    <div class="flex w-full h-full px-8 max-w-screen-lg">
        <Sidebar />
        <router-view></router-view>
    </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
</script>

<style>
#app {
    height: 100%;
}
</style>
