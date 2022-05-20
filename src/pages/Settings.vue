<template>
    <div class="flex w-full h-full px-8">
        <Sidebar />
        <div class="flex-1 flex flex-col">
            <h1 class="flex text-4xl font-bold my-5 py-4">Settings</h1>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';
import Sidebar from '@/components/Sidebar.vue';

const router = useRouter();
const store = useStore();
</script>

<style></style>
