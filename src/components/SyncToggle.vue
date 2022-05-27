<template>
    <div class="cursor-pointer opacity-50" :class="isSyncing ? [] : ['grayscale']" @click="toggleSyncing">
        <span class="logo" v-html="logo"></span>
    </div>
</template>

<script setup lang="ts">
import { bucket, getSettings } from '@/common/store';
import { ref } from 'vue';
import logo from '../assets/logo.svg?raw';

const isSyncing = ref(true);
const toggleSyncing = async () => {
    const settings = await getSettings();
    settings.syncing = !settings.syncing;
    await bucket.set(settings);
};

bucket.valueStream.subscribe((values) => {
    isSyncing.value = values.syncing;
});
</script>

<style>
.logo svg {
    width: 36px;
    height: 36px;
}
</style>
