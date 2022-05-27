<template>
    <div class="flex w-8 h-8 cursor-pointer">
        <el-tooltip placement="top" :content="isSyncing ? 'CrossSync Enabled' : 'CrossSync Disabled'">
            <div class="flex w-full h-full opacity-50" :class="isSyncing ? [] : ['grayscale']" @click="toggleSyncing">
                <span class="flex w-full h-full items-center logo" v-html="logo" />
            </div>
        </el-tooltip>
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
