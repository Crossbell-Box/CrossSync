<template>
    <div class="flex w-full h-full px-8 max-w-screen-lg">
        <Sidebar />
        <div class="flex-1 flex flex-col w-0">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
</script>

<style></style>
