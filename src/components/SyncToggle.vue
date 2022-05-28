<template>
    <div class="flex cursor-pointer">
        <el-tooltip placement="top" :content="isSyncing ? 'CrossSync Enabled' : 'CrossSync Disabled'">
            <div
                class="flex w-8 h-8"
                :class="{
                    grayscale: !isSyncing,
                    'opacity-50': !available,
                    'mr-2': available,
                }"
                @click="toggleSyncing"
            >
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
const available = ref(false);
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

const checkAvailable = () => {
    const button = document.querySelector(
        'div[data-testid="primaryColumn"] div[data-testid="tweetButtonInline"], div[data-testid="tweetButton"]',
    );
    available.value = !(button?.getAttribute('aria-disabled') === 'true');
};

checkAvailable();

document.addEventListener('keydown', () => {
    setTimeout(() => {
        checkAvailable();
    }, 0);
});
</script>

<style>
.logo svg {
    width: 36px;
    height: 36px;
}
</style>
