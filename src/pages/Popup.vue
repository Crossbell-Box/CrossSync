<template>
    <div class="w-80 flex flex-col">
        <div v-if="character">
            <Character
                class="mb-0 rounded-br-none cursor-pointer border-0"
                :character="character"
                size="small"
                @click="expand"
            />
            <el-card shadow="hover" class="menu cursor-pointer mt-2 border-0">
                <div class="flex flex-row" style="justify-content: space-between">
                    <div class="flex">Syncing</div>
                    <div class="flex">
                        <el-switch class="switch h-6" v-model="isSyncing" @change="setSyncing" />
                    </div>
                </div>
            </el-card>
        </div>
        <div v-else>Time to setup!</div>
    </div>
</template>
<script setup lang="ts">
import Character from '@/components/Characters.vue';
import { useStore } from '@/common/store';
import { ref, watchEffect } from 'vue';

const store = useStore();

const character = ref<any>({});

const isSyncing = ref(store.state.settings.syncing && !!store.state.settings.handle);

const setSyncing = async () => {
    await store.dispatch('setSettings', {
        syncing: isSyncing.value,
    });
};

const expand = () => {
    // Expand options.html
    chrome.runtime.openOptionsPage();
};

const init = async () => {
    if (!store.state.characters?.list.length) {
        expand();
    } else {
        character.value =
            store.state.characters!.list.find((character) => character.username === store.state.settings.handle) ||
            store.state.characters!.list[0]; // As a fallback, use the first character
    }
};

await init();

watchEffect(() => {
    isSyncing.value = store.state.settings.syncing && !!store.state.settings.handle;
});
</script>
