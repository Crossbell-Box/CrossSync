<template>
    <div class="flex cursor-pointer">
        <el-tooltip
            placement="top"
            :content="
                typeof isSyncing === 'string' ? isSyncing : isSyncing ? 'CrossSync Enabled' : 'CrossSync Disabled'
            "
        >
            <div
                class="flex w-8 h-8"
                :class="{
                    'fill-[#5088ff]': isSyncing === true,
                    'fill-[#E6A23C]': typeof isSyncing === 'string', // or isSyncing !== !!isSyncing
                    grayscale: isSyncing === false,
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

const isSyncing = ref<boolean | string>('Loading...');
const available = ref(false);
const toggleSyncing = async () => {
    const settings = await getSettings();
    if (!settings.handle) {
        await chrome.runtime.sendMessage({
            type: 'open-options',
        });
    }
    if (typeof settings.syncing === 'string') {
        settings.syncing = true;
    } else {
        settings.syncing = !settings.syncing;
    }
    await bucket.set(settings);
};

bucket.valueStream.subscribe((values) => {
    if (values.syncing === undefined) {
        console.log('Syncing is undefined');
        values.syncing = true;
    }
    isSyncing.value = values.syncing;
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
