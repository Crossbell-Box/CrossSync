<template>
    <div class="w-80 flex flex-col">
        <div v-if="profile">
            <Profile
                class="mb-0 rounded-br-none cursor-pointer border-0"
                :profile="profile"
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
import Profile from '@/components/Profiles.vue';
// import {useRouter} from "vue-router";
import { useStore } from '@/common/store';
import { ref, watchEffect } from 'vue';

// const router = useRouter();
const store = useStore();

const profile = ref<any>({});

const isSyncing = ref(store.state.settings.syncing);

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
    if (!store.state.profiles?.list.length) {
        expand();
    } else {
        profile.value =
            store.state.profiles!.list.find((profile) => profile.username === store.state.settings.handle) ||
            store.state.profiles!.list[0]; // As a fallback, use the first profile
    }
};

await init();

watchEffect(() => {
    isSyncing.value = store.state.settings.syncing;
});
</script>
