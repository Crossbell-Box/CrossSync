<template>
    <h1 class="flex text-4xl font-bold my-5 py-4">Settings</h1>
    <div class="flex flex-col">
        <el-col class="flex flex-col gap-3">
            <el-card shadow="hover" class="cursor-pointer" @click="switchcharacter">
                <div class="flex flex-row" style="justify-content: space-between">
                    <div class="flex">Switch Character</div>
                    <div class="flex w-4">
                        <ArrowRight />
                    </div>
                </div>
            </el-card>
            <el-card shadow="hover" class="cursor-pointer" @click="switchAccount">
                <div class="flex flex-row" style="justify-content: space-between">
                    <div class="flex">Switch Account</div>
                    <div class="flex w-4">
                        <ArrowRight />
                    </div>
                </div>
            </el-card>
            <el-card shadow="hover" class="cursor-pointer">
                <div class="flex flex-row" style="justify-content: space-between">
                    <div class="flex">Syncing</div>
                    <div class="flex">
                        <el-switch class="switch h-6" v-model="isSyncing" @change="setSyncing" />
                    </div>
                </div>
            </el-card>
            <el-card shadow="hover" class="cursor-pointer">
                <div class="flex flex-row" style="justify-content: space-between">
                    <div class="flex">Only show notes from CrossSync</div>
                    <div class="flex">
                        <el-switch class="switch h-6" v-model="isNotesCSSCOnly" @change="setNotesCSSCOnly" />
                    </div>
                </div>
            </el-card>
        </el-col>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';
import { ArrowRight } from '@element-plus/icons-vue';
import { ref, watchEffect } from 'vue';

const router = useRouter();
const store = useStore();

const isSyncing = ref(store.state.settings.syncing && !!store.state.settings.handle);
const isNotesCSSCOnly = ref(store.state.settings.notesShowCSSCOnly);

if (store.state.settings.address) {
    if (!store.state.characters?.list.length) {
        router.push('/mint');
    } else if (!store.state.settings.handle) {
        router.push('/characters');
    }
} else {
    router.push('/');
}

const switchcharacter = () => {
    router.push('/characters');
};

const switchAccount = async () => {
    await store.dispatch('reset');
    await router.push('/');
};

const setSyncing = async () => {
    await store.dispatch('setSettings', {
        syncing: isSyncing.value,
    });
};

const setNotesCSSCOnly = async () => {
    await store.dispatch('setSettings', {
        notesShowCSSCOnly: isNotesCSSCOnly.value,
    });
};

watchEffect(() => {
    isSyncing.value = store.state.settings.syncing && !!store.state.settings.handle;
    isNotesCSSCOnly.value = store.state.settings.notesShowCSSCOnly;
});
</script>

<style></style>
