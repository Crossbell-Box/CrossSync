<template>
    <div class="flex w-full h-full px-8 max-w-screen-lg">
        <Sidebar />
        <div class="flex-1 flex flex-col">
            <h1 class="flex text-4xl font-bold my-5 py-4">Settings</h1>
            <div class="flex flex-col">
                <el-col class="flex flex-col gap-3">
                    <el-card shadow="hover" class="cursor-pointer" @click="switchProfile">
                        <div class="flex flex-row" style="justify-content: space-between">
                            <div class="flex">Switch Profile</div>
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
                                <el-switch class="switch" v-model="isSyncing" @change="setSyncing" />
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';
import Sidebar from '@/components/Sidebar.vue';
import { ArrowRight } from '@element-plus/icons-vue';
import { disconnect } from '@/common/wallet';
import { ElMessageBox } from 'element-plus';
import { ref } from 'vue';

const router = useRouter();
const store = useStore();

const isSyncing = ref(store.state.settings.syncing);

if (store.state.settings.address) {
    if (!store.state.profiles?.list.length) {
        router.push('/mint');
    } else if (!store.state.settings.handle) {
        router.push('/profiles');
    }
} else {
    router.push('/');
}

const switchProfile = () => {
    router.push('/profiles');
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
</script>

<style>
.switch {
    @apply h-6 !important;
}
</style>
