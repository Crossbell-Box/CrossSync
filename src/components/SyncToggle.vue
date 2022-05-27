<template>
    <div class="cursor-pointer opacity-50 ml-4" :class="isSyncing ? [] : ['grayscale']" @click="toggleSyncing">
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
    if (!settings.handle) {
        await chrome.runtime.sendMessage({
            type: 'open-options',
        });
    }
    settings.syncing = !settings.syncing;
    await bucket.set(settings);
};

bucket.valueStream.subscribe((values) => {
    if (values.syncing === undefined) {
        values.syncing = true;
    }
    isSyncing.value = values.syncing && !!values.handle;
});
</script>

<style>
.logo svg {
    width: 36px;
    height: 36px;
}
</style>
